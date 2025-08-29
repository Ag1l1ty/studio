
"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { Delivery } from '@/lib/types';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '../ui/chart';
import { differenceInDays } from 'date-fns';

interface DeliveryPlanChartProps {
    delivery: Delivery;
}

const chartConfig = {
    "Planificado": {
        label: "Planificado",
        color: "hsl(var(--chart-2))",
    },
    "Real": {
        label: "Real",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

const STAGES = ['Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado'];

export function DeliveryPlanChart({ delivery }: DeliveryPlanChartProps) {
    const startDate = new Date(delivery.creationDate);
    const endDate = new Date(delivery.estimatedDate);
    const totalDays = differenceInDays(endDate, startDate);
    const daysPerStage = totalDays > 0 ? totalDays / (STAGES.length -1) : 0;
    
    const realIndex = STAGES.indexOf(delivery.stage);

    const data = STAGES.map((stage, index) => {
        const plannedDate = new Date(startDate);
        plannedDate.setDate(plannedDate.getDate() + (daysPerStage * index));
        
        let realValue = null;
        if (index <= realIndex) {
            realValue = index + 1;
        }

        return {
            name: stage,
            Planificado: index + 1,
            Real: realValue,
            date: plannedDate.toLocaleDateString(),
        }
    });

    return (
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 20,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--foreground))" 
                  fontSize={10}
                  angle={-20}
                  textAnchor="end"
                  height={50}
                />
                <YAxis 
                    domain={[0, 7]} 
                    ticks={[1,2,3,4,5,6,7]} 
                    allowDecimals={false}
                    tickFormatter={(value) => STAGES[value - 1]?.substring(0,6) || ''}
                    stroke="hsl(var(--foreground))" 
                    fontSize={12} 
                />
                <Tooltip 
                    content={<ChartTooltipContent 
                        formatter={(value, name, props) => {
                            const stageName = props.payload.name;
                            return (
                                <div className="flex flex-col">
                                    <span>{stageName}</span>
                                    {name === 'Planificado' && <span className="text-xs text-muted-foreground">Fecha Plan: {props.payload.date}</span>}
                                </div>
                            )
                        }}
                    />} 
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
                <Line yAxisId={0} type="monotone" dataKey="Planificado" stroke="hsl(var(--chart-2))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line yAxisId={0} type="monotone" dataKey="Real" stroke="hsl(var(--chart-1))" strokeWidth={2} />
            </LineChart>
        </ChartContainer>
    );
}
