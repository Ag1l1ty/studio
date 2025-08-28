"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Project } from '@/lib/types';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '../ui/chart';

interface ProjectTrendsChartProps {
    metrics: Project['metrics'];
}

const chartConfig = {
    Deliveries: {
        label: "Deliveries",
        color: "hsl(var(--chart-1))",
    },
    Errors: {
        label: "Errors",
        color: "hsl(var(--chart-3))",
    },
    "Budget Spent": {
        label: "Budget Spent",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function ProjectTrendsChart({ metrics }: ProjectTrendsChartProps) {
    const data = metrics.map(m => ({
        name: m.month,
        Deliveries: m.deliveries,
        Errors: m.errors,
        "Budget Spent": m.spent,
    }));

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
                <YAxis yAxisId="left" stroke="hsl(var(--chart-1))" fontSize={12} tickFormatter={(v) => `${v}`} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
                <Line yAxisId="left" type="monotone" dataKey="Deliveries" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                <Line yAxisId="left" type="monotone" dataKey="Errors" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="Budget Spent" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </LineChart>
        </ChartContainer>
    );
}
