"use client";

import {useQuery} from "@apollo/client";
import {useAppSelector} from "@/state/hooks";
import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";
import PortfolioSelect from "@/app/(dashboard)/finance/investment/components/portfolio/PortfolioSelect";
import {GetCryptoPortfoliosQuery, GetCryptoPortfoliosQueryVariables} from "@/gql/graphql";
import {useCallback, useState} from "react";
import CreatePortfolioDialog from "@/app/(dashboard)/finance/investment/components/portfolio/CreatePortfolioDialog";
import CurrencySelect from "@/app/(dashboard)/finance/investment/components/currency-select/CurrencySelect";
import InvestmentSummary from "@/app/(dashboard)/finance/investment/components/investment-summary/InvestmentSummary";
import HistoricalBalanceChart
    from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/HistoricalBalanceChart";
import AssetList from "@/app/(dashboard)/finance/asset-price/components/assetList/AssetList";
import {GET_CRYPTO_PORTFOLIOS} from "@/api/crypto";
import {BalancePieChart} from "@/app/(dashboard)/finance/investment/components/balance-pie-chart/BalancePieChart";

interface IProps {
    portfolios: GetCryptoPortfoliosQuery["getCryptoPortfolios"];
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
                    <PortfolioSelect
                        profiles={portfolios}
                        selectedCryptoProfile={selectedCryptoPortfolio}
                        setSelectedCryptoProfile={setSelectedCryptoPortfolio}
                    />
                    <CreatePortfolioDialog refresh={refresh}/>
                    <div className="ml-auto">
                        <CurrencySelect/>
                    </div>
                </div>
                {selectedCryptoPortfolio && (
                    <div className="flex flex-col gap-4">
                        <InvestmentSummary
                            portfolio={selectedCryptoPortfolio}
                        />
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/*<div*/}
                            {/*    className="h-min flex items-center justify-center py-6 px-6 gap-1 rounded-lg border shadow-sm">*/}
                            <HistoricalBalanceChart
                                cryptoPortfolioId={selectedCryptoPortfolio.id}
                            />
                            <BalancePieChart balances={selectedCryptoPortfolio.balances}/>
                            {/*</div>*/}

                            {/*<ProportionalBalanceChart*/}
                            {/*    balances={selectedCryptoPortfolio.balances}*/}
                            {/*/>*/}
                        </div>
                        <AssetList portfolio={selectedCryptoPortfolio}/>
                    </div>
                )}
            </div>
        </ConvertCurrencyProvider>
    );
}

export default function InvestmentContainer() {
    const {user} = useAppSelector((state) => state.auth.state);
    const {data, loading, refetch} = useQuery<
        GetCryptoPortfoliosQuery,
        GetCryptoPortfoliosQueryVariables
    >(GET_CRYPTO_PORTFOLIOS, {
        variables: {data: {userId: Number(user?.id || 0)}, timeFrame: "1 day"},
    });

    const refresh = useCallback(() => {
        refetch().then(() => {
        });
    }, [refetch]);

    // TODO: Skeleton
    if (loading || !data || !data.getCryptoPortfolios) {
        return <div>Loading...</div>;
    }

    return (
        <InvestmentPage portfolios={data.getCryptoPortfolios} refresh={refresh}/>
    );
}
