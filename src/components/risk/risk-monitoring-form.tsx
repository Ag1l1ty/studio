
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
import { getProjects, getProjectById, getRiskProfile, getDeliveriesByProjectId, updateProjectRisk } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { Input } from '../ui/input';
import type { RiskLevel, Delivery, Project } from '@/lib/types';

const formSchema = z.object({
    projectId: z.string().min(1, 'Please select a project'),
    deliveryId: z.string().min(1, 'Please select a delivery'),
    timelineDeviation: z.coerce.number().min(-100).max(100),
    hoursToFix: z.coerce.number().min(0, "Hours must be a positive number"),
    functionalFit: z.coerce.number().min(0, "Hours must be a positive number"),
    featureAdjustments: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().int().min(1, "Please select a number of adjustments").optional()
    ),
    blockHours: z.preprocess(
      (val) => (val === "" ? undefined : Number(val)),
      z.number().int().min(1, "Please select a number of block hours").optional()
    ),
});

type UpdateResult = {
    initialRisk: RiskLevel;
    initialScore: number;
    newRisk: RiskLevel;
    newScore: number;
    change: 'Increased' | 'Decreased' | 'Maintained';
}

export function RiskMonitoringForm() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [result, setResult] = useState<UpdateResult | null>(null);
    const [initialProject, setInitialProject] = useState<Project | null>(null);

    useEffect(() => {
        setProjects(getProjects());
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectId: '',
            deliveryId: '',
            timelineDeviation: 0,
            hoursToFix: 0,
            functionalFit: 0,
            featureAdjustments: '',
            blockHours: '',
        },
    });

    const selectedProjectId = form.watch('projectId');
    const selectedDeliveryId = form.watch('deliveryId');

    useEffect(() => {
        if (selectedProjectId) {
            setDeliveries(getDeliveriesByProjectId(selectedProjectId));
            setInitialProject(getProjectById(selectedProjectId) || null);
            form.setValue('deliveryId', '');
        } else {
            setDeliveries([]);
            setInitialProject(null);
        }
    }, [selectedProjectId, form]);

    function onSubmit(values: z.infer<typeof formSchema>) {
        const project = getProjectById(values.projectId);
        if (!project || typeof project.riskScore === 'undefined') return;
        
        let newScore = project.riskScore;

        // Timeline deviation logic
        if (values.timelineDeviation >= 20) {
            newScore += 2;
        } else {
            newScore = Math.max(1, newScore - 1); // Ensure score doesn't drop below 1
        }
        
        // Hours to fix logic
        if (values.hoursToFix >= 3) {
            newScore += 2;
        } else {
            newScore = Math.max(1, newScore - 1); // Ensure score doesn't drop below 1
        }

        // Functional fit logic
        if (values.functionalFit >= 3) {
            newScore += 2;
        } else {
            newScore = Math.max(1, newScore - 1); // Ensure score doesn't drop below 1
        }
        
        // Feature Adjustments Logic
        if (values.featureAdjustments && values.featureAdjustments >= 3) {
            newScore += 2;
        } else if (values.featureAdjustments) {
            newScore = Math.max(1, newScore - 1);
        }

        // Block hours logic
        if (values.blockHours && values.blockHours >= 10) {
            newScore += 1;
        }

        // Ensure score doesn't go above a maximum (e.g., 25)
        newScore = Math.min(newScore, 25);
        
        const initialRiskProfile = getRiskProfile(project.riskScore);
        const newRiskProfile = getRiskProfile(newScore);
        const newRiskClassification = newRiskProfile.classification;
        
        updateProjectRisk(values.projectId, newScore, newRiskClassification, values.deliveryId);
        setProjects(getProjects());
        
        const riskOrder: RiskLevel[] = ['Muy conservador', 'Conservador', 'Moderado', 'Moderado - alto', 'Agresivo', 'Muy Agresivo'];
        const initialIndex = riskOrder.indexOf(initialRiskProfile.classification);
        const newIndex = riskOrder.indexOf(newRiskClassification);

        let change: UpdateResult['change'] = 'Maintained';
        if (newIndex > initialIndex) change = 'Increased';
        if (newIndex < initialIndex) change = 'Decreased';

        setResult({ 
            initialRisk: project.riskLevel,
            initialScore: project.riskScore,
            newRisk: newRiskClassification,
            newScore: newScore,
            change 
        });
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
                        <span className="text-muted-foreground">From: {result.initialRisk} ({result.initialScore.toFixed(1)})</span>
                        <span>&rarr;</span>
                        <span className="font-semibold">To: {result.newRisk} ({result.newScore.toFixed(1)})</span>
                    </div>
                     <Button onClick={() => { form.reset({ projectId: '', deliveryId: '', timelineDeviation: 0, hoursToFix: 0, functionalFit: 0, featureAdjustments: '', blockHours: '' }); setResult(null); }}>Monitor Another Project</Button>
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
                                    {projects.filter(p => typeof p.riskScore !== 'undefined' && p.riskScore > 0).map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.id})</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {initialProject && (
                    <div className="text-sm">Current Risk Level: <span className="font-semibold">{initialProject.riskLevel}</span> (Score: {initialProject.riskScore?.toFixed(1)})</div>
                )}
                
                <FormField
                    control={form.control}
                    name="deliveryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Delivery</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedProjectId}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a delivery to adjust the valuation" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {deliveries.filter(d => !d.riskAssessed).map(d => (
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
                            <FormLabel>(%) Desviación Plan </FormLabel>
                            <FormControl>
                                <Input type="number" {...field} disabled={!selectedDeliveryId} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="hoursToFix"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Horas Arreglar Errores</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 5" {...field} disabled={!selectedDeliveryId} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="functionalFit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cantidad Ajustes Funcionales Post-definición</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 2" {...field} disabled={!selectedDeliveryId} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="featureAdjustments"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cantidad Cambios Funcionales Post-Desarrollo</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={!selectedDeliveryId}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select number of adjustments" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                                        <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="blockHours"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cantidad Horas Bloqueos</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={!selectedDeliveryId}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select number of block hours" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Array.from({ length: 24 }, (_, i) => i + 1).map(num => (
                                        <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={!selectedDeliveryId}>Update Risk</Button>
            </form>
        </Form>
    );
}
