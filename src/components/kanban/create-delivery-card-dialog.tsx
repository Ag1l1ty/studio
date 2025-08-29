
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
import type { Project } from '@/lib/types';
import { getProjectById } from '@/lib/data';
import React from 'react';

const formSchema = z.object({
    projectId: z.string().min(1, "Please select a project."),
    deliveryNumber: z.coerce.number().int().positive("Delivery number must be a positive integer."),
    budget: z.string().refine(val => !isNaN(Number(val.replace(/,/g, ''))), "Must be a number").transform(val => Number(val.replace(/,/g, ''))).pipe(z.number().positive("Budget must be a positive number.")),
    estimatedDate: z.date({ required_error: "An estimated date is required." }),
});


type CreateDeliveryCardDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    projects: Project[];
    onDeliveryCardCreated: (values: z.infer<typeof formSchema>) => void;
}

export function CreateDeliveryCardDialog({ isOpen, onOpenChange, projects, onDeliveryCardCreated }: CreateDeliveryCardDialogProps) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectId: "",
            deliveryNumber: 1,
            budget: 0,
        },
    });

    const selectedProjectId = form.watch('projectId');
    const selectedProject = React.useMemo(() => getProjectById(selectedProjectId), [selectedProjectId]);

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

    const deliveryNumberValidation = (deliveryNumber: number) => {
        if (!selectedProject) return true;
        const projectedDeliveries = selectedProject.projectedDeliveries || 0;
        // This validation is simplified. A real app would check existing delivery numbers.
        return deliveryNumber > 0 && deliveryNumber <= projectedDeliveries;
    }
    
    const budgetValidation = (budget: number) => {
        if (!selectedProject) return true;
        const remainingBudget = selectedProject.budget - selectedProject.budgetSpent;
        return budget <= remainingBudget;
    }

    const dynamicFormSchema = formSchema.refine(data => deliveryNumberValidation(data.deliveryNumber), {
        message: "Delivery number is invalid or exceeds projected deliveries.",
        path: ["deliveryNumber"],
    }).refine(data => budgetValidation(data.budget), {
        message: "Budget for this delivery exceeds remaining project budget.",
        path: ["budget"],
    });


    function onSubmit(values: z.infer<typeof formSchema>) {
        onDeliveryCardCreated(values);
        toast({
            title: "Delivery Card Created",
            description: `A new delivery card for project "${selectedProject?.name}" has been created.`,
        });
        form.reset();
        onOpenChange(false);
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
                    <DialogTitle>Create Delivery Card</DialogTitle>
                    <DialogDescription>
                        Fill in the details for the new delivery and associate it with a project.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                         <FormField
                            control={form.control}
                            name="projectId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a project" />
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
                                <div><span className="font-semibold">Projected Deliveries:</span> {selectedProject.projectedDeliveries}</div>
                                <div><span className="font-semibold">Deliveries Made:</span> {selectedProject.metrics.reduce((acc, m) => acc + m.deliveries, 0)}</div>
                                <div><span className="font-semibold">Total Budget:</span> ${selectedProject.budget.toLocaleString()}</div>
                                <div><span className="font-semibold">Remaining Budget:</span> ${(selectedProject.budget - selectedProject.budgetSpent).toLocaleString()}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="deliveryNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Delivery Number</FormLabel>
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
                                        <FormLabel>Budget for Delivery</FormLabel>
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
                                    <FormLabel>Estimated Delivery Date</FormLabel>
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
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
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
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={!selectedProject}>Create Card</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
