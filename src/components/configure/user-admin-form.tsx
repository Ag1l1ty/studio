
"use client";

import { useState } from 'react';
import { getProjects, getDeliveries, MOCK_USERS, addUser } from '@/lib/data';
import type { User, Role } from '@/lib/types';
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
import { useAuth } from '@/hooks/use-auth';
import { CreateUserDialog } from './create-user-dialog';
import { useToast } from '@/hooks/use-toast';

export function UserAdminForm() {
    const [users, setUsers] = useState(MOCK_USERS);
    const projects = getProjects();
    const { isManager } = useAuth();
    const [isCreateUserDialogOpen, setCreateUserDialogOpen] = useState(false);
    const { toast } = useToast();

    const getUserProjectCount = (userId: string) => {
        const user = users.find(u => u.id === userId);
        return user?.assignedProjectIds?.length || 0;
    };

    const handleUserCreated = (values: Omit<User, 'id'>) => {
        const newUser: User = {
            ...values,
            id: `USR-00${users.length + 1}`,
        };
        addUser(newUser);
        setUsers(prevUsers => [...prevUsers, newUser]);
        
        toast({
            title: "Usuario Creado",
            description: `Se ha creado el usuario ${newUser.firstName} ${newUser.lastName}. Se enviará un correo para la creación de la contraseña.`,
        });
        setCreateUserDialogOpen(false);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Usuarios y Roles</CardTitle>
                    <CardDescription>
                        Administre los usuarios de su equipo y sus roles asignados.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-end mb-4">
                        {isManager && (
                            <Button onClick={() => setCreateUserDialogOpen(true)}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Agregar Usuario
                            </Button>
                        )}
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Usuario</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Proyectos Asignados</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                                                    <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="grid gap-0.5">
                                                    <span className="font-semibold">{user.firstName} {user.lastName}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.role === 'Admin' || user.role === 'Portfolio Manager' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                                        </TableCell>
                                        <TableCell>{getUserProjectCount(user.id)}</TableCell>
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
            <CreateUserDialog
                isOpen={isCreateUserDialogOpen}
                onOpenChange={setCreateUserDialogOpen}
                onUserCreated={handleUserCreated}
                projects={projects}
            />
        </>
    );
}
