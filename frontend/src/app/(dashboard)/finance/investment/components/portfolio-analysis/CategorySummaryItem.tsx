import {MoneyUpDownAnimated} from "@/components/money/money-up-down-animated";
import {
    getSubscriptNewHistoricalProfitHook,
    getSubscriptNewHistoricalProfitResult
} from "@/api/script/crypto/asset-profit";
import {TimeframeEnum} from "@/lib/utils/date-time/timeframe.enum";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/state/hooks";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import {cn} from "@/lib/utils";
import {MoneyAnimated} from "@/components/money/money-animated";
import {AnalyseData} from "@/app/(dashboard)/finance/investment/components/portfolio-analysis/PortfolioAnalysis";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


interface IProps {
    cryptoPortfolioId: string;
    data: AnalyseData;
    totalInvest: number;
}

export function CategorySummaryItem({data, totalInvest, cryptoPortfolioId}: IProps) {
    const {hook, query} = getSubscriptNewHistoricalProfitHook(TimeframeEnum.ONE_MINUTE);
    const {data: newData} = hook(query, {
        variables: {
            data: {
                cryptoPortfolioId,
                assetInfoId: data.assetId,
                timeFrame: TimeframeEnum.ONE_MINUTE
            }
        },
    });
    const newHistoricalProfit = getSubscriptNewHistoricalProfitResult(newData);
    const [aggregatedData, setAggregatedData] = useState<AnalyseData>(data);

    useEffect(() => {
        if (!newHistoricalProfit) {
            return;
        }

        const newAggregatedData = {
            ...data,
            invest: newHistoricalProfit.totalCostInQuoteQty,
            remainingQty: newHistoricalProfit.remainingQty,
            estimatedProfit: newHistoricalProfit.estimatedProfit,
            profitPercent: newHistoricalProfit.estimatedProfit / newHistoricalProfit.totalCostInQuoteQty * 100,
        }

        setAggregatedData(newAggregatedData);
    }, [data, newHistoricalProfit]);

    return (
        <div>
            <Tooltip delayDuration={0}>
                <TooltipTrigger className="text-start">
                    <div className="flex items-center gap-2">
                        <Avatar className="size-4">
                            <AvatarImage src={aggregatedData.exchangeLogo}/>
                            <AvatarFallback>{aggregatedData.name}</AvatarFallback>
                        </Avatar>
                        <div className="size-3 rounded-sm"
                             style={{backgroundColor: aggregatedData.fill}}/>
                        <div className="flex gap-1 items-center">
                            <p className="text-muted-foreground text-xs">{aggregatedData.name}</p>
                            <MoneyAnimated className="text-muted-foreground text-sm" number={aggregatedData.invest}/>
                            <MoneyAnimated className="text-muted-foreground text-sm" number={aggregatedData.invest / totalInvest * 100} isPercent/>

                            <MoneyUpDownAnimated className="text-sm" number={aggregatedData.estimatedProfit}/>
                            <MoneyUpDownAnimated className="text-sm" number={aggregatedData.profitPercent} isPercent/>
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