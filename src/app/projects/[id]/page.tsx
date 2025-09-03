import { getProjectById, getProjects } from "@/lib/data";
import { notFound } from 'next/navigation';
import { ProjectDetailCard } from "@/components/projects/project-detail-card";
import { ProjectTrendsChart } from "@/components/projects/project-trends-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Calendar, Users, Target } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";

export async function generateStaticParams() {
    const projects = getProjects();
    return projects.map((project) => ({
        id: project.id,
    }));
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const project = getProjectById(params.id);

    if (!project) {
        notFound();
    }

    const budgetProgress = Math.round((project.budgetSpent / project.budget) * 100);
    const totalDeliveries = project.metrics.reduce((acc, m) => acc + m.deliveries, 0);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-2xl font-bold tracking-tight">{project.name}</h2>
            <p className="text-muted-foreground">{project.description}</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ProjectDetailCard title="Status" value={project.stage} icon={<Target />} />
                <ProjectDetailCard title="Risk Level" value={project.riskLevel} icon={<AlertTriangle />} variant={project.riskLevel === 'High' ? 'destructive' : project.riskLevel === 'Medium' ? 'warning' : 'default'} />
                <ProjectDetailCard title="Project Owner" value={project.owner.name} icon={<Users />} />
                <ProjectDetailCard title="Timeline" value={`${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}`} icon={<Calendar />} />
                <ProjectDetailCard title="Budget" value={`$${project.budget.toLocaleString()}`} icon={<DollarSign />} />
                <ProjectDetailCard title="Total Deliveries" value={totalDeliveries.toString()} icon={<TrendingUp />} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Project Trends</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ProjectTrendsChart metrics={project.metrics} />
                </CardContent>
            </Card>
        </div>
    );
}
