'use client';

import {cn} from "@/lib/utils";
import {GetCryptoPortfolioQuery} from "@/gql/graphql";
import MoneyWithCurrency from "@/components/ui/money-with-currency";

interface IProps {
    profile: GetCryptoPortfolioQuery["getCryptoPortfolios"][number];
}

export default function InvestmentSummary({profile}: IProps) {
    const {historicalBalances} = profile;
    const latestHistory = historicalBalances[historicalBalances.length - 1];

    return (
        <div className="flex flex-col flex-1 gap-2">
            <h2 className="text-xl font-bold text-muted-foreground tracking-wide">
                Estimated Balance
            </h2>
            <div>
                <p className="text-3xl font-bold flex items-center gap-4">
                    <MoneyWithCurrency amount={latestHistory.estimatedBalance} />
                </p>
                <p className="text-sm font-bold text-muted-foreground">
                    <span>&#8776; </span>
                    {latestHistory.estimatedBalance.toFixed(2)}
                    <span className="text-xs font-medium ml-2">
                    USDT
                </span>
                </p>
            </div>
            <p className="text-sm text-muted-foreground">
                Today&#39;s PnL
                <span
                    className={cn("font-bold ml-2", latestHistory.changeBalance > 0 ? "text-chart-2" : "text-chart-5")}>
                    {latestHistory.changeBalance > 0 ? "+" : ""}<MoneyWithCurrency amount={latestHistory.changeBalance} />
                    ({latestHistory.changePercent.toFixed(2)}%)
                </span>
            </p>
        </div>
    );
}
