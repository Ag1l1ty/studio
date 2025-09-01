
"use client";

import { useState } from 'react';
import { getDeliveries } from '@/lib/data';
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
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';

export function DeliveryAdminForm() {
    const [deliveries, setDeliveries] = useState(getDeliveries());
    const { isManager, isProjectManager } = useAuth();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Entregas</CardTitle>
                <CardDescription>
                    Administrar todas las tarjetas de entrega individuales en todos los proyectos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-end mb-4">
                    {(isManager || isProjectManager) && (
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Agregar Entrega
                        </Button>
                    )}
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Entrega</TableHead>
                                <TableHead>Proyecto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead>Fecha Estimada</TableHead>
                                <TableHead>Presupuesto</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliveries.map(delivery => (
                                <TableRow key={delivery.id}>
                                    <TableCell className="font-medium">Entrega #{delivery.deliveryNumber}</TableCell>
                                    <TableCell>{delivery.projectName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{delivery.stage}</Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(delivery.estimatedDate), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>${delivery.budget.toLocaleString()}</TableCell>
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
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
