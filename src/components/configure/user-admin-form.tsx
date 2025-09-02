
"use client";

import { useState, useEffect } from 'react';
import { getProjects, getUsers, addUser, updateUser, deleteUser } from '@/lib/data';
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
import { CreateUserDialog } from './create-user-dialog';
import { useToast } from '@/hooks/use-toast';

export function UserAdminForm() {
    const [users, setUsers] = useState(() => getUsers());
    const projects = getProjects();
    const { isManager } = useAuth();
    const [isCreateUserDialogOpen, setCreateUserDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isConfirmingDelete, setConfirmingDelete] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        setUsers(getUsers());
    }, []);

    const getUserProjectCount = (user: User) => {
        return user.assignedProjectIds?.length || 0;
    };
    
    const handleEditClick = (user: User) => {
        setUserToEdit(user);
        setCreateUserDialogOpen(true);
    }
    
    const handleDeleteClick = (user: User) => {
        setUserToDelete(user);
        setConfirmingDelete(true);
    }

    const handleConfirmDelete = () => {
        if (userToDelete) {
            deleteUser(userToDelete.id);
            setUsers(users.filter(u => u.id !== userToDelete.id)); // Correctly update the state
            toast({
                title: "Usuario Eliminado",
                description: `El usuario ${userToDelete.firstName} ${userToDelete.lastName} ha sido eliminado.`,
            });
        }
        setConfirmingDelete(false);
        setUserToDelete(null);
    }


    const handleUserSubmit = (values: any, id?: string) => {
        if (id) {
            // Update existing user
            const updatedUser: User = { 
                ...values, 
                id,
                role: values.role as Role,
                avatar: values.avatar || '',
                assignedProjectIds: values.assignedProjectIds || []
            };
            updateUser(updatedUser);
            setUsers(getUsers());
            toast({
                title: "Usuario Actualizado",
                description: `Los datos de ${values.firstName} ${values.lastName} han sido actualizados.`,
            });
        } else {
            // Create new user - addUser now handles ID generation and password hashing
            addUser(values);
            setUsers(getUsers());
            toast({
                title: "Usuario Creado",
                description: `El usuario ${values.firstName} ${values.lastName} ha sido creado con éxito.${values.temporaryPassword ? ' Se ha generado una contraseña temporal.' : ''}`,
            });
        }
        setCreateUserDialogOpen(false);
        setUserToEdit(null);
    };

    const handleDialogClose = () => {
        setCreateUserDialogOpen(false);
        setUserToEdit(null);
    }

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
                                        <TableCell>{getUserProjectCount(user)}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleEditClick(user)}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleDeleteClick(user)}>Delete</DropdownMenuItem>
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
                onOpenChange={handleDialogClose}
                onUserSubmit={handleUserSubmit}
                projects={projects}
                user={userToEdit}
            />
            <AlertDialog open={isConfirmingDelete} onOpenChange={setConfirmingDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                           Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario {userToDelete?.firstName} {userToDelete?.lastName}.
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
