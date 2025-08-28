"use client";

import { useState } from 'react';
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
import { Input } from '../ui/input';

const formSchema = z.object({
    projectName: z.string().min(1, "Project name is required"),
    scopeClarity: z.coerce.number().min(1).max(5),
    techNovelty: z.enum(['low', 'medium', 'high']),
    teamExperience: z.enum(['high', 'medium', 'low']),
    externalDeps: z.coerce.number().min(0).max(10),
});

type RiskResult = {
    score: number;
    classification: 'Low' | 'Medium' | 'High';
    deviation: string;
}

export function RiskAssessmentForm() {
    const [result, setResult] = useState<RiskResult | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            projectName: '',
            scopeClarity: 3,
            techNovelty: 'medium',
            teamExperience: 'medium',
            externalDeps: 2,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        let score = 0;
        
        // Scope Clarity (1-5, lower is better) -> weight: 3
        score += (5 - values.scopeClarity) * 3;

        // Tech Novelty -> weight: 4
        if (values.techNovelty === 'medium') score += 2 * 4;
        if (values.techNovelty === 'high') score += 4 * 4;

        // Team Experience -> weight: 5
        if (values.teamExperience === 'medium') score += 2 * 5;
        if (values.teamExperience === 'low') score += 4 * 5;

        // External Dependencies -> weight: 2
        score += values.externalDeps * 2;
        
        let classification: RiskResult['classification'] = 'Low';
        let deviation = "±10% in time/budget";
        if (score > 40) {
            classification = 'High';
            deviation = "> ±25% in time/budget";
        } else if (score > 20) {
            classification = 'Medium';
            deviation = "±10-25% in time/budget";
        }
        
        setResult({ score, classification, deviation });
    }
    
    if (result) {
        const resultIcon = result.classification === 'High' ? <AlertCircle className="w-16 h-16 text-destructive" /> : result.classification === 'Medium' ? <Shield className="w-16 h-16 text-yellow-500" /> : <CheckCircle className="w-16 h-16 text-green-500" />;
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Risk Assessment Result</CardTitle>
                    <CardDescription>Risk profile for project: {form.getValues('projectName')}</CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <div className="flex justify-center">{resultIcon}</div>
                    <p className="text-5xl font-bold">{result.classification} Risk</p>
                    <p className="text-muted-foreground">Calculated Risk Score: {result.score}</p>
                    <div className="text-sm border rounded-lg p-4 bg-secondary/50 inline-block">
                        <p><TrendingUp className="inline-block mr-2" />Potential Deviation: <span className="font-semibold">{result.deviation}</span></p>
                    </div>
                     <Button onClick={() => setResult(null)}>Assess Another Project</Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Digital Onboarding Platform" {...field} />
                      </FormControl>
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
                                />
                            </FormControl>
                            <div className="text-center font-medium">{field.value}</div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="techNovelty"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Technology Novelty</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="low" /></FormControl>
                                        <FormLabel className="font-normal">Low (Proven technologies)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="medium" /></FormControl>
                                        <FormLabel className="font-normal">Medium (Some new components)</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl><RadioGroupItem value="high" /></FormControl>
                                        <FormLabel className="font-normal">High (Bleeding-edge technology)</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="teamExperience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Team Experience with Domain/Tech</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select team experience level" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="high">High (Experts)</SelectItem>
                                    <SelectItem value="medium">Medium (Competent)</SelectItem>
                                    <SelectItem value="low">Low (Inexperienced)</SelectItem>
                                </SelectContent>
                            </Select>
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
                                <Input type="number" min="0" max="10" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Calculate Risk</Button>
            </form>
        </Form>
    );
}
