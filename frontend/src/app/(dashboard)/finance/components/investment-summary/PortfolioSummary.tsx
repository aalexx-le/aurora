'use client';

import {cn} from "@/lib/utils";
import {GetCryptoPortfoliosQuery} from "@/gql/graphql";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {TotalPnl} from "@/app/(dashboard)/finance/components/investment-summary/TotalPnl";
import {getSubscriptNewHistoricalBalanceHook, getSubscriptNewHistoricalBalanceResult} from "@/api/script/crypto/crypto";
import React, {useEffect, useMemo} from "react";
import {TimeframeEnum} from "@/lib/utils/date-time/timeframe.enum";
import {getAbbreviatedTimeFrame} from "@/lib/utils/date-time/get-currency-month-date-range";
import {MoneyAnimated} from "@/components/money/money-animated";
import {MoneyUpDownAnimated} from "@/components/money/money-up-down-animated";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {EXCHANGES_INFOS} from "@/app/(dashboard)/finance/investment/components/portfolio/ExchangeSelect";

interface IProps {
    portfolio: GetCryptoPortfoliosQuery["getCryptoPortfolios"][number];
}

export default function PortfolioSummary({portfolio}: IProps) {
    const {hook, query} = getSubscriptNewHistoricalBalanceHook(TimeframeEnum.ONE_MINUTE);
    const {data: newData, loading} = hook(query, {
        variables: {
            data: {
                cryptoPortfolioIds: [portfolio.id],
                timeFrame: getAbbreviatedTimeFrame(TimeframeEnum.ONE_MINUTE)
            }
        },
    });
    const newBalance = getSubscriptNewHistoricalBalanceResult(newData);

    const latestHistoricalBalances = useMemo(() => {
        return newBalance
            ? {...portfolio.latestHistoricalBalances, estimatedBalance: newBalance.estimatedBalance}
            : portfolio.latestHistoricalBalances
    }, [portfolio, newBalance]);

    const selectedExchanges = EXCHANGES_INFOS.find((e) => e.id === portfolio.exchanges);

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">
                    {selectedExchanges && <div className="flex flex-row gap-2 items-center">
                        <Avatar className="h-4 w-4 rounded-lg">
                            <AvatarImage src={selectedExchanges.logo} alt={selectedExchanges.name}/>
                            <AvatarFallback className="rounded-lg">
                                {selectedExchanges.name}
                            </AvatarFallback>
                        </Avatar>
                        {selectedExchanges.name}
                    </div>}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-nowrap">
                <div>
                    <div className="flex flex-row gap-4 items-center">
                        <MoneyAnimated className="font-mono p-1 text-3xl"
                                       number={latestHistoricalBalances.estimatedBalance}/>

                        {/*<TotalPnl currentBalance={latestHistoricalBalances.estimatedBalance}*/}
                        {/*          investmentCategoryName={investmentCategoryName}/>*/}
                    </div>
                    <p className="text-sm font-bold text-muted-foreground">
                        <span>&#8776; </span>
                        {latestHistoricalBalances.estimatedBalance.toFixed(2)}
                        <span className="text-xs font-medium ml-2">
                            USDT
                        </span>
                    </p>
                </div>
                <div className="flex flex-row items-center gap-2 text-sm">
                    <p className="text-muted-foreground">
                        Today&#39;s PnL
                    </p>
                    <div className="flex items-center gap-1">
                        <MoneyUpDownAnimated number={latestHistoricalBalances.changeBalance}/>
                        <MoneyUpDownAnimated number={latestHistoricalBalances.changePercent} isPercent/>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
