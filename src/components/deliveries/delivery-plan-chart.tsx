
"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { Delivery, ProjectStage } from '@/lib/types';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '../ui/chart';
import { differenceInDays, format, parseISO, addDays } from 'date-fns';

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

const STAGES: ProjectStage[] = ['Definición', 'Desarrollo Local', 'Ambiente DEV', 'Ambiente TST', 'Ambiente UAT', 'Soporte Productivo', 'Cerrado'];

export function DeliveryPlanChart({ delivery }: DeliveryPlanChartProps) {
    const startDate = parseISO(delivery.creationDate);
    const endDate = parseISO(delivery.estimatedDate);
    
    const totalDays = differenceInDays(endDate, startDate);
    const daysPerStage = totalDays > 0 ? totalDays / (STAGES.length -1) : 0;

    const plannedData = STAGES.map((stage, index) => {
        const date = addDays(startDate, daysPerStage * index);
        return { x: date.getTime(), y: index, stage, type: 'Planificado' };
    });

    // Simulate real dates if not present
    const realStageDates = delivery.stageDates || {};
    const currentStageIndex = STAGES.indexOf(delivery.stage);

    if (!realStageDates['Definición']) {
        realStageDates['Definición'] = delivery.creationDate;
    }

    const realData = STAGES.map((stage, index) => {
        if (index > currentStageIndex || !realStageDates[stage]) {
            return null;
        }
        const date = parseISO(realStageDates[stage]!);
        return { x: date.getTime(), y: index, stage, type: 'Real' };
    }).filter(Boolean);

    const allData = [...plannedData, ...realData].sort((a,b) => a!.x - b!.x);
    const domainMin = Math.min(...allData.map(d => d!.x));
    const domainMax = Math.max(...allData.map(d => d!.x), endDate.getTime());

    return (
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
            <LineChart
                accessibilityLayer
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 40,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                    type="number"
                    dataKey="x"
                    domain={[domainMin, domainMax]}
                    tickFormatter={(unixTime) => format(new Date(unixTime), 'MMM d')}
                    stroke="hsl(var(--foreground))" 
                    fontSize={12}
                    angle={-35}
                    textAnchor="end"
                    height={60}
                />
                <YAxis 
                    type="number"
                    dataKey="y"
                    domain={[0, STAGES.length - 1]} 
                    ticks={[0, 1, 2, 3, 4, 5, 6]}
                    tickFormatter={(value) => STAGES[value] || ''}
                    stroke="hsl(var(--foreground))" 
                    fontSize={12} 
                    width={100}
                />
                <Tooltip 
                    content={<ChartTooltipContent 
                        formatter={(value, name, props) => {
                            const stageName = props.payload.stage;
                            const date = format(new Date(props.payload.x), 'MMM d, yyyy');
                            return (
                                <div className="flex flex-col">
                                    <span className="font-semibold">{stageName}</span>
                                    <span className="text-xs text-muted-foreground">{name}: {date}</span>
                                </div>
                            )
                        }}
                        labelFormatter={() => ''}
                        itemSorter={(a, b) => (a.dataKey === 'Real' ? -1 : 1)}
                    />} 
                    cursor={{ strokeDasharray: '3 3' }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} />
                 <Line 
                  data={plannedData} 
                  type="monotone" 
                  dataKey="y" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={true} 
                  name="Planificado" 
                />
                <Line 
                  data={realData} 
                  type="monotone" 
                  dataKey="y" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2} 
                  dot={true} 
                  name="Real" 
                />
            </LineChart>
        </ChartContainer>
    );
}
