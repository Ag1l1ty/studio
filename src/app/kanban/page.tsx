
"use client";

import { useState } from 'react';
import type { Project, RiskLevel, ProjectStage, Delivery } from '@/lib/types';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { addProject, getProjects, getDeliveries, addDelivery, getProjectById } from '@/lib/data';
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
import { ListFilter, PlusCircle, ChevronDown } from 'lucide-react';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';
import { CreateDeliveryCardDialog } from '@/components/kanban/create-delivery-card-dialog';
import { addMonths, format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const STAGES: ProjectStage[] = ['Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado'];


export default function KanbanPage() {
    const [projects, setProjects] = useState(getProjects());
    const [deliveries, setDeliveries] = useState(getDeliveries());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set(projects.map(p => p.id)));
    const [isCreateProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
    const [isCreateDeliveryCardDialogOpen, setCreateDeliveryCardDialogOpen] = useState(false);
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

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        const movedDelivery = deliveries.find(d => d.id === draggableId);
        if (!movedDelivery) return;
        
        // Prevent moving from TST if fields are not filled
        if (movedDelivery.stage === 'Ambiente TST' && 
            STAGES.indexOf(destination.droppableId as ProjectStage) > STAGES.indexOf('Ambiente TST')) {
            if (movedDelivery.errorCount === undefined || movedDelivery.errorSolutionTime === undefined) {
                toast({
                    variant: 'destructive',
                    title: 'Campos requeridos incompletos',
                    description: 'Por favor, complete los campos de errores y tiempo de solución antes de mover la tarjeta.',
                })
                return;
            }
        }


        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        
        const newDeliveries = Array.from(deliveries);
        const deliveryIndex = newDeliveries.findIndex(d => d.id === draggableId);
        const delivery = newDeliveries[deliveryIndex];

        if (delivery) {
            const originalStage = delivery.stage;
            const newStage = destination.droppableId as ProjectStage;
            delivery.stage = newStage;

            // If the card is moved to the "Cerrado" column
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
                        if(delivery.errorCount) {
                            project.metrics[metricIndex].errors += delivery.errorCount;
                        }
                    } else {
                        // If no metric for this month, create one
                        project.metrics.push({
                            month: monthName,
                            deliveries: 1,
                            errors: delivery.errorCount || 0,
                            budget: delivery.budget, // This might need more sophisticated logic
                            spent: delivery.budget,
                        });
                    }
                    
                    // The project object is modified by reference from getProjectById, so we need to update the state
                    setProjects(getProjects());
                }
            }

            setDeliveries(newDeliveries);
        }
    };
    
    const handleArchiveDelivery = (deliveryId: string) => {
        setDeliveries(currentDeliveries => 
            currentDeliveries.map(d => 
                d.id === deliveryId ? { ...d, isArchived: true } : d
            )
        );
    };

    const handleUpdateDelivery = (deliveryId: string, updatedFields: Partial<Delivery>) => {
        setDeliveries(currentDeliveries =>
            currentDeliveries.map(d =>
                d.id === deliveryId ? { ...d, ...updatedFields } : d
            )
        );
    };

    const handleProjectCreated = (newProjectData: Omit<Project, 'id' | 'owner' | 'metrics' | 'riskLevel' | 'stage' | 'budgetSpent'>) => {
        const newProject: Project = {
            ...newProjectData,
            id: `PRJ-00${getProjects().length + 1}`,
            stage: 'Definición',
            riskLevel: 'Low', // Default risk level
            budgetSpent: 0,
            owner: { name: 'New User', avatar: '' }, // Placeholder owner
            metrics: [],
        };
        addProject(newProject);
        const updatedProjects = getProjects();
        setProjects(updatedProjects);
        setSelectedProjects(new Set(updatedProjects.map(p => p.id)));
    };
    
    const handleDeliveryCardCreated = (values: {projectId: string; deliveryNumber: number; budget: number; estimatedDate: Date}) => {
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
            owner: project.owner,
        };

        addDelivery(newDelivery);
        setDeliveries(getDeliveries());
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
                onProjectCreated={handleProjectCreated}
            />
             <CreateDeliveryCardDialog
                isOpen={isCreateDeliveryCardDialogOpen}
                onOpenChange={setCreateDeliveryCardDialogOpen}
                onDeliveryCardCreated={handleDeliveryCardCreated}
                projects={projects}
            />
        </DragDropContext>
    );
}
