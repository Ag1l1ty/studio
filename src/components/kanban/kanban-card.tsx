import type { Project } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

interface KanbanCardProps {
    project: Project;
}

const riskVariantMap = {
    'Low': 'default',
    'Medium': 'secondary',
    'High': 'destructive',
} as const;

export function KanbanCard({ project }: KanbanCardProps) {
    const budgetProgress = (project.budgetSpent / project.budget) * 100;

    const riskColorClass = {
        'Low': 'bg-green-500',
        'Medium': 'bg-yellow-500',
        'High': 'bg-red-500',
    }[project.riskLevel];

    return (
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-grab active:cursor-grabbing bg-card">
            <CardHeader className="p-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-semibold">{project.name}</CardTitle>
                    <div className={cn("w-3 h-3 rounded-full shrink-0", riskColorClass)} title={`Risk Level: ${project.riskLevel}`}></div>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                <div className="text-xs space-y-2">
                    <p className="font-medium">Budget</p>
                    <Progress value={budgetProgress} className="h-2" />
                    <div className="flex justify-between text-muted-foreground">
                        <span>${(project.budgetSpent / 1000).toFixed(0)}k</span>
                        <span>${(project.budget / 1000).toFixed(0)}k</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-3 pt-0 flex justify-between items-center">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://picsum.photos/seed/${project.owner.name}/100`} alt={project.owner.name} />
                    <AvatarFallback>{project.owner.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Link href={`/projects/${project.id}`} passHref legacyBehavior>
                    <Button variant="ghost" size="sm" className="h-8">
                        Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
