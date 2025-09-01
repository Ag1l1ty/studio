
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Project, Delivery, ProjectStage } from '@/lib/types';
import React, { useEffect } from 'react';

const STAGES: ProjectStage[] = ['Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado'];

const createFormSchema = (deliveries: Delivery[], currentDeliveryId?: string) => z.object({
    projectId: z.string().min(1, "Please select a project."),
    deliveryNumber: z.coerce.number().int().positive("Delivery number must be a positive integer."),
    budget: z.any().refine(val => !isNaN(Number(String(val).replace(/,/g, ''))), "Must be a number").transform(val => Number(String(val).replace(/,/g, ''))).pipe(z.number().positive("Budget must be a positive number.")),
    estimatedDate: z.date({ required_error: "An estimated date is required." }),
    stage: z.string().optional(),
}).superRefine((data, ctx) => {
    const existingDeliveryNumbers = deliveries
        .filter(d => d.projectId === data.projectId && d.id !== currentDeliveryId)
        .map(d => d.deliveryNumber);

    if (existingDeliveryNumbers.includes(data.deliveryNumber)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "This delivery number already exists for this project.",
            path: ["deliveryNumber"],
        });
    }
});


type CreateDeliveryCardDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projects: Project[];
    deliveries: Delivery[];
    delivery?: Delivery | null;
    onDeliverySubmit: (values: z.infer<ReturnType<typeof createFormSchema>>, id?: string) => void;
}

export function CreateDeliveryCardDialog({ isOpen, onOpenChange, projects, deliveries, delivery, onDeliverySubmit }: CreateDeliveryCardDialogProps) {
    const { toast } = useToast();
    const formSchema = createFormSchema(deliveries, delivery?.id);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectId: "",
            deliveryNumber: 1,
            budget: 0,
            stage: 'Definición'
        },
    });
    
    // Reset form when dialog opens or delivery changes
    useEffect(() => {
        if (isOpen) {
            if (delivery) {
                // Edit mode
                form.reset({
                    projectId: delivery.projectId,
                    deliveryNumber: delivery.deliveryNumber,
                    budget: new Intl.NumberFormat('en-US').format(delivery.budget),
                    estimatedDate: new Date(delivery.estimatedDate),
                    stage: delivery.stage,
                });
            } else {
                // Create mode
                form.reset({
                    projectId: "",
                    deliveryNumber: 1,
                    budget: 0,
                    estimatedDate: undefined,
                    stage: 'Definición',
                });
            }
        }
    }, [isOpen, delivery, form]);

    const selectedProjectId = form.watch('projectId');
    const selectedProject = React.useMemo(() => projects.find(p => p.id === selectedProjectId), [selectedProjectId, projects]);

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
        const value = e.target.value;
        const numericValue = value.replace(/[^0-9]/g, '');
        if (numericValue) {
            const formattedValue = new Intl.NumberFormat('en-US').format(Number(numericValue));
            field.onChange(formattedValue);
        } else {
            field.onChange('');
        }
    }
    
    const budgetValidation = (budget: number) => {
        if (!selectedProject) return true;
        const otherDeliveriesBudget = deliveries
            .filter(d => d.projectId === selectedProject.id && d.id !== delivery?.id)
            .reduce((sum, d) => sum + d.budget, 0);
        const remainingBudget = selectedProject.budget - otherDeliveriesBudget;
        return budget <= remainingBudget;
    }

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!selectedProject) return;

        if (!delivery) {
             const deliveriesMade = selectedProject.metrics.reduce((acc, m) => acc + m.deliveries, 0);
            if (selectedProject.projectedDeliveries && deliveriesMade >= selectedProject.projectedDeliveries) {
                toast({
                    variant: 'destructive',
                    title: "Cannot Create Delivery",
                    description: "This project has already reached its projected number of deliveries.",
                });
                return;
            }
        }

        if (!budgetValidation(values.budget)) {
            form.setError("budget", {
                type: "manual",
                message: "Budget for this delivery exceeds remaining project budget.",
            });
            return;
        }

        onDeliverySubmit(values, delivery?.id);
    }
    
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
        }
        onOpenChange(open);
    }

    return (
         <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>{delivery ? 'Editar Entrega' : 'Crear Tarjeta de Entrega'}</DialogTitle>
                    <DialogDescription>
                        {delivery ? 'Actualice los detalles de la entrega.' : 'Complete los detalles de la nueva entrega y asóciela a un proyecto.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                         <FormField
                            control={form.control}
                            name="projectId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Proyecto</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!delivery}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar un proyecto" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {projects.filter(p => p.stage !== 'Cerrado').map(p => (
                                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        {selectedProject && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm p-3 bg-muted/50 rounded-lg border">
                                <div><span className="font-semibold">Entregas Proyectadas:</span> {selectedProject.projectedDeliveries}</div>
                                <div><span className="font-semibold">Entregas Realizadas:</span> {selectedProject.metrics.reduce((acc, m) => acc + m.deliveries, 0)}</div>
                                <div><span className="font-semibold">Presupuesto Total:</span> ${selectedProject.budget.toLocaleString()}</div>
                                <div><span className="font-semibold">Presupuesto Restante:</span> ${(selectedProject.budget - deliveries.filter(d => d.projectId === selectedProject.id).reduce((sum, d) => sum + d.budget, 0)).toLocaleString()}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="deliveryNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número de Entrega</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" step="1" {...field} disabled={!selectedProject} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="budget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Presupuesto para Entrega</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                onChange={(e) => handleBudgetChange(e, field)} 
                                                disabled={!selectedProject} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                         <FormField
                            control={form.control}
                            name="estimatedDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha Estimada de Entrega</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    disabled={!selectedProject}
                                                >
                                                    {field.value ? format(field.value, "PPP") : <span>Elegir una fecha</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                                fixedWeeks
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                         {delivery && (
                            <FormField
                                control={form.control}
                                name="stage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar un estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {STAGES.map(stage => (
                                                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancelar</Button>
                            <Button type="submit" disabled={!selectedProject}>{delivery ? 'Guardar Cambios' : 'Crear Tarjeta'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

    