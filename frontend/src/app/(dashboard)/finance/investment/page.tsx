"use client";

import {
    AssetTableSkeleton,
    ChartSkeleton,
    InvestmentPageSkeleton,
    PortfolioAnalysisSkeleton,
    PortfolioSkeleton
} from "@/app/(dashboard)/finance/investment/components/skeletons";
import { useCryptoPortfoliosQuery } from "@/app/(dashboard)/finance/investment/useCryptoPortfoliosQuery";
import { GetCryptoPortfoliosQuery } from "@/gql/graphql";
import { ConvertCurrencyProvider } from "@/lib/context/convert-currency.context";
import { useAppSelector } from "@/state/hooks";
import { lazy, Suspense } from "react";

// Lazy load components
const PortfolioSelect = lazy(() => import("@/app/(dashboard)/finance/investment/components/portfolio/PortfolioSelect"));
const CreatePortfolioDialog = lazy(() => import("@/app/(dashboard)/finance/investment/components/portfolio/CreatePortfolioDialog"));
const CurrencySelect = lazy(() => import("@/app/(dashboard)/finance/investment/components/currency-select/CurrencySelect"));
const PortfolioSummary = lazy(() => import("@/app/(dashboard)/finance/components/investment-summary/PortfolioSummary"));
const HistoricalBalanceChart = lazy(() => import("@/app/(dashboard)/finance/investment/components/historical-balance-chart/HistoricalBalanceChart"));
const AssetTable = lazy(() => import("@/app/(dashboard)/finance/investment/components/asset-table/AssetTable"));
const BalancePieChart = lazy(() => import("@/app/(dashboard)/finance/investment/components/balance-pie-chart/BalancePieChart").then(module => ({ default: module.BalancePieChart })));
const PortfolioAnalysis = lazy(() => import("@/app/(dashboard)/finance/investment/components/portfolio-analysis/PortfolioAnalysis").then(module => ({ default: module.PortfolioAnalysis })));
const CreateExecutionSteps = lazy(() => import("@/app/(dashboard)/finance/investment/components/portfolio/CreateExecutionSteps").then(module => ({ default: module.CreateExecutionSteps })));

interface IProps {
    portfolios: GetCryptoPortfoliosQuery["getCryptoPortfolios"];
}

function InvestmentPage({portfolios}: IProps) {
    const {portfolio} = useAppSelector((state) => state.crypto.state);

    return (
        <ConvertCurrencyProvider baseCurrency="USD">
            <div className="flex flex-1 flex-col gap-4">
                <div className="flex gap-4">
                    <Suspense fallback={<div className="flex space-x-2"><PortfolioSkeleton /></div>}>
                        <PortfolioSelect portfolios={portfolios} />
                        <CreatePortfolioDialog/>
                        <div className="ml-auto">
                            <CurrencySelect/>
                        </div>
                    </Suspense>
                </div>

                <Suspense fallback={<div className="h-10"></div>}>
                    <CreateExecutionSteps />
                </Suspense>

                {portfolio && <div className="flex flex-col gap-4">
                    <div className="col-span-2">
                        <Suspense fallback={<PortfolioSkeleton />}>
                            <PortfolioSummary portfolio={portfolio}/>
                        </Suspense>
                    </div>
                    <div className="flex gap-4">
                        <Suspense fallback={<ChartSkeleton />}>
                            <HistoricalBalanceChart cryptoPortfolioId={portfolio.id}/>
                        </Suspense>

                        <Suspense fallback={<PortfolioAnalysisSkeleton />}>
                            <PortfolioAnalysis
                                cryptoPortfolioId={portfolio.id}
                                assetProfits={portfolio.latestAssetProfits}
                                balances={portfolio.balances}
                            />
                        </Suspense>
                    </div>
                    <Suspense fallback={<AssetTableSkeleton />}>
                        <AssetTable portfolios={[portfolio]}/>
                    </Suspense>
                </div>}
            </div>
        </ConvertCurrencyProvider>
    );
}

export default function InvestmentContainer() {
    const {portfolios, loading} = useCryptoPortfoliosQuery()

    if (loading || !portfolios) {
        return <InvestmentPageSkeleton />;
    }

    return (
        <InvestmentPage portfolios={portfolios}/>
    );
}
