
"use client"

import { getDeliveryById, getProjectById } from "@/lib/data";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectDetailCard } from "@/components/projects/project-detail-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Calendar, Users, Target, Package, AlertCircle, ArrowLeft } from "lucide-react";
import { DeliveryBudgetChart } from "@/components/deliveries/delivery-budget-chart";
import { DeliveryErrorsChart } from "@/components/deliveries/delivery-errors-chart";
import { DeliveryPlanChart } from "@/components/deliveries/delivery-plan-chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { differenceInDays, isBefore } from "date-fns";

export default function DeliveryDetailsPage({ params }: { params: { id: string } }) {
    const delivery = getDeliveryById(params.id);
    const [budgetSpent, setBudgetSpent] = useState(delivery?.budgetSpent || 0);

    if (!delivery) {
        notFound();
    }
    
    const project = getProjectById(delivery.projectId);
    if (!project) {
        notFound();
    }

    const totalDeliveries = project.projectedDeliveries || 0;
    const deliveriesMade = project.metrics.reduce((acc, m) => acc + m.deliveries, 0);

    const lastUpdate = delivery.lastBudgetUpdate ? new Date(delivery.lastBudgetUpdate) : null;
    const needsUpdate = lastUpdate ? differenceInDays(new Date(), lastUpdate) > 7 : true;


    const handleBudgetUpdate = () => {
        // In a real app, you would save this to the backend
        console.log("Updated budget spent:", budgetSpent);
        // And update the delivery object's lastBudgetUpdate date
    };

    return (
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
                       <Button onClick={handleBudgetUpdate} className="w-full">Actualizar Uso</Button>
                        {needsUpdate && (
                            <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400 p-2 bg-yellow-500/10 rounded-md">
                                <AlertCircle className="h-4 w-4" />
                                <span>El presupuesto no se ha actualizado en más de una semana.</span>
                            </div>
                        )}
                         <DeliveryBudgetChart delivery={delivery} currentSpent={budgetSpent} />
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
    );
}
