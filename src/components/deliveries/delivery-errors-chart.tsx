
"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import type { Delivery } from "@/lib/types"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"

interface DeliveryErrorsChartProps {
  delivery: Delivery;
}

const chartConfig = {
  errors: {
    label: "Cantidad de Errores",
    color: "hsl(var(--destructive))",
  },
  solutionTime: {
    label: "Tiempo Solución (días)",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function DeliveryErrorsChart({ delivery }: DeliveryErrorsChartProps) {
  const chartData = [
    {
        name: "Errores",
        errors: delivery.errorCount || 0,
        solutionTime: delivery.errorSolutionTime || 0,
    }
  ];

  if (delivery.errorCount === undefined) {
    return (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
           No hay datos de errores para esta entrega todavía.
        </div>
    )
  }

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
        />
        <Tooltip
          content={<ChartTooltipContent />}
          cursor={{ fill: "hsl(var(--accent))" }}
        />
        <Legend
            wrapperStyle={{
                fontSize: "12px",
                paddingTop: "20px"
            }}
        />
        <Bar dataKey="errors" name="Cantidad de Errores" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="solutionTime" name="Tiempo Solución (días)" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
