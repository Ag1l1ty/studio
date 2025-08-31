"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import type { Project } from "@/lib/types"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { aggregateMetrics } from "@/lib/data"

interface BudgetChartProps {
  projects: Project[];
}

const chartConfig = {
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-2))",
  },
  spent: {
    label: "Spent",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function BudgetChart({ projects }: BudgetChartProps) {
  const chartData = aggregateMetrics(projects);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <LineChart accessibilityLayer data={chartData}>
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
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <Tooltip
          content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}`} />}
          cursor={{ fill: "hsl(var(--accent))" }}
        />
        <Legend
            wrapperStyle={{
                fontSize: "12px",
                paddingTop: "20px"
            }}
        />
        <Line type="monotone" dataKey="budget" name="Budget" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} strokeDasharray="5 5" />
        <Line type="monotone" dataKey="spent" name="Spent" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  )
}
