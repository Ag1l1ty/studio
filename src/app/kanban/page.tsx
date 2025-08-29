
"use client";

import { useState } from 'react';
import type { Project, RiskLevel, ProjectStage, Delivery } from '@/lib/types';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { addProject, getProjects, getDeliveries, addDelivery } from '@/lib/data';
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

const ALL_PROJECT_IDS: string[] = getProjects().map(p => p.id);
const STAGES: ProjectStage[] = ['Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado'];


export default function KanbanPage() {
    const [projects, setProjects] = useState(getProjects());
    const [deliveries, setDeliveries] = useState(getDeliveries());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set(ALL_PROJECT_IDS));
    const [isCreateProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
    const [isCreateDeliveryCardDialogOpen, setCreateDeliveryCardDialogOpen] = useState(false);

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
        const matchesSearch = delivery.projectName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProject = selectedProjects.size === 0 || selectedProjects.has(delivery.projectId);
        return matchesSearch && matchesProject;
    });

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        
        const newDeliveries = Array.from(deliveries);
        const delivery = newDeliveries.find(d => d.id === draggableId);

        if (delivery) {
            delivery.stage = destination.droppableId as ProjectStage;
            // Note: This only updates the local state. 
            // In a real app, you'd call an API to persist this change.
            setDeliveries(newDeliveries);
        }
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
        setProjects(getProjects());
    };
    
    const handleDeliveryCardCreated = (values: {projectId: string; deliveryNumber: number; budget: number; estimatedDate: Date}) => {
        const project = projects.find(p => p.id === values.projectId);
        if (!project) return;

        const newDelivery: Delivery = {
            id: `DLV-00${deliveries.length + 1}`,
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
        setProjects(getProjects());
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
                    <KanbanBoard deliveries={filteredDeliveries} stages={STAGES} />
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
