import {
    SUBSCRIBE_HISTORICAL_ASSET_PROFIT
} from "@/api/crypto/asset-profit";
import { MoneyAnimated } from "@/components/money/money-animated";
import { MoneyUpDownAnimated } from "@/components/money/money-up-down-animated";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CexExchanges } from "@/gql/graphql";
import { cn } from "@/lib/utils";
import { TimeframeEnum } from "@/lib/utils/date-time/timeframe.enum";
import { useSubscription } from "@apollo/client";
import { useEffect, useState } from "react";
import { type PortfolioAnalyseData } from "../../types";


interface IProps {
    cryptoPortfolioId: string;
    data: PortfolioAnalyseData;
    totalInvest: number;
}

export function CategorySummaryItem({data, totalInvest, cryptoPortfolioId}: IProps) {
    const {data: newData, loading} = useSubscription(SUBSCRIBE_HISTORICAL_ASSET_PROFIT, {
        variables: {
            data: {
                cryptoPortfolioId,
                assetInfoId: data.assetId,
                timeFrame: TimeframeEnum.ONE_MINUTE
            }
        },
    });
    const [aggregatedData, setAggregatedData] = useState<PortfolioAnalyseData>(data);
    const shouldShowProfitPercent = !isNaN(aggregatedData.profitPercent) && aggregatedData.profitPercent !== 0;

    useEffect(() => {
        if (!newData?.newHistoricalAssetProfit || loading) {
            return;
        }

        const newHistoricalProfit = newData.newHistoricalAssetProfit;

        const newAggregatedData = {
            ...data,
            invest: newHistoricalProfit.totalCostInQuoteQty,
            remainingQty: newHistoricalProfit.remainingQty,
            estimatedProfit: newHistoricalProfit.estimatedProfit,
            profitPercent: newHistoricalProfit.estimatedProfit / newHistoricalProfit.totalCostInQuoteQty * 100,
        }

        setAggregatedData(newAggregatedData);
    }, [data, newData, loading]);

    return (
        <div>
            <Tooltip delayDuration={0}>
                <TooltipTrigger className="text-start">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                            {aggregatedData.exchange !== CexExchanges.All && <Avatar className="size-4">
                                <AvatarImage src={aggregatedData.exchangeLogo}/>
                                <AvatarFallback>{aggregatedData.name}</AvatarFallback>
                            </Avatar>}
                            <div className="size-3 rounded-sm"
                                style={{backgroundColor: aggregatedData.fill}}/>
                            <div className="flex gap-1 items-center">
                                <p className="text-muted-foreground text-xs">{aggregatedData.name}</p>
                                <MoneyAnimated className="text-muted-foreground text-xs" number={aggregatedData.invest}/>
                                <MoneyAnimated className="text-muted-foreground text-xs" number={aggregatedData.invest / totalInvest * 100} isPercent/>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <MoneyUpDownAnimated className="text-sm" number={aggregatedData.estimatedProfit}/>
                            {shouldShowProfitPercent && (
                                <MoneyUpDownAnimated className="text-sm" number={aggregatedData.profitPercent} isPercent/>
                            )}
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="flex items-center gap-2 text-xs font-bold">
                        <MoneyWithCurrency amount={aggregatedData.price}/>
                        <p>x</p>
                        <p>{aggregatedData.remainingQty.toFixed(2)}</p>
                        <p>-</p>
                        <MoneyWithCurrency amount={aggregatedData.invest}/>
                        <p>=</p>
                        <span
                            className={cn("font-bold text-sm", aggregatedData.estimatedProfit > 0 ? "text-chart-2" : "text-chart-5")}>
                                                {aggregatedData.estimatedProfit > 0 ? "+" : ""}
                            <MoneyWithCurrency amount={aggregatedData.estimatedProfit}/>
                        </span>
                    </div>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}