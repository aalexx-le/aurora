import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {ComposedChart, Line, ResponsiveContainer, XAxis, YAxis} from "recharts";
import React from "react";
import {
    useChartFormatter
} from "@/app/(dashboard)/finance/investment/components/asset-price-line-chart/useChartFormatter";
import {useChartConfig} from "@/app/(dashboard)/finance/investment/components/asset-price-line-chart/useChartConfig";
import {AssetPrice} from "@/app/(dashboard)/finance/investment/types";

interface IProps {
    priceData: AssetPrice[]
}

export function AssetPriceLineChart({priceData}: IProps) {
    const {balanceFormatter, timeFormatterForTooltip, timeFormatter} = useChartFormatter();
    const chartConfig = useChartConfig(priceData);

    return (
        <ChartContainer config={chartConfig}>
            <ComposedChart
                accessibilityLayer
                data={priceData}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <ChartTooltip
                    cursor={true}
                    labelClassName="text-muted-foreground"
                    labelFormatter={timeFormatterForTooltip}
                    content={
                        <ChartTooltipContent hideLabel={false}/>
                    }
                />
                <YAxis
                    dataKey="closePrice"
                    type="number"
                    domain={["auto", "auto"]}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={balanceFormatter}
                />
                <XAxis
                    dataKey="open_time"
                    tickLine={false}
                    tickMargin={8}
                    minTickGap={700}
                    axisLine={false}
                    tickFormatter={timeFormatter}
                />
                {/*<Bar dataKey="volume" fill="var(--color-trend)" radius={4} barSize={20}/>*/}
                <Line
                    label={false}
                    name="price"
                    dataKey="closePrice"
                    type="monotoneX"
                    stroke="var(--color-trend)"
                    strokeWidth={2}
                    dot={false}
                />
            </ComposedChart>
        </ChartContainer>
    )
}