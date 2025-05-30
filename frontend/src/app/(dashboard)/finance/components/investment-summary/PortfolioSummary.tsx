'use client';

import { SUBSCRIBE_HISTORICAL_BALANCE } from "@/api/crypto/crypto";
import { EXCHANGES_INFOS } from "@/app/(dashboard)/finance/investment/components/portfolio/ExchangeSelect";
import { MoneyAnimated } from "@/components/money/money-animated";
import { MoneyUpDownAnimated } from "@/components/money/money-up-down-animated";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCryptoPortfoliosQuery } from "@/gql/graphql";
import { getAbbreviatedTimeFrame } from "@/lib/utils/date-time/get-currency-month-date-range";
import { TimeframeEnum } from "@/lib/utils/date-time/timeframe.enum";
import { useSubscription } from "@apollo/client";
import { useMemo } from "react";

interface IProps {
    portfolio: GetCryptoPortfoliosQuery["getCryptoPortfolios"][number];
}

export default function PortfolioSummary({portfolio}: IProps) {
    const {data: newData, loading} = useSubscription(SUBSCRIBE_HISTORICAL_BALANCE, {
        variables: {
            data: {
                cryptoPortfolioIds: [portfolio.id],
                timeFrame: getAbbreviatedTimeFrame(TimeframeEnum.ONE_MINUTE)
            }
        },
    });

    const latestHistoricalBalances = useMemo(() => {
        if (!newData?.newHistoricalCryptoBalance || loading) {
            return portfolio.latestHistoricalBalances;
        }

        return {
            ...portfolio.latestHistoricalBalances,
            ...newData.newHistoricalCryptoBalance
        }
    }, [portfolio, newData, loading]);

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
