import type { Delivery } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight, Calendar, Flag, Package } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';

interface KanbanCardProps {
    delivery: Delivery;
    index: number;
}

export function KanbanCard({ delivery, index }: KanbanCardProps) {

    return (
        <Draggable draggableId={delivery.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <Card className={`hover:shadow-md transition-shadow duration-200 bg-card ${snapshot.isDragging ? 'shadow-lg' : ''}`}>
                        <CardHeader className="p-3 pb-2">
                            <CardTitle className="text-sm font-semibold">Entrega #{delivery.deliveryNumber}</CardTitle>
                            <p className="text-xs text-muted-foreground">{delivery.projectName}</p>
                        </CardHeader>
                        <CardContent className="p-3 pt-0 text-xs text-muted-foreground space-y-2">
                           <div className="flex items-center gap-2">
                             <Calendar className="w-3 h-3" />
                             <span>{format(new Date(delivery.estimatedDate), "MMM dd, yyyy")}</span>
                           </div>
                            <div className="flex items-center gap-2">
                                <Flag className="w-3 h-3" />
                                <span>Budget: ${delivery.budget.toLocaleString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="p-3 pt-0 flex justify-between items-center">
                             <Avatar className="h-6 w-6">
                                <AvatarImage src={`https://picsum.photos/seed/${delivery.owner.name}/100`} alt={delivery.owner.name} />
                                <AvatarFallback>{delivery.owner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                             <Link href={`/projects/${delivery.projectId}`} passHref>
                                <Button variant="ghost" size="sm" className="h-8">
                                    Ver Proyecto <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </Draggable>
    );
}
