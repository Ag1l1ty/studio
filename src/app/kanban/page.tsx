import { KanbanBoard } from '@/components/kanban/kanban-board';
import { getProjects } from '@/lib/data';

export default function KanbanPage() {
    const projects = getProjects();
    return (
        <div className="flex-1 h-full p-4 md:p-8">
            <KanbanBoard projects={projects} />
        </div>
    );
}
