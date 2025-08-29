'use client';

import type { Project, ProjectStage } from '@/lib/types';
import { KanbanColumn } from './kanban-column';

interface KanbanBoardProps {
    projects: Project[];
    stages: ProjectStage[];
}

export function KanbanBoard({ projects, stages }: KanbanBoardProps) {
    return (
        <div className="flex gap-4 h-full pb-4">
            {stages.map(stage => {
                const projectsInStage = projects.filter(p => p.stage === stage);
                return (
                    <KanbanColumn key={stage} stage={stage} projects={projectsInStage} />
                );
            })}
        </div>
    );
}
