"use client"

import {Label, Pie, PieChart} from "recharts"

import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {GetCryptoPortfoliosQuery} from "@/gql/graphql";
import {useEffect, useState} from "react";
import {FastAverageColor, FastAverageColorResource} from "fast-average-color";

interface IProps {
    balances: GetCryptoPortfoliosQuery["getCryptoPortfolios"][number]["balances"];
}

type ChartData = {
    balance: number;
    name: string;
    fill: string;
}

const MIN_THRESHOLD = 10;

export function BalancePieChart({ balances }: IProps) {
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const totalSymbols = balances.filter(b => b.balance > MIN_THRESHOLD).length;

    useEffect(() => {
        const getChartData = async () => {
            const fac = new FastAverageColor();
            const mapBalances = await Promise.all(balances
                .map(async b => ({
                    balance: b.balance * b.assetInfo.lastPrice,
                    name: b.assetInfo.symbol,
                    fill: (await fac.getColorAsync(b.assetInfo.logo as unknown as FastAverageColorResource)).rgb
                })))

            const sortedBalances = mapBalances.sort((a, b) => b.balance - a.balance);

            if (sortedBalances.length <= 5) {
                return sortedBalances;
            }

            const top4 = sortedBalances.slice(0, 4);
            const otherBalance = sortedBalances.slice(4).reduce((sum, b) => sum + b.balance, 0);

            return [...top4, { balance: otherBalance, name: "Other", fill: "hsl(var(--chart-2))" }];
        }

        getChartData().then(data => setChartData(data));
    }, [balances])

    return (
        <Card className="flex-1">
            <CardHeader className="items-center text-xl font-bold text-muted-foreground tracking-wide pb-0">
                <CardTitle>Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={{}}>
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent nameKey="name"/>}
                        />
                        <Pie
                            data={chartData} // Use the modified chartData
                            dataKey="balance"
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
                                content={({ viewBox }) => {
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
                        <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                            className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}