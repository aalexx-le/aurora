"use client"

import {Card, CardContent, CardHeader, CardTitle,} from "@/components/ui/card"
import {useEffect, useState} from "react";
import {FastAverageColor, FastAverageColorResource} from "fast-average-color";
import {CategorySummary} from "@/app/(dashboard)/finance/investment/components/portfolio-analysis/CategorySummary";
import {QuestionMarkCircledIcon} from "@radix-ui/react-icons";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {GetCryptoPortfoliosQuery} from "@/gql/graphql";
import {MoneyAnimated} from "@/components/money/money-animated";
import {MoneyUpDownAnimated} from "@/components/money/money-up-down-animated";
import {BalancePieChart} from "@/app/(dashboard)/finance/investment/components/balance-pie-chart/BalancePieChart";
import {EXCHANGES_INFOS} from "@/app/(dashboard)/finance/investment/components/portfolio/ExchangeSelect";

interface IProps {
    cryptoPortfolioId: string;
    assetProfits: GetCryptoPortfoliosQuery['getCryptoPortfolios'][number]['latestAssetProfits'];
    balances: GetCryptoPortfoliosQuery['getCryptoPortfolios'][number]['balances'];
}

export type AnalyseData = {
    assetId: string;
    invest: number;
    price: number;
    remainingQty: number;
    estimatedProfit: number;
    profitPercent: number;
    name: string;
    fill: string;
    tag: string;
    exchangeLogo: string;
}

const MIN_THRESHOLD = 1;

export function PortfolioAnalysis({assetProfits, balances, cryptoPortfolioId}: IProps) {
    const [analyseData, setAnalyseData] = useState<AnalyseData[]>([]);

    useEffect(() => {
        const getChartData = async () => {
            const fac = new FastAverageColor();
            const mapBalances = await Promise.all(assetProfits
                .map(async b => ({
                    assetId: b.assetInfo.id,
                    invest: b.totalCostInQuoteQty,
                    price: b.assetInfo.lastPrice,
                    remainingQty: b.remainingQty,
                    estimatedProfit: b.estimatedProfit,
                    profitPercent: b.estimatedProfit / b.totalCostInQuoteQty * 100,
                    name: b.assetInfo.symbol,
                    fill: (await fac.getColorAsync(b.assetInfo.logo as unknown as FastAverageColorResource)).rgb,
                    tag: b.assetInfo.tag,
                    exchangeLogo: EXCHANGES_INFOS.find(e => b.cryptoPortfolio.exchanges == e.id)?.logo || ''
                })))

            const usdtBalances = balances.filter(b => b.assetInfo.symbol === 'USDT');
            const mapUSDTBalances = await Promise.all(usdtBalances
                .map(async b => ({
                    assetId: b.assetInfo.id,
                    invest: b.balance,
                    price: b.assetInfo.lastPrice,
                    remainingQty: b.balance,
                    estimatedProfit: 0,
                    profitPercent: 0,
                    name: b.assetInfo.symbol,
                    fill: (await fac.getColorAsync(b.assetInfo.logo as unknown as FastAverageColorResource)).rgb,
                    tag: b.assetInfo.tag,
                    exchangeLogo: EXCHANGES_INFOS.find(e => b.cryptoPortfolio.exchanges == e.id)?.logo || ''
                })))

            mapBalances.push(...mapUSDTBalances);

            const sortedBalances = mapBalances.sort((a, b) => b.invest - a.invest);

            const filteredBalances = sortedBalances
                // .filter(b => b.remainingQty > -10);

            const hideSymbols = ["BNB", "BTC"];

            const filteredHideBalances = filteredBalances.filter(b => !hideSymbols.includes(b.name));

            return filteredHideBalances;
            // const converted = await Promise.all(
            //     filteredBalances.map((v) => convertCurrency(v.estimatedProfit as number, false))
            // );
            //
            // return filteredBalances.map((b, i) => ({...b, estimatedProfit: converted[i] as unknown as number}))
        }

        getChartData().then(data => {
            setAnalyseData(data);
        });
    }, [assetProfits])

    return (
        <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row justify-between">
                <CardTitle className="text-xl font-bold text-muted-foreground tracking-wide">Portfolio</CardTitle>
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
            </CardHeader>
            <CardContent className="p-0 lg:p-4 flex flex-1 items-center">
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-between">
                    <div className="flex-1 flex flex-col items-center mb-6 lg:mb-0">
                        <BalancePieChart data={analyseData} />
                        {/*<ResponsiveContainer className="flex-1">*/}
                        {/*    <ChartContainer config={{}}>*/}
                        {/*        <BarChart data={chartData}>*/}
                        {/*            <ChartTooltip*/}
                        {/*                cursor={false}*/}
                        {/*                content={<ChartTooltipContent hideLabel/>}*/}
                        {/*            />*/}
                        {/*            <Bar dataKey="estimatedProfit" name="profit" radius={3}>*/}
                        {/*                /!*<LabelList position="top" dataKey="name" fillOpacity={1}/>*!/*/}
                        {/*                {chartData.map((item) => (*/}
                        {/*                    <Cell*/}
                        {/*                        key={item.name}*/}
                        {/*                        fill={item.fill}*/}
                        {/*                    />*/}
                        {/*                ))}*/}
                        {/*            </Bar>*/}
                        {/*        </BarChart>*/}
                        {/*    </ChartContainer>*/}
                        {/*</ResponsiveContainer>*/}

                        {/*<div className="flex flex-col">*/}
                        {/*    <span className="font-bold text-lg">*/}
                        {/*        <span className="font-bold text-muted-foreground text-sm mr-4">Deposited</span>*/}
                        {/*        <MoneyAnimated number={analyseData.reduce((sum, b) => sum + b.invest, 0)}/>*/}
                        {/*    </span>*/}
                        {/*    <span className="font-bold text-lg">*/}
                        {/*        <span className="font-bold text-muted-foreground text-sm mr-4">Profit</span>*/}
                        {/*        <MoneyUpDownAnimated number={analyseData.reduce((sum, b) => sum + b.estimatedProfit, 0)}/>*/}
                        {/*    </span>*/}
                        {/*    <span className="font-bold text-lg">*/}
                        {/*        <span className="font-bold text-muted-foreground text-sm mr-4">Total</span>*/}
                        {/*        <MoneyAnimated number={analyseData.reduce((sum, b) => sum + b.remainingQty * b.price, 0)}/>*/}
                        {/*    </span>*/}
                        {/*</div>*/}
                    </div>

                    <CategorySummary analyseData={analyseData} cryptoPortfolioId={cryptoPortfolioId}/>
                </div>
            </CardContent>
        </Card>
    )
}
