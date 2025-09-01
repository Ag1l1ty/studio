
"use client";

import { useState } from 'react';
import { getDeliveries, getProjects, addDelivery } from '@/lib/data';
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
const createDeliveryFormSchema = (deliveries: Delivery[]) => z.object({
    projectId: z.string().min(1, "Please select a project."),
    deliveryNumber: z.coerce.number().int().positive("Delivery number must be a positive integer."),
    budget: z.number().positive("Budget must be a positive number."),
    estimatedDate: z.date({ required_error: "An estimated date is required." }),
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

    const filteredDeliveries = deliveries.filter(delivery => {
        const matchesDeliveryNumber = deliveryNumberFilter === '' || delivery.deliveryNumber.toString().includes(deliveryNumberFilter);
        const matchesProject = projectFilter === 'all' || delivery.projectId === projectFilter;
        const matchesStage = stageFilter === 'all' || delivery.stage === stageFilter;
        return matchesDeliveryNumber && matchesProject && matchesStage;
    });

    const handleDeliveryCardCreated = (values: z.infer<ReturnType<typeof createDeliveryFormSchema>>) => {
        const project = projects.find(p => p.id === values.projectId);
        if (!project) return;

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
                                                {(isManager || isProjectManager) && <DropdownMenuItem>Edit</DropdownMenuItem>}
                                                {isManager && <DropdownMenuItem>Delete</DropdownMenuItem>}
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
            onOpenChange={setCreateDeliveryCardDialogOpen}
            onDeliveryCardCreated={handleDeliveryCardCreated}
            projects={projects}
            deliveries={deliveries}
        />
        </>
    );
}
