'use client';

import type { Delivery, ProjectStage } from '@/lib/types';
import { KanbanColumn } from './kanban-column';

interface KanbanBoardProps {
    deliveries: Delivery[];
    stages: ProjectStage[];
}

export function KanbanBoard({ deliveries, stages }: KanbanBoardProps) {
    return (
        <div className="flex gap-4 h-full pb-4">
            {stages.map(stage => {
                const deliveriesInStage = deliveries.filter(d => d.stage === stage);
                return (
                    <KanbanColumn key={stage} stage={stage} deliveries={deliveriesInStage} />
                );
            })}
        </div>
    );
}
