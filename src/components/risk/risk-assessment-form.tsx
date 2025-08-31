
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, CheckCircle, Shield, TrendingUp } from 'lucide-react';
import { getProjects, getProjectById, getRiskProfile, updateProjectRisk } from '@/lib/data';
import type { Project, RiskResult } from '@/lib/types';


const formSchema = z.object({
    projectId: z.string().min(1, "Project selection is required"),
    teamExperience: z.enum(['high', 'medium', 'low']),
    axaKnowledge: z.enum(['high', 'medium', 'low']),
    scopeClarity: z.coerce.number().min(1).max(5),
    technicalUncertainty: z.enum(['low', 'medium', 'high']),
    externalDeps: z.coerce.number().min(0).max(10),
});


export function RiskAssessmentForm() {
    const [result, setResult] = useState<RiskResult | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    useEffect(() => {
        setProjects(getProjects());
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectId: '',
            teamExperience: 'medium',
            axaKnowledge: 'medium',
            scopeClarity: 3,
            technicalUncertainty: 'medium',
            externalDeps: 2,
        },
    });

    const projectId = form.watch('projectId');

    useEffect(() => {
        if (projectId) {
            const project = getProjectById(projectId);
            if(project) {
                setSelectedProject(project);
            }
        } else {
            setSelectedProject(null);
        }
    }, [projectId]);


    function onSubmit(values: z.infer<typeof formSchema>) {
        let score = 0;
        
        // teamExperience scoring
        if (values.teamExperience === 'medium') score += 1.5;
        if (values.teamExperience === 'low') score += 3;

        // axaKnowledge scoring
        if (values.axaKnowledge === 'medium') score += 1.5;
        if (values.axaKnowledge === 'low') score += 3;

        // scopeClarity scoring
        score += (5 - values.scopeClarity) * 3;

        // technicalUncertainty scoring
        if (values.technicalUncertainty === 'medium') score += 1.5;
        if (values.technicalUncertainty === 'high') score += 3;

        // externalDeps scoring
        score += values.externalDeps * 2;
        
        const riskProfile = getRiskProfile(score);
        
        updateProjectRisk(values.projectId, score, riskProfile.classification);
        setProjects(getProjects()); // Refresh projects data
        setResult({ ...riskProfile, score });
    }
    
    if (result) {
        const resultIcon = result.classification === 'Agresivo' || result.classification === 'Muy Agresivo' ? <AlertCircle className="w-16 h-16 text-destructive" /> : result.classification.includes('Moderado') ? <Shield className="w-16 h-16 text-yellow-500" /> : <CheckCircle className="w-16 h-16 text-green-500" />;
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Risk Assessment Result</CardTitle>
                    <CardDescription>Risk profile for project: {selectedProject?.name}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="flex justify-center">{resultIcon}</div>
                    <p className="text-5xl font-bold">{result.classification} Risk</p>
                    <p className="text-muted-foreground">Calculated Risk Score: {result.score.toFixed(1)}</p>
                    <div className="text-sm border rounded-lg p-4 bg-secondary/50 inline-block">
                        <p><TrendingUp className="inline-block mr-2" />Potential Deviation: <span className="font-semibold">{result.deviation}</span></p>
                    </div>
                     <Button onClick={() => { form.reset(); setResult(null); setSelectedProject(null); }}>Assess Another Project</Button>
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
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a project to assess" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {projects.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedProject && (
                    <div className="p-4 border rounded-lg bg-muted/50">
                        <h4 className="font-semibold mb-2">Current Risk Profile</h4>
                        {selectedProject.riskScore !== undefined && selectedProject.riskScore > 0 ? (
                            <p className="text-sm">
                                Current Level: <span className="font-bold">{selectedProject.riskLevel}</span> (Score: {selectedProject.riskScore.toFixed(1)})
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">This project has not been assessed yet.</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">Filling out and submitting this form will overwrite the current risk assessment.</p>
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="teamExperience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experiencia del Equipo</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedProject}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select team experience level" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="high">Mayor o igual a 2 años en proyectos idénticos</SelectItem>
                                    <SelectItem value="medium">6 meses – 2 años en proyectos similares</SelectItem>
                                    <SelectItem value="low">Menor a 6 meses o equipo nuevo</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="axaKnowledge"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Conocimiento entorno AXA</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedProject}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select team AXA knowledge level" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="high">Equipo de desarrollo con más de un año trabajando en AXA</SelectItem>
                                    <SelectItem value="medium">Equipo de desarrollo con entre 3 y 12 meses trabajando en AXA</SelectItem>
                                    <SelectItem value="low">Equipo de desarrollo con menos de 3 meses o sin experiencia trabajando en AXA</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="scopeClarity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Scope Clarity (1=Vague, 5=Very Clear)</FormLabel>
                            <FormControl>
                                <Slider
                                    min={1} max={5} step={1}
                                    defaultValue={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    disabled={!selectedProject}
                                />
                            </FormControl>
                            <div className="text-center font-medium">{field.value}</div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="technicalUncertainty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Incertidumbre Técnica</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                     disabled={!selectedProject}
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="low" /></FormControl>
                                        <FormLabel className="font-normal">Cambios menores (mantenimiento, parches)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="medium" /></FormControl>
                                        <FormLabel className="font-normal">Actualizaciones de versión / mejoras moderadas</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="high" /></FormControl>
                                        <FormLabel className="font-normal">Rediseño de servicio o flujo / Producto completamente nuevo</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="externalDeps"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of External Dependencies</FormLabel>
                            <FormControl>
                                <Slider
                                    min={0} max={10} step={1}
                                    defaultValue={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    disabled={!selectedProject}
                                />
                            </FormControl>
                             <div className="text-center font-medium">{field.value}</div>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button type="submit" disabled={!selectedProject}>Calculate and Save Risk</Button>
            </form>
        </Form>
    );
}

    