"use client";

import {Line, LineChart, XAxis, YAxis} from "recharts";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import {GetCryptoPortfolioQuery} from "@/gql/graphql";
import {useChartFormatter} from "@/app/dashboard/finance/components/historicalBalanceChart/useChartFormatter";
import {useChartConfig} from "@/app/dashboard/finance/components/historicalBalanceChart/useChartConfig";

interface IProps {
    historicalData: GetCryptoPortfolioQuery["getCryptoPortfolios"][number]["historicalBalances"];
}

export default function HistoricalBalanceChart({ historicalData }: IProps) {
    const { timeFormatterForTooltip, balanceFormatter } = useChartFormatter();
    const chartConfig = useChartConfig(historicalData)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">
                    History
                </CardTitle>
                {/*<CardDescription>January - June 2024</CardDescription>*/}
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={historicalData}
                        margin={{
                            right: 12,
                        }}
                    >
                        <XAxis dataKey="time" hide />
                        <ChartTooltip
                            cursor={true}
                            formatter={balanceFormatter}
                            labelFormatter={timeFormatterForTooltip}
                            content={<ChartTooltipContent hideLabel={false} />}
                        />
                        <YAxis
                            type="number"
                            domain={["auto", "auto"]}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={balanceFormatter}
                        />
                        <Line
                            label={false}
                            dataKey="estimatedBalance"
                            type="monotone"
                            stroke="var(--color-trend)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
