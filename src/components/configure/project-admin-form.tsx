
"use client";

import { useState } from 'react';
import { getProjects, addProject, updateProject } from '@/lib/data';
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
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';
import type { Project } from '@/lib/types';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';
import { useToast } from '@/hooks/use-toast';

export function ProjectAdminForm() {
    const { isManager, isProjectManager } = useAuth();
    const [projects, setProjects] = useState(getProjects());
    const [isCreateProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const { toast } = useToast();

    const getProjectProgress = (project: Project) => {
        if (project.stage === 'Cerrado') {
            return 100;
        }
        const closedDeliveries = project.metrics.reduce((acc, m) => acc + m.deliveries, 0);
        const totalDeliveries = project.projectedDeliveries || 0;
        if (totalDeliveries === 0) return 0;
        return (closedDeliveries / totalDeliveries) * 100;
    }

    const handleProjectSubmit = (values: Omit<Project, 'id' | 'owner' | 'metrics' | 'riskLevel' | 'stage' | 'budgetSpent'>, id?: string) => {
        if (id) {
            // Update existing project
            const originalProject = projects.find(p => p.id === id);
            if (!originalProject) return;

            const updatedProjectData: Project = {
                ...originalProject,
                ...values,
            };
            const updatedProject = updateProject(updatedProjectData);
            setProjects(projects.map(p => p.id === id ? updatedProject : p));
            toast({
                title: "Proyecto Actualizado",
                description: `Los datos del proyecto "${values.name}" han sido actualizados.`,
            });
        } else {
            // Create new project
            const newProject: Project = {
                ...values,
                id: `PRJ-00${getProjects().length + 1}`,
                stage: 'Definición',
                riskLevel: 'Low', // Default risk level
                budgetSpent: 0,
                owner: { name: 'New User', avatar: '' }, // Placeholder owner
                metrics: [],
            };
            addProject(newProject);
            setProjects(getProjects());
             toast({
                title: "Proyecto Creado",
                description: `El proyecto "${newProject.name}" ha sido creado con éxito.`,
            });
        }
       handleDialogClose();
    };
    
    const handleEditClick = (project: Project) => {
        setProjectToEdit(project);
        setCreateProjectDialogOpen(true);
    };

    const handleDialogClose = () => {
        setCreateProjectDialogOpen(false);
        setProjectToEdit(null);
    }


    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Proyectos</CardTitle>
                    <CardDescription>
                        Agregue, edite o elimine proyectos del portafolio.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end mb-4">
                         {(isManager || isProjectManager) && (
                            <Button onClick={() => setCreateProjectDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Agregar Proyecto
                            </Button>
                        )}
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre del Proyecto</TableHead>
                                    <TableHead>Progreso del Proyecto</TableHead>
                                    <TableHead>Responsable</TableHead>
                                    <TableHead>Presupuesto</TableHead>
                                    <TableHead>Nivel de Riesgo</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map(project => {
                                    const progress = getProjectProgress(project);
                                    return (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">{project.name}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress value={progress} className="w-24" />
                                                    <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{project.owner.name}</TableCell>
                                            <TableCell>${project.budget.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <Badge variant={project.riskLevel.includes('Agresivo') ? 'destructive' : project.riskLevel.includes('Moderado') ? 'secondary' : 'default'}>
                                                    {project.riskLevel}
                                                </Badge>
                                            </TableCell>
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
                                                        {(isManager || isProjectManager) && <DropdownMenuItem onClick={() => handleEditClick(project)}>Edit</DropdownMenuItem>}
                                                        {isManager && <DropdownMenuItem>Delete</DropdownMenuItem>}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <CreateProjectDialog
                isOpen={isCreateProjectDialogOpen}
                onOpenChange={handleDialogClose}
                onProjectSubmit={handleProjectSubmit}
                project={projectToEdit}
            />
        </>
    );
}
