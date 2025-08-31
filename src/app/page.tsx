
"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { DeliveriesChart } from "@/components/dashboard/deliveries-chart";
import { ErrorsChart } from "@/components/dashboard/errors-chart";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { getProjects, getDashboardKpis, getRiskProfile } from "@/lib/data";
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, Package, Maximize } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Project } from '@/lib/types';
import { TimeErrorTrendsChart } from '@/components/dashboard/time-error-trends-chart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';


export default function DashboardPage() {
  const allProjects = getProjects();
  const [selectedProjectId, setSelectedProjectId] = useState('all');
  const [fullscreenChart, setFullscreenChart] = useState<{ title: string; chart: React.ReactNode } | null>(null);


  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const projectsToDisplay: Project[] = selectedProjectId === 'all'
    ? allProjects
    : allProjects.filter(p => p.id === selectedProjectId);

  const kpis = getDashboardKpis(allProjects);
  
  const ChartDialog = ({ children, title }: { children: React.ReactNode, title: string }) => (
      <Dialog open={!!fullscreenChart} onOpenChange={(isOpen) => !isOpen && setFullscreenChart(null)}>
          <DialogContent className="max-w-4xl h-4/5 flex flex-col">
              <DialogHeader>
                  <DialogTitle>{fullscreenChart?.title}</DialogTitle>
                  <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                  </DialogClose>
              </DialogHeader>
              <div className="flex-1 h-full">
                  {fullscreenChart?.chart}
              </div>
          </DialogContent>
      </Dialog>
  );

  if (selectedProjectId !== 'all' && projectsToDisplay.length > 0) {
    const project = projectsToDisplay[0];
    const deliveriesMade = project.metrics.reduce((acc, m) => acc + m.deliveries, 0);
    const totalPlanned = project.projectedDeliveries || 0;
    const riskProfile = getRiskProfile(project.riskScore || 0);

    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex justify-end">
          <Select onValueChange={handleProjectChange} defaultValue={selectedProjectId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {allProjects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           <KpiCard
            title="Total Budget"
            value={`$${project.budget.toLocaleString()}`}
            description={`Total allocated budget for this project`}
            icon={<DollarSign className="text-primary" />}
          />
          <KpiCard
            title="Deliveries On Track"
            value={`${deliveriesMade} / ${totalPlanned}`}
            description="Realizadas vs. Planeadas"
            icon={<Package className="text-primary" />}
          />
          <KpiCard
            title="Risk"
            value={`${project.riskScore} - ${riskProfile.classification}`}
            description={`Deviation: ${riskProfile.deviation}`}
            icon={<AlertTriangle className="text-destructive" />}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>
                Deliveries Overview
                 <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setFullscreenChart({ title: 'Deliveries Overview', chart: <DeliveriesChart projects={projectsToDisplay} /> })}>
                    <Maximize className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DeliveriesChart projects={projectsToDisplay} />
            </CardContent>
          </Card>
          <Card className="col-span-4 lg:col-span-3">
            <CardHeader>
              <CardTitle>
                Error Trends
                 <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setFullscreenChart({ title: 'Error Trends', chart: <ErrorsChart projects={projectsToDisplay} /> })}>
                    <Maximize className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ErrorsChart projects={projectsToDisplay} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Budget vs. Spent
                 <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setFullscreenChart({ title: 'Budget vs. Spent', chart: <BudgetChart projects={projectsToDisplay} /> })}>
                    <Maximize className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetChart projects={projectsToDisplay} />
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>
                Time Error Trends
                <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setFullscreenChart({ title: 'Time Error Trends', chart: <TimeErrorTrendsChart projects={projectsToDisplay} /> })}>
                    <Maximize className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimeErrorTrendsChart projects={projectsToDisplay} />
            </CardContent>
          </Card>
        </div>
         <ChartDialog title="Chart" children={fullscreenChart} />
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex justify-end">
        <Select onValueChange={handleProjectChange} defaultValue="all">
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {allProjects.map(project => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Budget"
          value={`$${(kpis.totalBudget / 1_000_000).toFixed(2)}M`}
          description={`Budget for all active projects`}
          icon={<DollarSign className="text-primary" />}
        />
        <KpiCard
          title="Projects On Track"
          value={kpis.onTrackProjects.toString()}
          description={`${kpis.onTrackProjects} proyectos en curso`}
          icon={<CheckCircle className="text-green-500" />}
        />
        <KpiCard
          title="High-Risk Projects"
          value={kpis.highRiskProjects.toString()}
          description={`Projects with Moderate to Very Aggressive risk`}
          icon={<AlertTriangle className="text-destructive" />}
        />
        <KpiCard
          title="Total Deliveries"
          value={kpis.totalDeliveries.toString()}
          description={`Total deliveries in 'Closed' state`}
          icon={<TrendingUp className="text-primary" />}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
            <CardHeader>
              <CardTitle>
                Deliveries Overview
                 <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setFullscreenChart({ title: 'Deliveries Overview', chart: <DeliveriesChart projects={projectsToDisplay} /> })}>
                    <Maximize className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <DeliveriesChart projects={projectsToDisplay} />
            </CardContent>
          </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>
              Error Trends
               <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setFullscreenChart({ title: 'Error Trends', chart: <ErrorsChart projects={projectsToDisplay} /> })}>
                  <Maximize className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorsChart projects={projectsToDisplay} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>
              Budget vs. Spent
               <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setFullscreenChart({ title: 'Budget vs. Spent', chart: <BudgetChart projects={projectsToDisplay} /> })}>
                  <Maximize className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetChart projects={projectsToDisplay} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Time Error Trends
               <Button variant="ghost" size="icon" className="ml-auto h-6 w-6" onClick={() => setFullscreenChart({ title: 'Time Error Trends', chart: <TimeErrorTrendsChart projects={projectsToDisplay} /> })}>
                  <Maximize className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimeErrorTrendsChart projects={projectsToDisplay} />
          </CardContent>
        </Card>
      </div>
      <ChartDialog title="Chart" children={fullscreenChart} />
    </div>
  );
}
