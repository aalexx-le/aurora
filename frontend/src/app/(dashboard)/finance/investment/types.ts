import {
    GetAssetQuery,
    GetCryptoPortfoliosQuery,
    GetHistoricalAssetProfitsQuery,
    GetTradesQuery,
} from "@/gql/graphql";

export type CryptoPortfolio =
    GetCryptoPortfoliosQuery["getCryptoPortfolios"][number];

export type AssetPrice = GetAssetQuery["getAssetPrices"][number];

export type HistoricalAssetProfit =
    GetHistoricalAssetProfitsQuery["getHistoricalAssetProfits"][number];

export type LatestAssetProfit = CryptoPortfolio["latestAssetProfits"][number];

export type Trade = GetTradesQuery["getTrades"][number];

export type PortfolioAnalyseData = {
    assetId: string;
    invest: number;
    price: number;
    remainingQty: number;
    estimatedProfit: number;
    profitPercent: number;
    name: string;
    fill: string;
    tag: string;
    exchange: string;
    exchangeLogo: string;
};
