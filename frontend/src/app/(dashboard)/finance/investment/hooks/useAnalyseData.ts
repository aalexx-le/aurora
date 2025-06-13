import { FastAverageColor, FastAverageColorResource } from "fast-average-color";
import { useEffect, useState } from "react";
import { LatestAssetProfit, type PortfolioAnalyseData } from "../types";
import { CRYPTO_EXCHANGES_INFOS } from "@/lib/constants/crypto-exchanges";

const MIN_THRESHOLD = 0.1;

export function useAnalyseData(assetProfits: LatestAssetProfit[]) {
    const [analyseData, setAnalyseData] = useState<PortfolioAnalyseData[]>([]);

    useEffect(() => {
        const getChartData = async () => {
            const fac = new FastAverageColor();
            const mapBalances = await Promise.all(
                assetProfits.map(async (b) => ({
                    assetId: b.assetInfo.id,
                    invest: b.totalCostInQuoteQty,
                    price: b.assetInfo.lastPrice,
                    remainingQty: b.remainingQty,
                    estimatedProfit: b.estimatedProfit,
                    profitPercent:
                        (b.estimatedProfit / b.totalCostInQuoteQty) * 100,
                    name: b.assetInfo.symbol,
                    fill: (
                        await fac.getColorAsync(
                            b.assetInfo
                                .logo as unknown as FastAverageColorResource,
                        )
                    ).rgb,
                    tag: b.assetInfo.tag,
                    exchange: b.cryptoPortfolio.exchanges,
                    exchangeLogo:
                        CRYPTO_EXCHANGES_INFOS.find(
                            (e) => b.cryptoPortfolio.exchanges == e.id,
                        )?.logo || "",
                })),
            );

            // const usdtBalances = balances.filter(b => b.assetInfo.symbol === 'USDT');
            // const mapUSDTBalances = await Promise.all(usdtBalances
            //     .map(async b => ({
            //         assetId: b.assetInfo.id,
            //         invest: b.balance,
            //         price: b.assetInfo.lastPrice,
            //         remainingQty: b.balance,
            //         estimatedProfit: 0,
            //         profitPercent: 0,
            //         name: b.assetInfo.symbol,
            //         fill: (await fac.getColorAsync(b.assetInfo.logo as unknown as FastAverageColorResource)).rgb,
            //         tag: b.assetInfo.tag,
            //         exchange: b.cryptoPortfolio.exchanges,
            //         exchangeLogo: EXCHANGES_INFOS.find(e => b.cryptoPortfolio.exchanges == e.id)?.logo || ''
            //     })))
            //
            // mapBalances.push(...mapUSDTBalances);

            const sortedBalances = mapBalances.sort(
                (a, b) => b.invest - a.invest,
            );

            const filteredBalances = sortedBalances.filter(
                (b) => b.remainingQty > MIN_THRESHOLD,
            );

            const hideSymbols = ["BNB", "BTC"];

            // const filteredHideBalances = filteredBalances.filter(b => !hideSymbols.includes(b.name));

            return filteredBalances;
            // const converted = await Promise.all(
            //     filteredBalances.map((v) => convertCurrency(v.estimatedProfit as number, false))
            // );
            //
            // return filteredBalances.map((b, i) => ({...b, estimatedProfit: converted[i] as unknown as number}))
        };

        getChartData().then((data) => {
            setAnalyseData(data);
        });
    }, [assetProfits]);

    return { analyseData };
}
