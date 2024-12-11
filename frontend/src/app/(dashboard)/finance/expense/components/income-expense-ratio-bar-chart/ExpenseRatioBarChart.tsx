"use client"

import {Line, LineChart, XAxis, YAxis} from "recharts"

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {ExpenseCategory} from "@/app/(dashboard)/finance/expense/components/category-list/types";
import {useMemo} from "react";
import {useConvertCurrencyContext} from "@/lib/context/convert-currency.context";

const chartData = [
    {month: "January", desktop: 186, mobile: 80},
    {month: "February", desktop: 305, mobile: 200},
    {month: "March", desktop: 237, mobile: 120},
    {month: "April", desktop: 73, mobile: 190},
    {month: "May", desktop: 209, mobile: 130},
    {month: "June", desktop: 214, mobile: 140},
]

const chartConfig = {
    income: {
        label: "Income",
        color: "hsl(var(--chart-1))",
    },
    expense: {
        label: "Expense",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

interface IProps {
    categories: ExpenseCategory[]
}

export function ExpenseRatioBarChart({categories}: IProps) {
    const expenseCategories = ['Necessary Expenses', 'Discretionary Expenses']
    const incomeCategories = ['Income', 'Investment']
    const {formatCurrency} = useConvertCurrencyContext()
    const expenseFormatter = (value: number) => formatCurrency(value)
    const chartData = useMemo(() => {
        // return categories?.map((category, index) => ({
        //     month: category.name,
        //     amount: category.totalSpentAmounts.reduce((acc, curr) => acc + Math.abs(curr.amount), 0),
        // })
        const monthMap: Map<number, any> = new Map<number, any>()
        categories.forEach((category) => {
            category.totalSpentAmounts.forEach((spentAmount) => {
                const month = spentAmount.month
                if (monthMap.get(month)) {
                    monthMap.set(month, {
                        ...monthMap.get(month),
                        [category.name]: Math.abs(spentAmount.amount),
                    })
                } else {
                    const date = new Date(spentAmount.year, spentAmount.month - 1, 1)
                    monthMap.set(month, {
                        month: date.toLocaleString("default", {month: "long"}),
                        [category.name]: Math.abs(spentAmount.amount),
                    })
                }
            })
        })

        const data = Array.from(monthMap.values()).map((monthData) => {
            return {
                month: Object.keys(monthData)[0],
                ...monthData,
            }
        })

        return data
    }, [categories])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expense</CardTitle>
                <CardDescription>Monthly Expense Data</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    {/*<BarChart accessibilityLayer data={chartData}>*/}
                    {/*    <XAxis*/}
                    {/*        dataKey="month"*/}
                    {/*        tickLine={false}*/}
                    {/*        tickMargin={10}*/}
                    {/*        axisLine={false}*/}
                    {/*        tickFormatter={(value) => value.slice(0, 3)}*/}
                    {/*    />*/}
                    {/*    <ChartTooltip*/}
                    {/*        cursor={false}*/}
                    {/*        content={<ChartTooltipContent indicator="dashed"/>}*/}
                    {/*    />*/}
                    {/*    {categories.map((category) => (*/}
                    {/*        <Bar*/}
                    {/*            key={category.name}*/}
                    {/*            dataKey={category.name}*/}
                    {/*            fill={category.color}*/}
                    {/*        />*/}
                    {/*    ))}*/}
                    {/*</BarChart>*/}

                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 32,
                            right: 12,
                        }}
                    >
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            yAxisId="expense"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={expenseFormatter}
                        />
                        <YAxis
                            yAxisId="income"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={expenseFormatter}
                            orientation="right"
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        {categories
                            .filter(c => expenseCategories.includes(c.name))
                            .map((category) => (
                            <Line
                                yAxisId="expense"
                                type="monotone"
                                key={category.name}
                                dataKey={category.name}
                                stroke={category.color}
                                strokeWidth={2}
                                dot={true}
                                style={{ filter: `drop-shadow(0 0 8px ${category.color})` }}
                            />
                        ))}
                        {categories
                            .filter(c => incomeCategories.includes(c.name))
                            .map((category) => (
                            <Line
                                yAxisId="income"
                                type="monotone"
                                key={category.name}
                                dataKey={category.name}
                                stroke={category.color}
                                strokeWidth={2}
                                dot={true}
                                style={{ filter: `drop-shadow(0 0 8px ${category.color})` }}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
