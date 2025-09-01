
"use client";

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getProjects, getProjectById, getRiskProfile, getDeliveriesByProjectId } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { Input } from '../ui/input';
import type { RiskLevel, Delivery } from '@/lib/types';

const formSchema = z.object({
    projectId: z.string().min(1, 'Please select a project'),
    deliveryId: z.string().min(1, 'Please select a delivery'),
    timelineDeviation: z.coerce.number().min(-100).max(100),
});

type UpdateResult = {
    initialRisk: RiskLevel;
    newRisk: RiskLevel;
    change: 'Increased' | 'Decreased' | 'Maintained';
}

export function RiskMonitoringForm() {
    const projects = getProjects();
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [result, setResult] = useState<UpdateResult | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectId: '',
            deliveryId: '',
            timelineDeviation: 0,
        },
    });

    const selectedProjectId = form.watch('projectId');
    const selectedDeliveryId = form.watch('deliveryId');
    const initialProject = getProjectById(selectedProjectId);

    useEffect(() => {
        if (selectedProjectId) {
            setDeliveries(getDeliveriesByProjectId(selectedProjectId));
            form.setValue('deliveryId', '');
        } else {
            setDeliveries([]);
        }
    }, [selectedProjectId, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!initialProject || typeof initialProject.riskScore === 'undefined') return;
        
        let newScore = initialProject.riskScore;

        if (values.timelineDeviation >= 20) newScore += 2;
        if (values.timelineDeviation < 0) newScore -= 1;
        
        // Ensure score doesn't go below a minimum (e.g., 1) or above a maximum (e.g., 25)
        newScore = Math.max(1, Math.min(25, newScore));
        
        const initialRiskProfile = getRiskProfile(initialProject.riskScore);
        const newRiskProfile = getRiskProfile(newScore);
        const newRisk = newRiskProfile.classification;
        
        const riskOrder: RiskLevel[] = ['Muy conservador', 'Conservador', 'Moderado', 'Moderado - alto', 'Agresivo', 'Muy Agresivo'];
        const initialIndex = riskOrder.indexOf(initialRiskProfile.classification);
        const newIndex = riskOrder.indexOf(newRisk);

        let change: UpdateResult['change'] = 'Maintained';
        if (newIndex > initialIndex) change = 'Increased';
        if (newIndex < initialIndex) change = 'Decreased';

        setResult({ initialRisk: initialProject.riskLevel, newRisk, change });
    }

    if (result && initialProject) {
        const changeIcon = result.change === 'Increased' ? <ArrowUp className="w-16 h-16 text-destructive" /> : result.change === 'Decreased' ? <ArrowDown className="w-16 h-16 text-green-500" /> : <Minus className="w-16 h-16 text-muted-foreground" />;
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Risk Monitoring Result</CardTitle>
                    <CardDescription>Risk profile update for project: {initialProject.name}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="flex justify-center">{changeIcon}</div>
                    <p className="text-xl font-bold">Risk Level {result.change}</p>
                    <div className="flex items-center justify-center gap-4 text-lg">
                        <span className="text-muted-foreground">From: {result.initialRisk}</span>
                        <span>&rarr;</span>
                        <span className="font-semibold">To: {result.newRisk}</span>
                    </div>
                     <Button onClick={() => { form.reset(); setResult(null); }}>Monitor Another Project</Button>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select a project to monitor" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {initialProject && (
                    <div className="text-sm">Current Risk Level: <span className="font-semibold">{initialProject.riskLevel}</span> (Score: {initialProject.riskScore})</div>
                )}
                
                <FormField
                    control={form.control}
                    name="deliveryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Risk Delivery</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedProjectId}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a delivery to adjust the valuation" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {deliveries.map(d => (
                                        <SelectItem key={d.id} value={d.id}>
                                            Delivery #{d.deliveryNumber}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="timelineDeviation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Plan Deviation (%)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} disabled={!selectedDeliveryId} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={!selectedDeliveryId}>Update Risk</Button>
            </form>
        </Form>
    );
}
