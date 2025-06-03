"use client";

import {
    AssetTableSkeleton,
    BalanceChartSkeleton,
    InvestmentPageSkeleton,
    PortfolioAnalysisSkeleton,
    PortfolioHeaderSkeleton,
    PortfolioSkeleton
} from "@/app/(dashboard)/finance/investment/components/skeletons";
import { useCryptoPortfoliosQuery } from "@/app/(dashboard)/finance/investment/hooks/useCryptoPortfoliosQuery";
import { GetCryptoPortfoliosQuery } from "@/gql/graphql";
import { ConvertCurrencyProvider } from "@/lib/context/convert-currency.context";
import { useAppSelector } from "@/state/hooks";
import { Suspense } from "react";

import PortfolioSummary from "@/app/(dashboard)/finance/components/investment-summary/PortfolioSummary";
import AssetTable from "@/app/(dashboard)/finance/investment/components/asset-table/AssetTable";
import CurrencySelect from "@/app/(dashboard)/finance/investment/components/currency-select/CurrencySelect";
import HistoricalBalanceChart from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/HistoricalBalanceChart";
import PortfolioAnalysisWithLock from "@/app/(dashboard)/finance/investment/components/portfolio-analysis/PortfolioAnalysisWithLock";
import { CreateExecutionSteps } from "@/app/(dashboard)/finance/investment/components/portfolio/CreateExecutionSteps";
import CreatePortfolioDialogWithLock from "@/app/(dashboard)/finance/investment/components/portfolio/CreatePortfolioDialogWithLock";
import PortfolioSelect from "@/app/(dashboard)/finance/investment/components/portfolio/PortfolioSelect";

interface IProps {
    portfolios: GetCryptoPortfoliosQuery["getCryptoPortfolios"];
}

function InvestmentPage({portfolios}: IProps) {
    const {portfolio} = useAppSelector((state) => state.crypto.state);

    return (
        <ConvertCurrencyProvider baseCurrency="USD">
            <div className="flex flex-1 flex-col gap-4">
                <div className="flex gap-4">
                    <Suspense fallback={<PortfolioHeaderSkeleton />}>
                        <PortfolioSelect portfolios={portfolios} />
                        <CreatePortfolioDialogWithLock/>
                        <div className="ml-auto">
                            <CurrencySelect/>
                        </div>
                    </Suspense>
                </div>

                <Suspense fallback={<div className="h-10"></div>}>
                    <CreateExecutionSteps />
                </Suspense>

                {portfolio && <div className="flex flex-col gap-4">
                    <Suspense fallback={<PortfolioSkeleton />}>
                        <PortfolioSummary portfolio={portfolio}/>
                    </Suspense>
                    <div className="flex flex-col lg:flex-row gap-4">
                        <Suspense fallback={<BalanceChartSkeleton />}>
                            <HistoricalBalanceChart cryptoPortfolioId={portfolio.id}/>
                        </Suspense>

                        <Suspense fallback={<PortfolioAnalysisSkeleton />}>
                            <PortfolioAnalysisWithLock
                                cryptoPortfolioId={portfolio.id}
                                assetProfits={portfolio.latestAssetProfits}
                                balances={portfolio.balances}
                            />
                        </Suspense>
                    </div>
                    <Suspense fallback={<AssetTableSkeleton />}>
                        <AssetTable portfolio={portfolio}/>
                    </Suspense>
                </div>}
            </div>
        </ConvertCurrencyProvider>
    );
}

export default function InvestmentContainer() {
    const {portfolios, loading} = useCryptoPortfoliosQuery()

    if (loading) {
        return <InvestmentPageSkeleton />;
    }

    return (
        <InvestmentPage portfolios={portfolios}/>
    );
}
