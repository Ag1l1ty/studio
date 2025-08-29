
"use client"

import { getDeliveryById, getProjectById } from "@/lib/data";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectDetailCard } from "@/components/projects/project-detail-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Calendar, Users, Target, Package, AlertCircle, ArrowLeft, History } from "lucide-react";
import { DeliveryBudgetChart } from "@/components/deliveries/delivery-budget-chart";
import { DeliveryErrorsChart } from "@/components/deliveries/delivery-errors-chart";
import { DeliveryPlanChart } from "@/components/deliveries/delivery-plan-chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { differenceInDays, isBefore, format } from "date-fns";
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
import type { BudgetHistoryEntry, Delivery } from "@/lib/types";

export default function DeliveryDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const [delivery, setDelivery] = useState<Delivery | null>(null);
    const [budgetSpent, setBudgetSpent] = useState(0);
    const [budgetHistory, setBudgetHistory] = useState<BudgetHistoryEntry[]>([]);
    const [showUpdateWarning, setShowUpdateWarning] = useState(true);
    const [isConfirmingBudget, setConfirmingBudget] = useState(false);
    const [pendingBudget, setPendingBudget] = useState(0);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const deliveryData = getDeliveryById(id);
        if (deliveryData) {
            setDelivery(deliveryData);
            setBudgetSpent(deliveryData.budgetSpent || 0);
            setBudgetHistory(deliveryData.budgetHistory || []);
        }
    }, [id]);


    if (!delivery) {
        // You can render a loading state here
        return <div>Loading...</div>;
    }
    
    const project = getProjectById(delivery.projectId);
    if (!project) {
        notFound();
    }

    const totalDeliveries = project.projectedDeliveries || 0;
    const deliveriesMade = project.metrics.reduce((acc, m) => acc + m.deliveries, 0);

    const lastUpdate = delivery.lastBudgetUpdate ? new Date(delivery.lastBudgetUpdate) : null;
    const needsUpdate = lastUpdate ? differenceInDays(new Date(), lastUpdate) > 7 : true;


    const handleBudgetUpdateClick = () => {
        setPendingBudget(budgetSpent);
        setConfirmingBudget(true);
    };

    const handleConfirmBudgetUpdate = () => {
        const newHistoryEntry: BudgetHistoryEntry = {
            date: new Date().toISOString(),
            amount: pendingBudget,
        };

        setBudgetHistory(prevHistory => [...prevHistory, newHistoryEntry]);
        setBudgetSpent(pendingBudget); 
        setShowUpdateWarning(false);
        setConfirmingBudget(false);
        
        // In a real app, you would also save this updated history to the backend
        // For now, it only updates local state
    }

    return (
        <>
            <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Detalle Entrega #{delivery.deliveryNumber}</h2>
                        <p className="text-muted-foreground">Proyecto: <a href={`/projects/${project.id}`} className="text-primary hover:underline">{project.name}</a></p>
                    </div>
                    <Link href="/kanban">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver al Kanban
                        </Button>
                    </Link>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <ProjectDetailCard title="Status" value={delivery.stage} icon={<Target />} />
                    <ProjectDetailCard title="Budget estimado delivery" value={`$${delivery.budget.toLocaleString()}`} icon={<DollarSign />} />
                    <ProjectDetailCard title="Fecha entrega planeada" value={new Date(delivery.estimatedDate).toLocaleDateString()} icon={<Calendar />} />
                    <ProjectDetailCard title="Deliveries" value={`${deliveriesMade} / ${totalDeliveries}`} icon={<Package />} />
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Trends Delivery Plans</CardTitle>
                            <CardDescription>Línea de tiempo planeada vs. el estado real de la entrega.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <DeliveryPlanChart delivery={delivery} />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>Uso del Presupuesto</CardTitle>
                            <CardDescription>Actualice el presupuesto ejecutado para esta entrega.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="space-y-2">
                                <Label htmlFor="budget-spent">Presupuesto Ejecutado ($)</Label>
                                <Input 
                                    id="budget-spent" 
                                    type="number"
                                    value={budgetSpent}
                                    onChange={(e) => setBudgetSpent(Number(e.target.value))}
                                />
                           </div>
                           <Button onClick={handleBudgetUpdateClick} className="w-full">Actualizar Uso</Button>
                            {needsUpdate && showUpdateWarning && (
                                <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-500/10 rounded-md">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>El presupuesto no se ha actualizado en más de una semana.</span>
                                </div>
                            )}
                             <DeliveryBudgetChart delivery={delivery} currentSpent={budgetSpent} />
                             {isClient && budgetHistory.length > 0 && (
                                <div className="space-y-3 pt-4 border-t">
                                    <h4 className="flex items-center text-sm font-semibold">
                                        <History className="mr-2 h-4 w-4" />
                                        Historial de Actualizaciones
                                    </h4>
                                    <ul className="space-y-2 text-xs text-muted-foreground">
                                        {budgetHistory.slice().reverse().map((entry, index) => (
                                            <li key={index} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                                                <span>{format(new Date(entry.date), "MMM d, yyyy 'at' h:mm a")}</span>
                                                <span className="font-medium text-foreground">${entry.amount.toLocaleString()}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                             )}
                        </CardContent>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Trends Errores</CardTitle>
                         <CardDescription>Cantidad de errores y tiempo promedio de solución.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DeliveryErrorsChart delivery={delivery} />
                    </CardContent>
                </Card>

            </div>

            <AlertDialog open={isConfirmingBudget} onOpenChange={setConfirmingBudget}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Actualización de Presupuesto</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas establecer el presupuesto ejecutado en ${pendingBudget.toLocaleString()}? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setConfirmingBudget(false)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmBudgetUpdate}>Sí, actualizar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
