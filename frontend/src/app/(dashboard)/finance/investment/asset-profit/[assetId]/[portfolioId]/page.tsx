"use client";

import {Card, CardContent, CardDescription, CardHeader,} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import {ComposedChart, Line, ResponsiveContainer, XAxis, YAxis,} from "recharts";
import React, {Dispatch, SetStateAction, Suspense, useState,} from "react";
import {GetAssetQuery, GetTradesQuery} from "@/gql/graphql";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useAssetQuery} from "@/app/(dashboard)/finance/investment/asset-profit/[assetId]/[portfolioId]/useAssetQuery";
import {
    useChartFormatter
} from "@/app/(dashboard)/finance/investment/components/asset-profit-line-chart/useChartFormatter";
import {useChartConfig} from "@/app/(dashboard)/finance/investment/asset-profit/[assetId]/[portfolioId]/useChartConfig";
import {
    AssetProfitLineChart
} from "@/app/(dashboard)/finance/investment/components/asset-profit-line-chart/AssetProfitLineChart";
import {
    AssetPriceLineChart
} from "@/app/(dashboard)/finance/investment/components/asset-price-line-chart/AssetPriceLineChart";
import {Separator} from "@/components/ui/separator";
import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";
import {TimeframeEnum} from "@/lib/utils/date-time/timeframe.enum";
import {useTradeQuery} from "@/app/(dashboard)/finance/investment/asset-profit/[assetId]/[portfolioId]/useTradeQuery";
import TradeTable from "@/app/(dashboard)/finance/investment/components/trade-table/TradeTable";

interface IProps {
    priceData: GetAssetQuery["getAssetPrices"];
    profitData: GetAssetQuery["getHistoricalAssetProfits"];
    trades: GetTradesQuery["getTrades"];
    assetInfo: GetAssetQuery["getAssetInfo"];
    setTimeFrame: Dispatch<SetStateAction<TimeframeEnum>>;
    timeFrame: string;
}

const IntervalOptions = [
    {
        label: "1 Minute",
        value: TimeframeEnum.ONE_MINUTE,
    },
    {
        label: "5 Minutes",
        value: TimeframeEnum.FIVE_MINUTES,
    },
    {
        label: "1 Hour",
        value: TimeframeEnum.ONE_HOUR,
    },
    {
        label: "1 Day",
        value: TimeframeEnum.ONE_DAY,
    },
    {
        label: "1 Month",
        value: TimeframeEnum.ONE_MONTH,
    },
];

function AssetPricePage({
                            profitData,
                            priceData,
                            trades,
                            assetInfo,
                            setTimeFrame,
                            timeFrame,
                        }: IProps) {


    return (
        <div className="flex flex-col gap-4">
            <Card className="">
                <CardHeader className="flex flex-row justify-between items-center gap-2">
                    {/*<CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">{info.symbol}</CardTitle>*/}
                    {/*<CardDescription>{info.name}</CardDescription>*/}
                    <Avatar className="h-10 w-10 rounded-lg">
                        <AvatarImage src={assetInfo.logo} alt={assetInfo.name}/>
                        <AvatarFallback className="rounded-lg">
                            {assetInfo.name}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left leading-tight">
                        <p className="truncate text-2xl font-bold">
                            {assetInfo.symbol}
                        </p>
                        <CardDescription>{assetInfo.name}</CardDescription>
                    </div>
                    <Select onValueChange={(v) => setTimeFrame(v as TimeframeEnum)} defaultValue={timeFrame}>
                        <SelectTrigger className="w-[20rem]">
                            <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                            {IntervalOptions.map((i) => (
                                <SelectItem key={i.label} value={i.value}>
                                    {i.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="p-0 h-3/4">
                    <div className="flex">
                        <div className="flex-1">
                            <p className="p-8 text-xl font-bold">Estimated Profit</p>
                            <AssetProfitLineChart profitData={profitData}/>
                        </div>
                        <div className="flex-1">
                            <p className="p-8 text-xl font-bold">Historical Price</p>
                            <Suspense fallback={<div>Price Loading...</div>}>
                                <AssetPriceLineChart priceData={priceData} trades={trades}/>
                            </Suspense>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <TradeTable trades={trades}/>
        </div>
    );
}

export type AssetProfitPageParams = { portfolioId: string; assetId: string };

export default function AssetProfitContainer({
                                                 params,
                                             }: {
    params: { portfolioId: string, assetId: string };
}) {
    const [timeFrame, setTimeFrame] = useState(TimeframeEnum.ONE_DAY);
    const {priceData, profitData, assetInfo, loading} = useAssetQuery(params, timeFrame);
    const trades = useTradeQuery(params.portfolioId, params.assetId);

    if (loading || !assetInfo) {
        return <div>Loading...</div>;
    }

    return (
        <ConvertCurrencyProvider baseCurrency="USD" toCurrency="USD">
            <AssetPricePage
                priceData={priceData}
                profitData={profitData}
                trades={trades}
                assetInfo={assetInfo}
                timeFrame={timeFrame}
                setTimeFrame={setTimeFrame}
            />
        </ConvertCurrencyProvider>
    );
}
