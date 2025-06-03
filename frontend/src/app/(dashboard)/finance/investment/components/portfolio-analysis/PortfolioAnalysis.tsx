"use client"

import { BalancePieChart } from "@/app/(dashboard)/finance/investment/components/balance-pie-chart/BalancePieChart";
import { CategorySummary } from "@/app/(dashboard)/finance/investment/components/portfolio-analysis/CategorySummary";
import { ExportButton } from "@/components/export/ExportButton";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { GetCryptoPortfoliosQuery } from "@/gql/graphql";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useAnalyseData } from "../../hooks/useAnalyseData";

export interface IPortfolioAnalysisProps {
    cryptoPortfolioId: string;
    assetProfits: GetCryptoPortfoliosQuery['getCryptoPortfolios'][number]['latestAssetProfits'];
    balances: GetCryptoPortfoliosQuery['getCryptoPortfolios'][number]['balances'];
}

export function PortfolioAnalysis({assetProfits, balances, cryptoPortfolioId}: IPortfolioAnalysisProps) {
    const { analyseData } = useAnalyseData(assetProfits);

    return (
        <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">
                        Portfolio
                    </CardTitle>
                    <Tooltip>
                        <TooltipTrigger className="text-muted-foreground">
                            <QuestionMarkCircledIcon/>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="font-bold text-sm">Formula</p>
                            <p className="font-bold">[Current Price] x [Remaining quantity] = [Balance]</p>
                            <p className="font-bold">[Balance] - [Invest] = [Profit]</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                    <ExportButton
                        analyseData={analyseData}
                        portfolioId={cryptoPortfolioId}
                        portfolioName="Portfolio"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0 lg:p-1 xl:p-2 2xl:p-4 flex flex-1 items-center">
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex-1 flex flex-col items-center mb-6 lg:mb-0">
                        <BalancePieChart data={analyseData} />
                    </div>

                    <CategorySummary analyseData={analyseData} cryptoPortfolioId={cryptoPortfolioId}/>
                </div>
            </CardContent>
        </Card>
    )
}
