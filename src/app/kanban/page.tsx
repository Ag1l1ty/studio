
"use client";

import { useState } from 'react';
import type { Project, RiskLevel, ProjectStage, Delivery } from '@/lib/types';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { addProject, getProjects, getDeliveries, addDelivery, updateDelivery, getProjectById } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
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
import { ListFilter, PlusCircle, ChevronDown } from 'lucide-react';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';
import { CreateDeliveryCardDialog } from '@/components/kanban/create-delivery-card-dialog';
import { addMonths, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import * as z from 'zod';

const STAGES: ProjectStage[] = ['Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado'];

type PendingMove = {
    deliveryId: string;
    destination: DropResult['destination'];
} | null;

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


export default function KanbanPage() {
    const { isManager, isProjectManager } = useAuth();
    const [projects, setProjects] = useState(getProjects());
    const [deliveries, setDeliveries] = useState(getDeliveries());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set(projects.map(p => p.id)));
    const [isCreateProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
    const [isCreateDeliveryCardDialogOpen, setCreateDeliveryCardDialogOpen] = useState(false);
    const [isConfirmingMove, setConfirmingMove] = useState(false);
    const [pendingMove, setPendingMove] = useState<PendingMove>(null);
    const [isConfirmingArchive, setConfirmingArchive] = useState(false);
    const [deliveryToArchive, setDeliveryToArchive] = useState<string | null>(null);
    const { toast } = useToast();

    const handleProjectToggle = (projectId: string) => {
        const newProjects = new Set(selectedProjects);
        if (newProjects.has(projectId)) {
            newProjects.delete(projectId);
        } else {
            newProjects.add(projectId);
        }
        setSelectedProjects(newProjects);
    };
    
    const filteredDeliveries = deliveries.filter(delivery => {
        if (delivery.isArchived) {
            return false;
        }
        const matchesSearch = delivery.projectName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProject = selectedProjects.size === 0 || selectedProjects.has(delivery.projectId);
        return matchesSearch && matchesProject;
    });

    const executeMove = (deliveryId: string, destination: DropResult['destination']) => {
        if (!destination) return;

        const delivery = deliveries.find(d => d.id === deliveryId);

        if (delivery) {
            const originalStage = delivery.stage;
            const newStage = destination.droppableId as ProjectStage;
            
            const updatedDelivery: Delivery = { ...delivery, stage: newStage };

            if (newStage === 'Cerrado' && originalStage !== 'Cerrado') {
                const project = getProjectById(delivery.projectId);
                if (project) {
                    project.budgetSpent += delivery.budget;
                    
                    const deliveryDate = new Date(delivery.estimatedDate);
                    const monthName = format(deliveryDate, 'MMM');
                    
                    const metricIndex = project.metrics.findIndex(m => m.month === monthName);

                    if (metricIndex > -1) {
                        project.metrics[metricIndex].deliveries += 1;
                        project.metrics[metricIndex].spent += delivery.budget;
                        if(typeof delivery.errorCount === 'number') {
                            project.metrics[metricIndex].errors += delivery.errorCount;
                        }
                    } else {
                        project.metrics.push({
                            month: monthName,
                            deliveries: 1,
                            errors: delivery.errorCount || 0,
                            budget: delivery.budget,
                            spent: delivery.budget,
                        });
                    }
                    setProjects(getProjects());
                }
            }
             updateDelivery(updatedDelivery);
             setDeliveries(getDeliveries());
        }
    };


    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const movedDelivery = deliveries.find(d => d.id === draggableId);
        if (!movedDelivery) return;

        const sourceIndex = STAGES.indexOf(source.droppableId as ProjectStage);
        const destinationIndex = STAGES.indexOf(destination.droppableId as ProjectStage);
        const tstIndex = STAGES.indexOf('Ambiente TST');

        if (sourceIndex < tstIndex && destinationIndex > tstIndex) {
            toast({
                variant: 'destructive',
                title: 'Movimiento no permitido',
                description: 'Debe mover la tarjeta a "Ambiente TST" antes de pasar a etapas posteriores.',
            });
            return;
        }
        
        const isMovingFromTst = movedDelivery.stage === 'Ambiente TST' && destinationIndex > tstIndex;
        
        if (isMovingFromTst) {
            if (movedDelivery.errorCount === undefined || movedDelivery.errorSolutionTime === undefined) {
                toast({
                    variant: 'destructive',
                    title: 'Campos requeridos incompletos',
                    description: 'Por favor, complete los campos de errores y tiempo de solución antes de mover la tarjeta.',
                });
                return;
            }
            
            if (movedDelivery.errorCount === 0 || movedDelivery.errorSolutionTime === 0) {
                setPendingMove({ deliveryId: draggableId, destination });
                setConfirmingMove(true);
                return;
            }
        }
        
        executeMove(draggableId, destination);
    };

    const handleConfirmMove = () => {
        if (pendingMove) {
            executeMove(pendingMove.deliveryId, pendingMove.destination);
        }
        setConfirmingMove(false);
        setPendingMove(null);
    };

    const handleCancelMove = () => {
        setConfirmingMove(false);
        setPendingMove(null);
    };
    
    const handleArchiveDelivery = (deliveryId: string) => {
        setDeliveryToArchive(deliveryId);
        setConfirmingArchive(true);
    };

    const handleConfirmArchive = () => {
        if (deliveryToArchive) {
            const delivery = deliveries.find(d => d.id === deliveryToArchive);
            if(delivery) {
                updateDelivery({ ...delivery, isArchived: true });
                setDeliveries(getDeliveries());
            }
        }
        setConfirmingArchive(false);
        setDeliveryToArchive(null);
    };

    const handleCancelArchive = () => {
        setConfirmingArchive(false);
        setDeliveryToArchive(null);
    };

    const handleUpdateDelivery = (deliveryId: string, updatedFields: Partial<Delivery>) => {
        const delivery = deliveries.find(d => d.id === deliveryId);
        if (delivery) {
            updateDelivery({ ...delivery, ...updatedFields });
            setDeliveries(getDeliveries());
        }
    };

    const handleProjectCreated = (newProjectData: Omit<Project, 'id' | 'owner' | 'metrics' | 'riskLevel' | 'stage' | 'budgetSpent' | 'startDate' | 'endDate'> & { startDate: Date; endDate: Date }) => {
        const newProject: Project = {
            ...newProjectData,
            id: `PRJ-00${getProjects().length + 1}`,
            stage: 'Definición',
            riskLevel: 'Low',
            budgetSpent: 0,
            owner: { name: 'New User', avatar: '' },
            metrics: [],
            startDate: newProjectData.startDate.toISOString(),
            endDate: newProjectData.endDate.toISOString(),
        };
        addProject(newProject);
        const updatedProjects = getProjects();
        setProjects(updatedProjects);
        setSelectedProjects(new Set(updatedProjects.map(p => p.id)));
        toast({
            title: "Project Created",
            description: `A new project "${newProject.name}" has been created.`,
        });
        setCreateProjectDialogOpen(false);
    };
    
     const handleDeliverySubmit = (values: z.infer<ReturnType<typeof createDeliveryFormSchema>>, id?: string) => {
        const project = projects.find(p => p.id === values.projectId);
        if (!project) return;

        if (id) {
           // This page doesn't handle updates, only creation.
           // Updates are handled in the admin page.
        } else {
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
                title: "Delivery Card Created",
                description: `A new delivery card for project "${project?.name}" has been created.`,
            });
        }
    }


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col flex-1 h-full">
                <div className="flex items-center gap-4 p-4 md:p-8 md:pb-4 pb-2 border-b">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search deliveries..."
                            className="w-full max-w-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <ListFilter className="mr-2 h-4 w-4" />
                                Filter by Project
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by Project</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {projects.map(p => (
                                <DropdownMenuCheckboxItem
                                    key={p.id}
                                    checked={selectedProjects.has(p.id)}
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={() => handleProjectToggle(p.id)}
                                >
                                    {p.name}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                     {(isManager || isProjectManager) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                 <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Create
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setCreateProjectDialogOpen(true)}>
                                    Create New Project
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setCreateDeliveryCardDialogOpen(true)}>
                                    Create Delivery Card
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <div className="flex-1 overflow-x-auto p-4 md:p-8">
                    <KanbanBoard 
                        deliveries={filteredDeliveries} 
                        stages={STAGES} 
                        onArchiveDelivery={handleArchiveDelivery}
                        onUpdateDelivery={handleUpdateDelivery}
                    />
                </div>
            </div>
            <CreateProjectDialog 
                isOpen={isCreateProjectDialogOpen}
                onOpenChange={setCreateProjectDialogOpen}
                onProjectSubmit={handleProjectCreated}
            />
             <CreateDeliveryCardDialog
                isOpen={isCreateDeliveryCardDialogOpen}
                onOpenChange={setCreateDeliveryCardDialogOpen}
                onDeliverySubmit={handleDeliverySubmit}
                projects={projects}
                deliveries={deliveries}
            />
            <AlertDialog open={isConfirmingMove} onOpenChange={setConfirmingMove}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Movimiento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Los campos de errores o tiempo de solución están en cero. ¿Estás seguro de que no hubo errores en esta entrega y deseas mover la tarjeta?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelMove}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmMove}>Sí, mover tarjeta</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
             <AlertDialog open={isConfirmingArchive} onOpenChange={setConfirmingArchive}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                           Esta acción no se puede deshacer. Esto archivará permanentemente la tarjeta de entrega.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleCancelArchive}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmArchive}>Sí, archivar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DragDropContext>
    );
}

    

    