
"use client";

import { useState } from 'react';
import { getProjects, getDeliveries } from '@/lib/data';
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
import type { Delivery } from '@/lib/types';

export function ProjectAdminForm() {
    const [projects, setProjects] = useState(getProjects());
    const [deliveries, setDeliveries] = useState(getDeliveries());
    const { isManager, isProjectManager } = useAuth();

    const getProjectProgress = (project: (typeof projects)[0]) => {
        const closedDeliveries = deliveries.filter(d => d.projectId === project.id && d.stage === 'Cerrado').length;
        const totalDeliveries = project.projectedDeliveries || 0;
        if (totalDeliveries === 0) return 0;
        return (closedDeliveries / totalDeliveries) * 100;
    }

    return (
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
                        <Button>
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
                                                    {(isManager || isProjectManager) && <DropdownMenuItem>Edit</DropdownMenuItem>}
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
    );
}
