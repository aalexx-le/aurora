"use client"

import {Pie, PieChart} from "recharts"
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {ExpenseCategory} from "@/app/(dashboard)/finance/components/category-list/types";

const chartData = [
    {browser: "chrome", visitors: 275, fill: "var(--color-chrome)"},
    {browser: "safari", visitors: 200, fill: "var(--color-safari)"},
    {browser: "firefox", visitors: 187, fill: "var(--color-firefox)"},
    {browser: "edge", visitors: 173, fill: "var(--color-edge)"},
    {browser: "other", visitors: 90, fill: "var(--color-other)"},
]

interface IProps {
    categories: ExpenseCategory[]
}


export default function CategoryPieChart({categories}: IProps) {
    const chartData = categories?.map((category, index) => ({
        label: category.name + "  ",
        amount: Math.abs(category.totalAmount),
        fill: category.color,
    })) ?? []

    if (!categories) {
        return null
    }

    return (
        <ChartContainer
            config={{}}
            className="mx-auto aspect-square max-h-[250px]"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent nameKey="label"/>}
                />
                <Pie
                    data={chartData}
                    dataKey="amount"
                    nameKey="label"
                    innerRadius={50}
                    outerRadius={80}
                    startAngle={180}
                    endAngle={-180}
                    // strokeWidth={5}
                    // activeIndex={0}
                    // paddingAngle={2}
                    labelLine={false}
                    cx="50%"
                    cy="50%"
                    fill="fill"
                    // activeShape={({
                    //                   outerRadius = 0,
                    //                   ...props
                    //               }: PieSectorDataItem) => (
                    //     <Sector {...props} outerRadius={outerRadius + 5} />
                    // )}
                />
            </PieChart>
        </ChartContainer>
    )
}
