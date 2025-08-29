
"use client";

import { useState } from 'react';
import type { Project, RiskLevel, ProjectStage } from '@/lib/types';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { addProject, getProjects } from '@/lib/data';
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

const ALL_RISKS: RiskLevel[] = ['Low', 'Medium', 'High'];
const STAGES: ProjectStage[] = ['Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado'];


export default function KanbanPage() {
    const [projects, setProjects] = useState(getProjects());
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRisks, setSelectedRisks] = useState<Set<RiskLevel>>(new Set(ALL_RISKS));
    const [isCreateProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
    const [isCreateDeliveryCardDialogOpen, setCreateDeliveryCardDialogOpen] = useState(false);

    const handleRiskToggle = (risk: RiskLevel) => {
        const newRisks = new Set(selectedRisks);
        if (newRisks.has(risk)) {
            newRisks.delete(risk);
        } else {
            newRisks.add(risk);
        }
        setSelectedRisks(newRisks);
    };
    
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRisk = selectedRisks.size === 0 || selectedRisks.has(project.riskLevel);
        return matchesSearch && matchesRisk;
    });

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }
        
        const newProjects = Array.from(projects);
        const project = newProjects.find(p => p.id === draggableId);

        if (project) {
            project.stage = destination.droppableId as ProjectStage;
            // Note: This only updates the local state. 
            // In a real app, you'd call an API to persist this change.
            setProjects(newProjects);
        }
    };

    const handleProjectCreated = (newProject: Omit<Project, 'id' | 'owner' | 'metrics' | 'riskLevel' | 'stage' | 'budgetSpent'>) => {
        const project: Project = {
            ...newProject,
            id: `PRJ-00${getProjects().length + 1}`,
            stage: 'Definición',
            riskLevel: 'Low', // Default risk level
            budgetSpent: 0,
            owner: { name: 'New User', avatar: '' }, // Placeholder owner
            metrics: [],
        };
        addProject(project);
        setProjects(getProjects());
    };


    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col flex-1 h-full">
                <div className="flex items-center gap-4 p-4 md:p-8 md:pb-4 pb-2 border-b">
                    <div className="relative flex-1">
                        <Input
                            placeholder="Search projects..."
                            className="w-full max-w-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <ListFilter className="mr-2 h-4 w-4" />
                                Filter
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter by Risk</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {ALL_RISKS.map(risk => (
                                <DropdownMenuCheckboxItem
                                    key={risk}
                                    checked={selectedRisks.has(risk)}
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={() => handleRiskToggle(risk)}
                                >
                                    {risk}
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
                    <KanbanBoard projects={filteredProjects} stages={STAGES} />
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
                projects={projects}
            />
        </DragDropContext>
    );
}
