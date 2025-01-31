import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import {ComposedChart, Label, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis} from "recharts";
import React, {useMemo} from "react";
import {
    useChartFormatter
} from "@/app/(dashboard)/finance/investment/components/asset-price-line-chart/useChartFormatter";
import {useChartConfig} from "@/app/(dashboard)/finance/investment/components/asset-price-line-chart/useChartConfig";
import {AssetPrice, Trade} from "@/app/(dashboard)/finance/investment/types";
import ReactApexChart from 'react-apexcharts'
import {ApexOptions} from 'apexcharts'
import moment from "moment/moment";

interface IProps {
    priceData: AssetPrice[]
    trades: Trade[]
}

export function AssetPriceLineChart({priceData, trades}: IProps) {
    const chartConfig = useChartConfig(priceData, trades);

    const data = useMemo<ApexAxisChartSeries>(() => {
        return [{
            name: 'candle',
            data: priceData.map((price) => {
                return {
                    x: price.open_time,
                    y: price.openPrice
                }
            })
        }]
    }, [priceData]);

    return (
        <ReactApexChart options={chartConfig} series={data}/>
    )
}