import {
    GetAssetQuery,
    GetCryptoPortfoliosQuery,
    GetHistoricalAssetProfitsQuery, GetTradesQuery,
} from "@/gql/graphql";

export type CryptoPortfolio =
    GetCryptoPortfoliosQuery["getCryptoPortfolios"][number];

export type AssetPrice = GetAssetQuery["getAssetPrices"][number];

export type HistoricalAssetProfit =
    GetHistoricalAssetProfitsQuery["getHistoricalAssetProfits"][number];

export type Trade = GetTradesQuery["getTrades"][number];
