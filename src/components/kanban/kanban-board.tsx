'use client';

import type { Project, ProjectStage } from '@/lib/types';
import { KanbanColumn } from './kanban-column';

const STAGES: ProjectStage[] = ['Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado'];

interface KanbanBoardProps {
    projects: Project[];
}

export function KanbanBoard({ projects }: KanbanBoardProps) {
    return (
        <div className="flex gap-4 overflow-x-auto h-full pb-4">
            {STAGES.map(stage => {
                const projectsInStage = projects.filter(p => p.stage === stage);
                return (
                    <KanbanColumn key={stage} stage={stage} projects={projectsInStage} />
                );
            })}
        </div>
    );
}
