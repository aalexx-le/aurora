"use client";

import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import {
    useChartFormatter
} from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/useChartFormatter";
import {useChartConfig} from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/useChartConfig";
import {useState} from "react";
import {TimeframeSelect} from "@/app/(dashboard)/finance/investment/components/timeframe-select/TimeframeSelect";
import {
    useHistoricalBalanceQuery
} from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/useHistoricalBalanceQuery";
import {TimeframeEnum} from "@/lib/utils/date-time/timeframe.enum";

interface IProps {
    cryptoPortfolioId: string;
}

export default function HistoricalBalanceChart({cryptoPortfolioId}: IProps) {
    const {timeFormatterForTooltip, balanceFormatter, timeFormatter} = useChartFormatter();
    const [timeFrame, setTimeframe] = useState(TimeframeEnum.ONE_HOUR);

    const historicalData = useHistoricalBalanceQuery(cryptoPortfolioId, timeFrame);
    const chartConfig = useChartConfig(historicalData);


    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">
                    Assets Analysis
                </CardTitle>
                <TimeframeSelect timeframe={timeFrame} setTimeframe={setTimeframe}/>
            </CardHeader>
            <CardContent className="flex-1">
                <ResponsiveContainer>
                    <ChartContainer config={chartConfig} className="min-h-[20rem]">
                        <LineChart
                            accessibilityLayer
                            data={historicalData}
                            className="overflow-visible"
                            margin={{
                                top: 10,
                                left: 22,
                                right: 22,
                            }}
                        >
                            <XAxis
                                dataKey="time"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={120}
                                // scale="time"
                                // allowDuplicatedCategory={true}
                                tickFormatter={timeFormatter}
                            />
                            <ChartTooltip
                                cursor={true}
                                labelFormatter={timeFormatterForTooltip}
                                content={<ChartTooltipContent hideLabel={false} valueFormatter={balanceFormatter}/>}
                            />
                            <YAxis
                                type="number"
                                domain={['dataMin', 'dataMax']}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={balanceFormatter}
                                orientation="right"
                            />
                            <defs>
                                <linearGradient id="fillChart" x1="0" y1="0" x2="0" y2="1">
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
                            <Line
                                dataKey="estimatedBalance"
                                name="balance"
                                type="monotone"
                                strokeWidth={2}
                                // fill="url(#fillChart)"
                                fillOpacity={0.4}
                                stroke="var(--color-trend)"
                                dot={false}
                                style={{ filter: "drop-shadow(0 0 8px var(--color-trend))" }}
                                // stackId="a"
                            />
                        </LineChart>
                    </ChartContainer>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}



