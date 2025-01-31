"use client"
import {Area, AreaChart, Line, LineChart, ReferenceLine, XAxis, YAxis} from "recharts"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {useChartConfig} from "@/app/(dashboard)/finance/investment/components/asset-profit-line-chart/useChartConfig";
import {HistoricalAssetProfit} from "@/app/(dashboard)/finance/investment/types";
import React from "react";
import {
    useChartFormatter
} from "@/app/(dashboard)/finance/investment/components/asset-profit-line-chart/useChartFormatter";
import {useConvertCurrencies} from "@/lib/hooks/use-convert-currency";

interface IProps {
    profitData: HistoricalAssetProfit[]
    minimal?: boolean
}

export function AssetProfitLineChart({profitData, minimal}: IProps) {
    const chartConfig = useChartConfig(profitData)
    const id = profitData[0]?.estimatedProfit
    const {balanceFormatter, timeFormatterForTooltip, timeFormatter} = useChartFormatter();
    const convertedData = useConvertCurrencies<HistoricalAssetProfit>(profitData, "estimatedProfit");
    // const convertedData = profitData
    const dataMax = Math.max(...convertedData.map((i) => i.estimatedProfit));
    const dataMin = Math.min(...convertedData.map((i) => i.estimatedProfit));

    // const gradientOffset = () => {
    //     if (dataMax <= 0) {
    //         return 0;
    //     }
    //     if (dataMin >= 0) {
    //         return 1;
    //     }
    //
    //     return dataMax / (dataMax - dataMin);
    // };
    // const off = gradientOffset();

    return (
        <ChartContainer config={chartConfig} className="p-4 overflow-visible">
            <AreaChart>
                <ChartTooltip
                    cursor={true}
                    labelClassName="text-muted-foreground"
                    labelFormatter={timeFormatterForTooltip}
                    content={
                        <ChartTooltipContent hideLabel={false} valueFormatter={balanceFormatter}/>
                    }
                />
                <YAxis
                    dataKey="estimatedProfit"
                    type="number"
                    domain={[dataMin, dataMax]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={balanceFormatter}
                    hide={minimal}
                />
                <XAxis
                    dataKey="time"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={700}
                    hide={minimal}
                    type="category"
                    allowDuplicatedCategory={false}
                    tickFormatter={timeFormatter}
                />
                {/*<ReferenceLine y={0} stroke="var(--color-trend)" strokeDasharray="2 2" ifOverflow="extendDomain"/>*/}
                <Area
                    data={convertedData}
                    dataKey="estimatedProfit"
                    name="profit"
                    type="monotone"
                    // stroke={`url(#splitColor${id})`}
                    // stroke="var(--color-trend)"
                    // fill="var(--color-trend)"
                    // strokeWidth={2}
                    // fillOpacity="0.5"
                    // fill={`url(#splitColor${id})`}
                    dot={false}
                    strokeWidth={2}
                    fill={`url(#fillChart${id})`}
                    fillOpacity={0.4}
                    stroke="var(--color-trend)"
                    stackId="a"
                    style={{ filter: "drop-shadow(0 0 2px var(--color-trend))" }}
                />
                <defs>
                    <linearGradient id={"fillChart" + id} x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="var(--color-trend)"
                            stopOpacity={0.4}
                        />
                        <stop
                            offset="95%"
                            stopColor="var(--color-trend)"
                            stopOpacity={0.1}
                        />
                    </linearGradient>
                </defs>

                {/*<defs>*/}
                {/*    <linearGradient id={"splitColor" + id} x1="0" y1="0" x2="0" y2="1">*/}
                {/*        <stop offset={off} stopColor="var(--color-up)" stopOpacity={1}/>*/}
                {/*        <stop offset={off} stopColor="var(--color-down)" stopOpacity={1}/>*/}
                {/*    </linearGradient>*/}
                {/*</defs>*/}
            </AreaChart>
        </ChartContainer>
    )
}