import {
    GetAssetQuery,
    GetCryptoPortfoliosQuery,
    GetHistoricalAssetProfitsQuery,
} from "@/gql/graphql";

export type CryptoPortfolio =
    GetCryptoPortfoliosQuery["getCryptoPortfolios"][number];

export type AssetPrice = GetAssetQuery["getAssetPrices"][number];

export type HistoricalAssetProfit =
    GetHistoricalAssetProfitsQuery["getHistoricalAssetProfits"][number];
