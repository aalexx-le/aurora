"use client"

import {Label, Pie, PieChart, ResponsiveContainer} from "recharts"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {AnalyseData} from "@/app/(dashboard)/finance/investment/components/portfolio-analysis/PortfolioAnalysis";
import {useCallback} from "react";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";
import {formatCurrency} from "@/lib/utils/currency/format-currency";

interface IProps {
    data: AnalyseData[]
}

const MIN_THRESHOLD = 10;

export function BalancePieChart({data}: IProps) {
    const valueFormatter = useCallback(
        (balance: number | string) => formatCurrency(Number(balance), "USD"),
        [],
    )
    const totalSymbols = data.filter(b => b.invest > MIN_THRESHOLD).length;

    return (
        <ResponsiveContainer>
            <ChartContainer config={{}} className="min-h-[10rem] min-w-[10rem] aspect-square">
                <PieChart>
                    <ChartTooltip
                        content={<ChartTooltipContent nameKey="name" valueFormatter={valueFormatter}/>}
                    />
                    <Pie
                        data={data}
                        dataKey="invest"
                        cx="50%"
                        cy="50%"
                        fill="fill"
                        startAngle={90}
                        endAngle={-270}
                        labelLine={false}
                        innerRadius={60}
                        outerRadius={80}
                    >
                        <Label
                            content={({viewBox}) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className="fill-foreground text-3xl font-bold"
                                            >
                                                {totalSymbols.toLocaleString()}
                                            </tspan>
                                            <tspan
                                                x={viewBox.cx}
                                                y={(viewBox.cy || 0) + 24}
                                                className="fill-muted-foreground"
                                            >
                                                Coins {`> ${MIN_THRESHOLD}$`}
                                            </tspan>
                                        </text>
                                    )
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
        </ResponsiveContainer>
    )
}
