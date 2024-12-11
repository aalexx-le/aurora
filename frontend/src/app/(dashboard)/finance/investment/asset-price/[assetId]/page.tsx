"use client";

import {Card, CardContent, CardDescription, CardHeader,} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import {ComposedChart, Line, ResponsiveContainer, XAxis, YAxis,} from "recharts";
import React, {Dispatch, SetStateAction, useState,} from "react";
import {GetAssetQuery} from "@/gql/graphql";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {useChartConfig} from "@/app/(dashboard)/finance/investment/components/asset-price-line-chart/useChartConfig";
import {useChartFormatter} from "@/app/(dashboard)/finance/investment/components/asset-price-line-chart/useChartFormatter";
import {useAssetPrice} from "@/app/(dashboard)/finance/investment/asset-price/[assetId]/useAssetPrice";

interface IProps {
    historicalPrice: GetAssetQuery["getAssetPrices"];
    assetInfo: GetAssetQuery["getAssetInfo"];
    setTimeFrame: Dispatch<SetStateAction<string>>;
    timeFrame: string;
}

const IntervalOptions = [
    {
        label: "1 Minute",
        value: "1 min",
    },
    {
        label: "5 Minute",
        value: "5 min",
    },
    {
        label: "1 Hour",
        value: "1 hour",
    },
    {
        label: "1 Day",
        value: "1 day",
    },
    {
        label: "1 Month",
        value: "1 month",
    },
];

function AssetPricePage({
    historicalPrice,
    assetInfo,
    setTimeFrame,
    timeFrame,
}: IProps) {


    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row justify-between items-center gap-2">
                {/*<CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">{info.symbol}</CardTitle>*/}
                {/*<CardDescription>{info.name}</CardDescription>*/}
                <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={assetInfo.logo} alt={assetInfo.name} />
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
                <Select onValueChange={setTimeFrame} defaultValue={timeFrame}>
                    <SelectTrigger className="w-[20rem]">
                        <SelectValue />
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

            </CardContent>
        </Card>
    );
}

export default function AssetPriceContainer({
    params,
}: {
    params: { assetId: string };
}) {
    const assetInfoId = params.assetId;

    const [timeFrame, setTimeFrame] = useState("1 day");
    const { data, assetInfo, loading } = useAssetPrice(assetInfoId, timeFrame);

    if (loading || !data || !assetInfo) {
        return <div>Loading...</div>;
    }

    return (
        <AssetPricePage
            historicalPrice={data}
            assetInfo={assetInfo}
            timeFrame={timeFrame}
            setTimeFrame={setTimeFrame}
        />
    );
}
