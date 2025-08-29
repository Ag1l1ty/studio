import type { Project, ProjectStage } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { KanbanCard } from './kanban-card';
import { Droppable } from 'react-beautiful-dnd';

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
            <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                    <CardContent
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-2 flex-1 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-accent' : 'bg-secondary/50'} transition-colors duration-200`}
                    >
                        <div className="flex flex-col gap-2">
                            {projects.map((project, index) => (
                                <KanbanCard key={project.id} project={project} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    </CardContent>
                )}
            </Droppable>
        </Card>
    );
}
