"use client"

import {Cell, Pie, PieChart} from "recharts"

import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {GetCryptoPortfolioQuery} from "@/gql/graphql";
import {useMemo} from "react";

interface IProps {
    balances: GetCryptoPortfolioQuery["getCryptoPortfolios"][number]["balances"];
}


export function ProportionalBalanceChart({ balances }: IProps) {

    const colors = ["hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", ];

    const chartData = useMemo(() => {
        const sortedBalances = balances
            .map(b => ({
                balance: b.balance * b.assetInfo.lastPrice,
                name: b.assetInfo.symbol
            }))
            .sort((a, b) => b.balance - a.balance); // Sort in descending order

        if (sortedBalances.length <= 5) {
            return sortedBalances; // No need to aggregate if there are 5 or fewer items
        }

        const top4 = sortedBalances.slice(0, 4);
        const otherBalance = sortedBalances.slice(4).reduce((sum, b) => sum + b.balance, 0);

        return [...top4, { balance: otherBalance, name: "Other" }];
    }, [balances]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={{}}
                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="name" hideLabel />}
                        />
                        <Pie
                            data={chartData} // Use the modified chartData
                            dataKey="balance"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}

                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}