import MoneyWithCurrency from "@/components/money/money-with-currency";
import React from "react";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {BankManager} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import {useTotalBankBalance} from "@/app/(dashboard)/finance/components/overview/useTotalBankBalance";
import {useTotalInvestmentBalance} from "@/app/(dashboard)/finance/components/overview/useTotalInvestmentBalance";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";
import {useChartConfig} from "@/app/(dashboard)/finance/components/overview/useChartConfig";
import {useChartFormatter} from "@/app/(dashboard)/finance/components/overview/useChartFormatter";
import {MoneyAnimated} from "@/components/money/money-animated";

interface IProps {
    bankManagers: BankManager[];
}

export default function BankSummary({bankManagers}: IProps) {
    const historicalBalances = bankManagers?.[0]?.banks?.[0].historicalBalances || [];
    const {timeFormatterForTooltip, balanceFormatter, timeFormatter} = useChartFormatter()
    const chartConfig = useChartConfig(historicalBalances);
    const totalBankBalance = useTotalBankBalance(bankManagers);
    const totalInvestmentBalance = useTotalInvestmentBalance();
    const totalBalance = totalBankBalance + totalInvestmentBalance;

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">
                    Bank Balance

                </CardTitle>
                <div className="w-min">
                    <MoneyAnimated number={totalBalance} className="font-mono p-1 text-3xl"/>
                </div>
            </CardHeader>
            <CardContent className="pt-0 text-nowrap">


                <ResponsiveContainer>
                    <ChartContainer config={chartConfig} className="min-h-[30rem]">
                        <LineChart
                            accessibilityLayer
                            data={historicalBalances}
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
                                tickFormatter={timeFormatter}
                            />
                            <ChartTooltip
                                cursor={true}
                                labelFormatter={timeFormatterForTooltip}
                                content={<ChartTooltipContent hideLabel={false} />}
                            />
                            <YAxis
                                type="number"
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
                                dataKey="balance"
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
    )
}