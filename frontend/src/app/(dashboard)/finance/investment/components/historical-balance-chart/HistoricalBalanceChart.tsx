"use client";

import {Area, AreaChart, XAxis, YAxis} from "recharts";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import {GetHistoricalBalancesQuery, GetHistoricalBalancesQueryVariables} from "@/gql/graphql";
import {
    useChartFormatter
} from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/useChartFormatter";
import {useChartConfig} from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/useChartConfig";
import {useState} from "react";
import {TimeframeSelect} from "@/app/(dashboard)/finance/investment/components/timeframe-select/TimeframeSelect";
import {GET_HISTORICAL_BALANCE} from "@/api/crypto";
import {useQuery} from "@apollo/client";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";
import {HistoricalCryptoBalance} from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/types";

interface IProps {
    cryptoPortfolioId: string;
}

export default function HistoricalBalanceChart({cryptoPortfolioId}: IProps) {
    const {timeFormatterForTooltip, balanceFormatter, timeFormatter} = useChartFormatter();
    const [timeFrame, setTimeframe] = useState("1 hour");
    const { data } = useQuery<
        GetHistoricalBalancesQuery,
        GetHistoricalBalancesQueryVariables
    >(GET_HISTORICAL_BALANCE, {
        variables: {
            data: { cryptoPortfolioId, timeFrame },
            pagination: { take: 500 },
        },
    });
    const historicalData = data?.getHistoricalBalances ?? [];

    const chartConfig = useChartConfig(historicalData);

    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">
                    Assets Analysis
                </CardTitle>
                <TimeframeSelect timeframe={timeFrame} setTimeframe={setTimeframe}/>
            </CardHeader>
            <CardContent className="">
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={historicalData}
                        margin={{
                            left: 12,
                            right: 12,
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
                            formatter={balanceFormatter}
                            labelFormatter={timeFormatterForTooltip}
                            content={<ChartTooltipContent hideLabel={false}/>}
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
                        <Area
                            dataKey="estimatedBalance"
                            type="monotone"
                            strokeWidth={2}
                            fill="url(#fillChart)"
                            fillOpacity={0.4}
                            stroke="var(--color-trend)"
                            stackId="a"
                        />
                        {/*<Line*/}
                        {/*    label={false}*/}
                        {/*    dataKey="estimatedBalance"*/}
                        {/*    type="monotone"*/}
                        {/*    stroke="var(--color-trend)"*/}
                        {/*    strokeWidth={2}*/}
                        {/*    dot={false}*/}
                        {/*/>*/}
                    </AreaChart>
                    {/*<LineChart*/}
                    {/*    accessibilityLayer*/}
                    {/*    data={historicalData}*/}
                    {/*    margin={{*/}
                    {/*        right: 12,*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <XAxis dataKey="time" hide />*/}
                    {/*    <ChartTooltip*/}
                    {/*        cursor={true}*/}
                    {/*        formatter={balanceFormatter}*/}
                    {/*        labelFormatter={timeFormatterForTooltip}*/}
                    {/*        content={<ChartTooltipContent hideLabel={false} />}*/}
                    {/*    />*/}
                    {/*    <YAxis*/}
                    {/*        type="number"*/}
                    {/*        domain={["auto", "auto"]}*/}
                    {/*        tickLine={false}*/}
                    {/*        axisLine={false}*/}
                    {/*        tickFormatter={balanceFormatter}*/}
                    {/*    />*/}
                    {/*    <Line*/}
                    {/*        label={false}*/}
                    {/*        dataKey="estimatedBalance"*/}
                    {/*        type="monotone"*/}
                    {/*        stroke="var(--color-trend)"*/}
                    {/*        strokeWidth={2}*/}
                    {/*        dot={false}*/}
                    {/*    />*/}
                    {/*</LineChart>*/}
                </ChartContainer>

            </CardContent>
        </Card>
    );
}



