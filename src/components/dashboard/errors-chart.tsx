"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { aggregateMetrics } from "@/lib/data"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import type { Project } from "@/lib/types";

const chartConfig = {
  errors: {
    label: "Errors",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

interface ErrorsChartProps {
    projects: Project[];
}

export function ErrorsChart({ projects }: ErrorsChartProps) {
  const data = aggregateMetrics(projects);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={data}>
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
        <Line type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--destructive))" }} />
      </LineChart>
    </ChartContainer>
  )
}
