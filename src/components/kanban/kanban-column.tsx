import type { Project, ProjectStage } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { KanbanCard } from './kanban-card';

interface KanbanColumnProps {
    stage: ProjectStage;
    projects: Project[];
}

export function KanbanColumn({ stage, projects }: KanbanColumnProps) {
    return (
        <Card className="w-80 shrink-0 h-full flex flex-col">
            <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <span>{stage}</span>
                    <span className="text-sm font-normal bg-muted text-muted-foreground rounded-full px-2 py-0.5">{projects.length}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-1 overflow-y-auto bg-secondary/50">
                <div className="flex flex-col gap-2">
                    {projects.map(project => (
                        <KanbanCard key={project.id} project={project} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
