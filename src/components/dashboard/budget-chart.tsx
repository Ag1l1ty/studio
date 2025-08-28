"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import type { Project } from "@/lib/types"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

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
  const chartData = projects
    .filter(p => p.stage !== 'Closed')
    .map(p => ({
        name: p.id,
        budget: p.budget,
        spent: p.budgetSpent,
    }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData}>
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
          content={<ChartTooltipContent formatter={(value, name) => `$${Number(value).toLocaleString()}`} />}
          cursor={{ fill: "hsl(var(--accent))" }}
        />
        <Legend
            wrapperStyle={{
                fontSize: "12px",
                paddingTop: "20px"
            }}
        />
        <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="spent" name="Spent" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
