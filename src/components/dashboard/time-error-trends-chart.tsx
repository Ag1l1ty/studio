
"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { aggregateMetrics } from "@/lib/data"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { Project } from "@/lib/types";

const chartConfig = {
  avgErrorSolutionTime: {
    label: "Avg. Solution Time (Days)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

interface TimeErrorTrendsChartProps {
    projects: Project[];
}

export function TimeErrorTrendsChart({ projects }: TimeErrorTrendsChartProps) {
  const data = aggregateMetrics(projects);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}d`}
        />
        <Tooltip
            content={<ChartTooltipContent 
                formatter={(value, name) => (
                    <div className="flex flex-col">
                        <span className="text-muted-foreground">{chartConfig.avgErrorSolutionTime.label}</span>
                        <span>{Number(value).toFixed(1)} days</span>
                    </div>
                )}
                 labelFormatter={(label) => `Month: ${label}`}
            />}
            cursor={{ fill: "hsl(var(--accent))" }}
        />
        <Line 
          type="monotone" 
          dataKey="avgErrorSolutionTime" 
          stroke="hsl(var(--chart-4))" 
          strokeWidth={2} 
          name="Avg. Solution Time (Days)"
          dot={{ r: 4, fill: "hsl(var(--chart-4))" }} 
        />
      </LineChart>
    </ChartContainer>
  )
}
