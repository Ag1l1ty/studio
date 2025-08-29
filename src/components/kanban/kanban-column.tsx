
"use client";

import type { Delivery, ProjectStage } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { KanbanCard } from './kanban-card';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';
import { useEffect, useState } from 'react';

interface KanbanColumnProps {
    stage: ProjectStage;
    deliveries: Delivery[];
    onArchiveDelivery: (deliveryId: string) => void;
}

// A workaround for the react-beautiful-dnd library with React 18 strict mode
// See: https://github.com/atlassian/react-beautiful-dnd/issues/2396
const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        const animation = requestAnimationFrame(() => setEnabled(true));
        return () => {
            cancelAnimationFrame(animation);
            setEnabled(false);
        };
    }, []);
    if (!enabled) {
        return null;
    }
    return <Droppable {...props} isDropDisabled={props.isDropDisabled ?? false} isCombineEnabled={props.isCombineEnabled ?? false} ignoreContainerClipping={props.ignoreContainerClipping ?? false}>{children}</Droppable>;
};


export function KanbanColumn({ stage, deliveries, onArchiveDelivery }: KanbanColumnProps) {
    return (
        <Card className="w-80 shrink-0 h-full flex flex-col">
            <CardHeader className="p-4">
                <CardTitle className="text-base font-semibold flex items-center justify-between">
                    <span>{stage}</span>
                    <span className="text-sm font-normal bg-muted text-muted-foreground rounded-full px-2 py-0.5">{deliveries.length}</span>
                </CardTitle>
            </CardHeader>
            <StrictModeDroppable droppableId={stage}>
                {(provided, snapshot) => (
                    <CardContent
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-2 flex-1 overflow-y-auto ${snapshot.isDraggingOver ? 'bg-accent' : 'bg-secondary/50'} transition-colors duration-200`}
                    >
                        <div className="flex flex-col gap-2">
                            {deliveries.map((delivery, index) => (
                                <KanbanCard 
                                    key={delivery.id} 
                                    delivery={delivery} 
                                    index={index}
                                    onArchive={onArchiveDelivery}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    </CardContent>
                )}
            </StrictModeDroppable>
        </Card>
    );
}
