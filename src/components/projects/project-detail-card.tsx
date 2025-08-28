import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProjectDetailCardProps = {
    title: string;
    value: string;
    icon: ReactNode;
    variant?: 'default' | 'destructive' | 'warning';
}

export function ProjectDetailCard({ title, value, icon, variant = 'default' }: ProjectDetailCardProps) {
    const valueColor = {
        'default': 'text-foreground',
        'destructive': 'text-destructive',
        'warning': 'text-yellow-600 dark:text-yellow-400'
    }[variant];
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className={cn("text-xl font-bold", valueColor)}>{value}</div>
            </CardContent>
        </Card>
    );
}
