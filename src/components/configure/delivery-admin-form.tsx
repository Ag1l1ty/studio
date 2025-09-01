
"use client";

import { useState } from 'react';
import { getDeliveries, getProjects, addDelivery, updateDelivery, deleteDelivery } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import type { ProjectStage, Delivery } from '@/lib/types';
import { CreateDeliveryCardDialog } from '@/components/kanban/create-delivery-card-dialog';
import { useToast } from '@/hooks/use-toast';
import * as z from 'zod';

const STAGES: ProjectStage[] = ['Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado'];

// This needs to be defined here or imported if it's extracted to a shared place
const createDeliveryFormSchema = (deliveries: Delivery[], currentDeliveryId?: string) => z.object({
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


export function DeliveryAdminForm() {
    const [deliveries, setDeliveries] = useState(getDeliveries());
    const [projects, setProjects] = useState(getProjects());
    const { isManager, isProjectManager } = useAuth();
    const { toast } = useToast();
    
    const [deliveryNumberFilter, setDeliveryNumberFilter] = useState('');
    const [projectFilter, setProjectFilter] = useState('all');
    const [stageFilter, setStageFilter] = useState('all');

    const [isCreateDeliveryCardDialogOpen, setCreateDeliveryCardDialogOpen] = useState(false);
    const [deliveryToEdit, setDeliveryToEdit] = useState<Delivery | null>(null);
    const [deliveryToDelete, setDeliveryToDelete] = useState<Delivery | null>(null);
    const [isConfirmingDelete, setConfirmingDelete] = useState(false);


    const filteredDeliveries = deliveries.filter(delivery => {
        const matchesDeliveryNumber = deliveryNumberFilter === '' || delivery.deliveryNumber.toString().includes(deliveryNumberFilter);
        const matchesProject = projectFilter === 'all' || delivery.projectId === projectFilter;
        const matchesStage = stageFilter === 'all' || delivery.stage === stageFilter;
        return matchesDeliveryNumber && matchesProject && matchesStage;
    });

    const handleDialogClose = () => {
        setCreateDeliveryCardDialogOpen(false);
        setDeliveryToEdit(null);
    };
    
    const handleEditClick = (delivery: Delivery) => {
        setDeliveryToEdit(delivery);
        setCreateDeliveryCardDialogOpen(true);
    };

    const handleDeleteClick = (delivery: Delivery) => {
        setDeliveryToDelete(delivery);
        setConfirmingDelete(true);
    };

    const handleConfirmDelete = () => {
        if (deliveryToDelete) {
            deleteDelivery(deliveryToDelete.id);
            setDeliveries(getDeliveries());
            toast({
                title: "Entrega Eliminada",
                description: `La entrega #${deliveryToDelete.deliveryNumber} ha sido eliminada.`,
            });
        }
        setConfirmingDelete(false);
        setDeliveryToDelete(null);
    };

    const handleDeliverySubmit = (values: z.infer<ReturnType<typeof createDeliveryFormSchema>>, id?: string) => {
        const project = projects.find(p => p.id === values.projectId);
        if (!project) return;

        if (id) {
            // Update existing delivery
            const originalDelivery = deliveries.find(d => d.id === id);
            if (!originalDelivery) return;

            const updatedDeliveryData = {
                ...originalDelivery,
                ...values,
                projectName: project.name,
                estimatedDate: values.estimatedDate.toISOString(),
            };
            const updated = updateDelivery(updatedDeliveryData);
            setDeliveries(deliveries.map(d => (d.id === id ? updated : d)));
            toast({
                title: "Entrega Actualizada",
                description: `La entrega #${values.deliveryNumber} ha sido actualizada.`,
            });
        } else {
            // Create new delivery
             const newDelivery: Delivery = {
                id: `DLV-00${getDeliveries().length + 1}`,
                projectId: project.id,
                projectName: project.name,
                deliveryNumber: values.deliveryNumber,
                stage: 'Definición', // Default stage
                budget: values.budget,
                estimatedDate: values.estimatedDate.toISOString(),
                creationDate: new Date().toISOString(),
                owner: project.owner,
            };
            addDelivery(newDelivery);
            setDeliveries(getDeliveries());
            toast({
                title: "Entrega Creada",
                description: `La entrega para el proyecto "${project.name}" ha sido creada.`,
            });
        }
        handleDialogClose();
    };

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Entregas</CardTitle>
                <CardDescription>
                    Administrar todas las tarjetas de entrega individuales en todos los proyectos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex items-center justify-between mb-4 gap-4">
                    <div className="flex items-center gap-2 flex-1">
                        <Input
                            placeholder="Filtrar por número de entrega..."
                            value={deliveryNumberFilter}
                            onChange={(e) => setDeliveryNumberFilter(e.target.value)}
                            className="max-w-xs"
                        />
                         <Select value={projectFilter} onValueChange={setProjectFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filtrar por proyecto" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los Proyectos</SelectItem>
                                {projects.map(project => (
                                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={stageFilter} onValueChange={setStageFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los Estados</SelectItem>
                                {STAGES.map(stage => (
                                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {(isManager || isProjectManager) && (
                        <Button onClick={() => setCreateDeliveryCardDialogOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Agregar Entrega
                        </Button>
                    )}
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Entrega</TableHead>
                                <TableHead>Proyecto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha Estimada</TableHead>
                                <TableHead>Presupuesto</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDeliveries.map(delivery => (
                                <TableRow key={delivery.id}>
                                    <TableCell className="font-medium">Entrega #{delivery.deliveryNumber}</TableCell>
                                    <TableCell>{delivery.projectName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{delivery.stage}</Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(delivery.estimatedDate), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>${delivery.budget.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                {(isManager || isProjectManager) && <DropdownMenuItem onClick={() => handleEditClick(delivery)}>Edit</DropdownMenuItem>}
                                                {isManager && <DropdownMenuItem onClick={() => handleDeleteClick(delivery)}>Delete</DropdownMenuItem>}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
        <CreateDeliveryCardDialog
            isOpen={isCreateDeliveryCardDialogOpen}
            onOpenChange={handleDialogClose}
            onDeliverySubmit={handleDeliverySubmit}
            projects={projects}
            deliveries={deliveries}
            delivery={deliveryToEdit}
        />
        <AlertDialog open={isConfirmingDelete} onOpenChange={setConfirmingDelete}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la entrega #{deliveryToDelete?.deliveryNumber}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmingDelete(false)}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirmDelete}>Sí, eliminar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}

    