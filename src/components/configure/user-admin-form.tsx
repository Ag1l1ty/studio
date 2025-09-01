
"use client";

import { useState } from 'react';
import { getProjects, getDeliveries } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for users - in a real app, this would come from your auth provider or database
const MOCK_USERS = [
    { id: 'USR-001', name: 'Ana Rodriguez', email: 'ana.rodriguez@example.com', role: 'Project Manager', avatar: '/avatars/01.png' },
    { id: 'USR-002', name: 'Carlos Gomez', email: 'carlos.gomez@example.com', role: 'Project Manager', avatar: '/avatars/02.png' },
    { id: 'USR-003', name: 'Sofia Fernandez', email: 'sofia.fernandez@example.com', role: 'Developer', avatar: '/avatars/03.png' },
    { id: 'USR-004', name: 'Luis Martinez', email: 'luis.martinez@example.com', role: 'Admin', avatar: '/avatars/04.png' },
    { id: 'USR-005', name: 'Elena Petrova', email: 'elena.petrova@example.com', role: 'Viewer', avatar: '/avatars/05.png' },
];


export function UserAdminForm() {
    const [users, setUsers] = useState(MOCK_USERS);
    const projects = getProjects();
    const deliveries = getDeliveries();

    const getUserProjectCount = (userName: string) => {
        return projects.filter(p => p.owner.name === userName).length;
    };

    const getUserDeliveryCount = (userName: string) => {
        return deliveries.filter(d => d.owner.name === userName).length;
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle>Usuarios y Roles</CardTitle>
                <CardDescription>
                    Administre los usuarios de su equipo y sus roles asignados.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end mb-4">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Agregar Usuario
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Rol</TableHead>
                                <TableHead>Proyectos Asignados</TableHead>
                                <TableHead>Entregas Asignadas</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.name} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid gap-0.5">
                                                <span className="font-semibold">{user.name}</span>
                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>{getUserProjectCount(user.name)}</TableCell>
                                    <TableCell>{getUserDeliveryCount(user.name)}</TableCell>
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
                                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                                <DropdownMenuItem>Delete</DropdownMenuItem>
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
    );
}
