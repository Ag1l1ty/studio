
"use client";

import { useState } from 'react';
import { getProjects, addProject, updateProject, deleteProject, getUsers } from '@/lib/data';
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
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';
import type { Project, User } from '@/lib/types';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';
import { useToast } from '@/hooks/use-toast';

export function ProjectAdminForm() {
    const { isManager, isProjectManager } = useAuth();
    const [projects, setProjects] = useState(getProjects());
    const [users, setUsers] = useState(getUsers());
    const [isCreateProjectDialogOpen, setCreateProjectDialogOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [isConfirmingDelete, setConfirmingDelete] = useState(false);
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

    const handleProjectSubmit = (values: { name: string; description: string; budget: number; projectedDeliveries: number; startDate: Date; endDate: Date; ownerId: string; }, id?: string) => {
        
        const owner = users.find(u => u.id === values.ownerId);
        if (!owner) return;
        
        const ownerData = { id: owner.id, name: `${owner.firstName} ${owner.lastName}`, avatar: owner.avatar };

        if (id) {
            // Update existing project
            const originalProject = projects.find(p => p.id === id);
            if (!originalProject) return;

            const updatedProjectData: Project = {
                ...originalProject,
                ...values,
                budget: values.budget,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                owner: ownerData
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
                id: `PRJ-00${getProjects().length + 1}`,
                name: values.name,
                description: values.description,
                projectedDeliveries: values.projectedDeliveries,
                budget: values.budget,
                startDate: values.startDate.toISOString(),
                endDate: values.endDate.toISOString(),
                stage: 'Definición',
                riskLevel: 'No Assessment', // Default risk level
                budgetSpent: 0,
                owner: ownerData,
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

    const handleDeleteClick = (project: Project) => {
        setProjectToDelete(project);
        setConfirmingDelete(true);
    };
    
    const handleConfirmDelete = () => {
        if (projectToDelete) {
            deleteProject(projectToDelete.id);
            setProjects(getProjects());
            toast({
                title: "Proyecto Eliminado",
                description: `El proyecto "${projectToDelete.name}" ha sido eliminado.`,
            });
        }
        setConfirmingDelete(false);
        setProjectToDelete(null);
    }

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
                                    const hasRiskAssessment = project.riskScore !== undefined && project.riskScore > 0;
                                    let riskVariant: 'destructive' | 'secondary' | 'default' | 'warning' = 'default';
                                    if (!hasRiskAssessment) {
                                        riskVariant = 'warning';
                                    } else if (project.riskLevel.includes('Agresivo')) {
                                        riskVariant = 'destructive';
                                    } else if (project.riskLevel.includes('Moderado')) {
                                        riskVariant = 'secondary';
                                    }

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
                                                 <Badge variant={riskVariant}>
                                                    {hasRiskAssessment ? project.riskLevel : 'No Assessment'}
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
                                                        {isManager && <DropdownMenuItem onClick={() => handleDeleteClick(project)}>Delete</DropdownMenuItem>}
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
                users={users}
            />
            <AlertDialog open={isConfirmingDelete} onOpenChange={setConfirmingDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                           Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto "{projectToDelete?.name}".
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

    