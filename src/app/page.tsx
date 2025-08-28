
"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { DeliveriesChart } from "@/components/dashboard/deliveries-chart";
import { ErrorsChart } from "@/components/dashboard/errors-chart";
import { BudgetChart } from "@/components/dashboard/budget-chart";
import { getProjects, getDashboardKpis } from "@/lib/data";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Project } from '@/lib/types';

export default function DashboardPage() {
  const allProjects = getProjects();
  const [selectedProjectId, setSelectedProjectId] = useState('all');

  const handleProjectChange = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const projectsToDisplay: Project[] = selectedProjectId === 'all'
    ? allProjects
    : allProjects.filter(p => p.id === selectedProjectId);

  const kpis = getDashboardKpis(projectsToDisplay);
  const descriptionSuffix = selectedProjectId === 'all' ? 'for all projects' : `for ${projectsToDisplay[0]?.name}`;

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
          description={`Total allocated budget ${descriptionSuffix}`}
          icon={<DollarSign className="text-primary" />}
        />
        <KpiCard
          title="Projects On Track"
          value={kpis.onTrackProjects.toString()}
          description={`${kpis.onTrackPercentage}% of projects are on schedule`}
          icon={<CheckCircle className="text-green-500" />}
        />
        <KpiCard
          title="High-Risk Projects"
          value={kpis.highRiskProjects.toString()}
          description={`Projects classified with high risk ${selectedProjectId === 'all' ? '' : `(project level)`}`}
          icon={<AlertCircle className="text-destructive" />}
        />
        <KpiCard
          title="Total Deliveries"
          value={kpis.totalDeliveries.toString()}
          description={`Total deliveries this year ${descriptionSuffix}`}
          icon={<TrendingUp className="text-primary" />}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Deliveries Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <DeliveriesChart projects={projectsToDisplay} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Error Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ErrorsChart projects={projectsToDisplay} />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Budget vs. Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetChart projects={projectsToDisplay} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
