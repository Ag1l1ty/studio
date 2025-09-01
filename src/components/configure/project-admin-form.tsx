
"use client";

import { useState } from 'react';
import { getProjects } from '@/lib/data';
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

export function ProjectAdminForm() {
    const [projects, setProjects] = useState(getProjects());
    const { isManager } = useAuth();

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
                     {isManager && (
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
                                <TableHead>Estado</TableHead>
                                <TableHead>Propietario</TableHead>
                                <TableHead>Presupuesto</TableHead>
                                <TableHead>Nivel de Riesgo</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects.map(project => (
                                <TableRow key={project.id}>
                                    <TableCell className="font-medium">{project.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{project.stage}</Badge>
                                    </TableCell>
                                    <TableCell>{project.owner.name}</TableCell>
                                    <TableCell>${project.budget.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={project.riskLevel.includes('Agresivo') ? 'destructive' : project.riskLevel.includes('Moderado') ? 'secondary' : 'default'}>
                                            {project.riskLevel}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {isManager && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuItem>Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
