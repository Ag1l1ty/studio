
"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Project, User } from '@/lib/types';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const numberValue = z.custom<number>().refine(value => value > 0, {
    message: "Budget must be a positive number.",
});

const formSchema = z.object({
    name: z.string().min(3, "Project name must be at least 3 characters."),
    description: z.string().min(10, "Description must be at least 10 characters."),
    projectedDeliveries: z.coerce.number().int().positive("Projected deliveries must be a positive integer."),
    budget: z.string().refine(val => !isNaN(Number(val.replace(/,/g, ''))), "Must be a number").transform(val => Number(val.replace(/,/g, ''))).pipe(z.number().positive("Budget must be a positive number.")),
    startDate: z.date({ required_error: "A start date is required." }),
    endDate: z.date({ required_error: "An end date is required." }),
    ownerId: z.string().min(1, "An owner is required."),
}).refine(data => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
});


type CreateProjectDialogProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onProjectSubmit: (values: z.infer<typeof formSchema>, id?: string) => void;
    project?: Project | null;
    users: User[];
}

export function CreateProjectDialog({ isOpen, onOpenChange, onProjectSubmit, project, users }: CreateProjectDialogProps) {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            projectedDeliveries: 1,
            budget: 0,
            ownerId: "",
        },
    });
    
    useEffect(() => {
        if (isOpen) {
            if (project) {
                 form.reset({
                    name: project.name,
                    description: project.description,
                    projectedDeliveries: project.projectedDeliveries,
                    budget: new Intl.NumberFormat('en-US').format(project.budget), // Format as string for the input
                    startDate: new Date(project.startDate),
                    endDate: new Date(project.endDate),
                    ownerId: project.owner.id,
                });
            } else {
                form.reset({
                    name: "",
                    description: "",
                    projectedDeliveries: 1,
                    budget: 0,
                    startDate: undefined,
                    endDate: undefined,
                    ownerId: "",
                });
            }
        }
    }, [isOpen, project, form]);


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


    function onSubmit(values: z.infer<typeof formSchema>) {
        onProjectSubmit(values, project?.id);
    }
    
    // We need to stop the form from submitting when the dialog closes
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
                    <DialogTitle>{project ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</DialogTitle>
                    <DialogDescription>
                         {project ? 'Actualice los detalles del proyecto.' : 'Complete los detalles a continuación para crear un nuevo proyecto.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., AI-Powered Claims Processing" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe the project's goals and scope." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="projectedDeliveries"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Projected Deliveries</FormLabel>
                                        <FormControl>
                                            <Input type="number" min="1" step="1" placeholder="e.g., 10" {...field} />
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
                                        <FormLabel>Total Budget</FormLabel>
                                        <FormControl>
                                             <Input 
                                                placeholder="e.g., 500,000"
                                                {...field}
                                                onChange={(e) => handleBudgetChange(e, field)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                         <FormField
                            control={form.control}
                            name="ownerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Owner</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a project owner" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users.map(user => (
                                                <SelectItem key={user.id} value={user.id}>{user.firstName} {user.lastName}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="text-sm font-medium">Projected Dates per Delivery</div>
                        <div className="p-4 border rounded-md bg-secondary/50 text-muted-foreground text-sm">
                            Functionality to set individual dates for each of the <strong>{form.watch('projectedDeliveries') || 0}</strong> deliveries will be available here soon.
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Start Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
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
                             <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>End Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
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
                                                    disabled={(date) => date < (form.getValues("startDate") || new Date())}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancel</Button>
                            <Button type="submit">{project ? 'Guardar Cambios' : 'Crear Proyecto'}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
