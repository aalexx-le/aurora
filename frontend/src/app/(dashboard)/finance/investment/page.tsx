"use client";

import {useQuery} from "@apollo/client";
import {useAppDispatch, useAppSelector} from "@/state/hooks";
import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";
import PortfolioSelect from "@/app/(dashboard)/finance/investment/components/portfolio/PortfolioSelect";
import {GetCryptoPortfoliosQuery, GetCryptoPortfoliosQueryVariables} from "@/gql/graphql";
import {useCallback, useEffect, useState} from "react";
import CreatePortfolioDialog from "@/app/(dashboard)/finance/investment/components/portfolio/CreatePortfolioDialog";
import CurrencySelect from "@/app/(dashboard)/finance/investment/components/currency-select/CurrencySelect";
import PortfolioSummary from "@/app/(dashboard)/finance/components/investment-summary/PortfolioSummary";
import HistoricalBalanceChart
    from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/HistoricalBalanceChart";
import AssetTable from "@/app/(dashboard)/finance/investment/components/asset-table/AssetTable";
import {GET_CRYPTO_PORTFOLIOS} from "@/api/script/crypto/crypto";
import {BalancePieChart} from "@/app/(dashboard)/finance/investment/components/balance-pie-chart/BalancePieChart";
import {getSubscriptNewHistoricalProfitHook} from "@/api/script/crypto/asset-profit";
import {TimeframeEnum} from "@/lib/utils/date-time/timeframe.enum";
import {PortfolioAnalysis} from "@/app/(dashboard)/finance/investment/components/portfolio-analysis/PortfolioAnalysis";
import InvestmentSummary from "@/app/(dashboard)/finance/components/investment-summary/InvestmentSummary";
import {cryptoActions} from "@/state/slices/crypto.slice";
import client from "@/api";
import {useCryptoPortfoliosQuery} from "@/app/(dashboard)/finance/investment/useCryptoPortfoliosQuery";
import {CreateExecutionSteps} from "@/app/(dashboard)/finance/investment/components/portfolio/CreateExecutionSteps";

interface IProps {
    portfolios: GetCryptoPortfoliosQuery["getCryptoPortfolios"];
}

function InvestmentPage({portfolios}: IProps) {
    const {portfolio} = useAppSelector((state) => state.crypto.state);

    // const {data, loading, refetch} = useQuery<
    //     GetCryptoPortfoliosQuery,
    //     GetCryptoPortfoliosQueryVariables
    // >(GET_CRYPTO_PORTFOLIOS, {
    //     variables: {data: {userId: Number(user?.id || 0)}, timeFrame: "1 day"},
    // });
    // const portfolios = data?.getCryptoPortfolios || [];

    return (
        <ConvertCurrencyProvider baseCurrency="USD">
            <div className="flex flex-1 flex-col gap-4">
                <div className="flex gap-4">
                    <PortfolioSelect
                        portfolios={portfolios}
                    />

                    <CreatePortfolioDialog/>
                    <div className="ml-auto">
                        <CurrencySelect/>
                    </div>
                </div>

                <CreateExecutionSteps />

                {portfolio && <div className="flex flex-col gap-4">
                    <div className="col-span-2">
                        <PortfolioSummary portfolio={portfolio}/>
                    </div>
                    <div className="flex gap-4">
                        {/*<div className="col-span-2">*/}
                        {/*    <InvestmentSummary*/}
                        {/*        portfolios={portfolios}*/}
                        {/*    />*/}
                        {/*</div>*/}

                        <HistoricalBalanceChart cryptoPortfolioId={portfolio.id}/>

                        <PortfolioAnalysis
                            cryptoPortfolioId={portfolio.id}
                            assetProfits={portfolio.latestAssetProfits}
                            balances={portfolio.balances}
                        />

                        {/*{portfolios.map((p) => (*/}
                        {/*    <div className="col-span-1" key={p.id + "summary"}>*/}
                        {/*        <PortfolioSummary*/}
                        {/*            // setPortfolio={updatePortfolio}*/}
                        {/*            portfolio={p}*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*))}*/}
                        {/*{portfolios.map((p) => (*/}
                        {/*    <div className="col-span-1" key={p.id + "balance-chart"}>*/}
                        {/*        <HistoricalBalanceChart*/}
                        {/*            cryptoPortfolioId={p.id}*/}
                        {/*        />*/}
                        {/*    </div>*/}
                        {/*))}*/}

                        {/*{portfolios.map((p) => (*/}
                        {/*    <PortfolioAnalysis*/}
                        {/*        key={p.id + "analysis"}*/}
                        {/*        cryptoPortfolioId={p.id}*/}
                        {/*        assetProfits={p.latestAssetProfits}*/}
                        {/*        balances={p.balances}*/}
                        {/*    />*/}
                        {/*))}*/}
                    </div>
                    <AssetTable portfolios={[portfolio]}/>
                </div>}
            </div>
        </ConvertCurrencyProvider>
    );
}

export default function InvestmentContainer() {
    const {portfolios, loading} = useCryptoPortfoliosQuery()

    // TODO: Skeleton
    if (loading || !portfolios) {
        return <div>Loading...</div>;
    }

    return (
        <InvestmentPage portfolios={portfolios}/>
    );
}
