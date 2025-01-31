'use client';

import {cn} from "@/lib/utils";
import {GetCryptoPortfoliosQuery} from "@/gql/graphql";
import MoneyWithCurrency from "@/components/money/money-with-currency";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {TotalPnl} from "@/app/(dashboard)/finance/components/investment-summary/TotalPnl";
import {getSubscriptNewHistoricalBalanceHook, getSubscriptNewHistoricalBalanceResult} from "@/api/script/crypto/crypto";
import {useEffect, useMemo, useState} from "react";
import {TimeframeEnum} from "@/lib/utils/date-time/timeframe.enum";
import {getAbbreviatedTimeFrame} from "@/lib/utils/date-time/get-currency-month-date-range";
import {MoneyAnimated} from "@/components/money/money-animated";
import {MoneyUpDownAnimated} from "@/components/money/money-up-down-animated";
import {useAppSelector} from "@/state/hooks";
import {Skeleton} from "@/components/ui/skeleton";
import {CryptoPortfolio} from "@/app/(dashboard)/finance/investment/types";

interface IProps {
    portfolio: CryptoPortfolio;
}

export default function InvestmentSummary({portfolio}: IProps) {
    const investmentCategoryName = portfolio.investmentCategoryName;
    const { latestHistoricalBalances } = portfolio

    // const {hook, query} = getSubscriptNewHistoricalBalanceHook(TimeframeEnum.ONE_MINUTE);
    // const {data: newData, loading} = hook(query, {
    //     variables: {
    //         data: {
    //             cryptoPortfolioIds: portfolios.map((portfolio) => portfolio.id),
    //             timeFrame: getAbbreviatedTimeFrame(TimeframeEnum.ONE_MINUTE)
    //         }
    //     },
    // });
    // const newBalance = getSubscriptNewHistoricalBalanceResult(newData);
    //
    // const [localPortfolios, setLocalPortfolios] = useState(portfolios);
    //
    // useEffect(() => {
    //     const newPortfolios = portfolios.map((portfolio) => {
    //         if (newBalance && newBalance.cryptoPortfolioId === portfolio.id) {
    //             return {
    //                 ...portfolio,
    //                 latestHistoricalBalances: {
    //                     ...portfolio.latestHistoricalBalances,
    //                     estimatedBalance: newBalance.estimatedBalance
    //                 }
    //             }
    //         }
    //
    //         return portfolio;
    //     })
    //
    //     setLocalPortfolios(newPortfolios);
    // }, [portfolios, newBalance]);
    // const latestHistoricalBalances = useMemo(() => {
    //     return portfolios.reduce((acc, portfolio) => {
    //         return {
    //             changeBalance: acc.changeBalance + portfolio.latestHistoricalBalances.changeBalance,
    //             changePercent: acc.changePercent + portfolio.latestHistoricalBalances.changePercent,
    //             estimatedBalance: acc.estimatedBalance + portfolio.latestHistoricalBalances.estimatedBalance
    //         }
    //     }, {changeBalance: 0, changePercent: 0, estimatedBalance: 0})
    // }, [portfolios]);

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">
                    Investment Balance
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-nowrap">
                <div>
                    <div className="flex flex-row gap-4 items-center">
                        {/*<p className="text-3xl font-bold">*/}
                        {/*    <MoneyWithCurrency amount={latestHistoricalBalances.estimatedBalance}/>*/}
                        {/*</p>*/}
                        <MoneyAnimated className="font-mono p-1 text-3xl" number={latestHistoricalBalances.estimatedBalance}/>

                        <TotalPnl currentBalance={latestHistoricalBalances.estimatedBalance}
                                  investmentCategoryName={investmentCategoryName}/>
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
                    {/*<span*/}
                    {/*    className={cn("font-bold ml-2", latestHistoricalBalances.changeBalance > 0 ? "text-chart-2" : "text-chart-5")}>*/}
                    {/*    {latestHistoricalBalances.changeBalance > 0 ? "+" : ""}*/}
                    {/*    <MoneyWithCurrency amount={latestHistoricalBalances.changeBalance}/>*/}
                    {/*    &nbsp;({latestHistoricalBalances.changePercent.toFixed(2)}%)*/}
                    {/*</span>*/}
                    <div className="flex items-center gap-1">
                        <MoneyUpDownAnimated number={latestHistoricalBalances.changeBalance}/>
                        <MoneyUpDownAnimated number={latestHistoricalBalances.changePercent} isPercent/>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
