"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { aggregateMetrics } from "@/lib/data"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { Project } from "@/lib/types";

const chartConfig = {
  deliveries: {
    label: "Deliveries",
  },
} satisfies ChartConfig

interface DeliveriesChartProps {
  projects: Project[];
}

export function DeliveriesChart({ projects }: DeliveriesChartProps) {
  const data = aggregateMetrics(projects);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
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
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: "hsl(var(--accent))" }}
        />
        <Bar dataKey="deliveries" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
