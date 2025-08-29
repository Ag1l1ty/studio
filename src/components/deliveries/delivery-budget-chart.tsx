
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import type { Delivery } from "@/lib/types"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"

interface DeliveryBudgetChartProps {
  delivery: Delivery;
  currentSpent: number;
}

const chartConfig = {
  budget: {
    label: "Presupuesto Estimado",
    color: "hsl(var(--chart-2))",
  },
  spent: {
    label: "Uso Real",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function DeliveryBudgetChart({ delivery, currentSpent }: DeliveryBudgetChartProps) {
  const chartData = [
    {
        name: "Presupuesto",
        budget: delivery.budget,
        spent: currentSpent,
    }
  ];

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full mt-6">
      <BarChart accessibilityLayer data={chartData} layout="vertical">
        <XAxis
          type="number"
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />
        <YAxis
          type="category"
          dataKey="name"
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
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
        <Bar dataKey="budget" name="Presupuesto Estimado" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="spent" name="Uso Real" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
