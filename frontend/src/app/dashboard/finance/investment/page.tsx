"use client";

import {useQuery} from "@apollo/client";
import {useAppSelector} from "@/state/hooks";
import InvestmentSummary from "@/app/dashboard/finance/components/summary/InvestmentSummary";
import AssetList from "@/app/dashboard/finance/components/assetList/AssetList";
import {GetCryptoPortfolioQuery, QueryGetCryptoPortfoliosArgs,} from "@/gql/graphql";
import {GET_CRYPTO_PORTFOLIOS} from "@/api/crypto";
import React, {useCallback, useState} from "react";
import HistoricalBalanceChart from "../components/historicalBalanceChart";
import ProfileSelector from "@/app/dashboard/finance/components/profileSelector";
import ProfileCreator from "@/app/dashboard/finance/components/profileCreator";
import BalanceConverter from "@/app/dashboard/finance/components/balanceConverter";
import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";

interface IProps {
    portfolios: GetCryptoPortfolioQuery["getCryptoPortfolios"];
    refresh: () => void;
}

function InvestmentPage({portfolios, refresh}: IProps) {
    const [selectedCryptoPortfolio, setSelectedCryptoPortfolio] = useState(
        portfolios?.[0],
    );

    return (
        <ConvertCurrencyProvider baseCurrency="USD">
            <div className="flex flex-1 flex-col gap-4">
                <div className="flex gap-4">
                    <ProfileSelector
                        profiles={portfolios}
                        selectedCryptoProfile={selectedCryptoPortfolio}
                        setSelectedCryptoProfile={setSelectedCryptoPortfolio}
                    />
                    <ProfileCreator refresh={refresh}/>
                    <div className="ml-auto">
                        <BalanceConverter/>
                    </div>
                </div>
                {selectedCryptoPortfolio && (
                    <div className="flex gap-4">
                        <div className="flex flex-1 flex-col gap-4">
                            <div
                                className="h-min flex items-center justify-center py-6 px-6 gap-1 rounded-lg border shadow-sm">
                                <InvestmentSummary
                                    profile={selectedCryptoPortfolio}
                                />
                            </div>
                            <HistoricalBalanceChart
                                historicalData={
                                    selectedCryptoPortfolio?.historicalBalances
                                }
                            />
                            {/*<ProportionalBalanceChart*/}
                            {/*    balances={selectedCryptoPortfolio.balances}*/}
                            {/*/>*/}

                        </div>
                        <div className="flex-1 flex gap-2">
                            <AssetList portfolio={selectedCryptoPortfolio}/>
                        </div>
                    </div>
                )}
            </div>
        </ConvertCurrencyProvider>
    );
}

export default function InvestmentContainer() {
    const {user} = useAppSelector((state) => state.auth.state);
    const {data, loading, refetch} = useQuery<
        GetCryptoPortfolioQuery,
        QueryGetCryptoPortfoliosArgs
    >(GET_CRYPTO_PORTFOLIOS, {
        variables: {data: {userId: Number(user?.id)}},
    });

    const refresh = useCallback(() => {
        refetch().then(() => {});
    }, [refetch]);

    // TODO: Skeleton
    if (loading || !data || !data.getCryptoPortfolios) {
        return <div>Loading...</div>;
    }

    return (
        <InvestmentPage portfolios={data.getCryptoPortfolios} refresh={refresh}/>
    );
}
