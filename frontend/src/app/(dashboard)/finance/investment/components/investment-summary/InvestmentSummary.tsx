'use client';

import {cn} from "@/lib/utils";
import {GetCryptoPortfoliosQuery} from "@/gql/graphql";
import MoneyWithCurrency from "@/components/ui/money-with-currency";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {TotalPnl} from "@/app/(dashboard)/finance/investment/components/investment-summary/TotalPnl";

interface IProps {
    portfolio: GetCryptoPortfoliosQuery["getCryptoPortfolios"][number];
}

export default function InvestmentSummary({portfolio}: IProps) {

    const {latestHistoricalBalances, balances, investmentCategoryName} = portfolio;

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-0">
                <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">
                    Estimated Balance
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-nowrap">
                <div>
                    <div className="flex flex-row gap-4 items-center">
                        <p className="text-3xl font-bold">
                            <MoneyWithCurrency amount={latestHistoricalBalances.estimatedBalance}/>
                        </p>
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
                <p className="text-sm text-muted-foreground">
                    Today&#39;s PnL
                    <span
                        className={cn("font-bold ml-2", latestHistoricalBalances.changeBalance > 0 ? "text-chart-2" : "text-chart-5")}>
                        {latestHistoricalBalances.changeBalance > 0 ? "+" : ""}
                        <MoneyWithCurrency amount={latestHistoricalBalances.changeBalance}/>
                        &nbsp;({latestHistoricalBalances.changePercent.toFixed(2)}%)
                    </span>
                </p>
            </CardContent>
        </Card>
    );
}
