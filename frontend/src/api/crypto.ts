import gql from "graphql-tag";
import { useSubscription } from "@apollo/client";
import {
    NewAssetPrice1mSubscription,
    NewAssetPrice1mSubscriptionVariables,
    NewAssetPrice5mSubscription,
    NewAssetPrice5mSubscriptionVariables,
} from "@/gql/graphql";

export const CREATE_CRYPTO_PORTFOLIO = gql`
    mutation CreateCryptoProfile($data: CreateCryptoPortfolioInput!) {
        createCryptoPortfolio(data: $data) {
            userId
        }
    }
`;

export const GET_CRYPTO_PORTFOLIOS = gql`
    query GetCryptoProfile($data: GetCryptoPortfolioInput!) {
        getCryptoPortfolios(data: $data) {
            id
            exchanges
            tradingType
            historicalBalances {
                time
                estimatedBalance
                changePercent
                changeBalance
            }
            balances {
                balance
                assetInfo {
                    id
                    logo
                    lastPrice
                    symbol
                }
            }
        }
    }
`;

export const GET_ASSET = gql`
    query GetAsset(
        $pagination: PaginationInput!
        $getAssetPriceData: GetAssetPriceInput!
        $getAssetInfoData: GetAssetInfoInput!
    ) {
        getAssetPrices(data: $getAssetPriceData, pagination: $pagination) {
            open_time
            openPrice
            closePrice
            highPrice
            lowPrice
            volume
        }
        getAssetInfo(data: $getAssetInfoData) {
            logo
            desc
            category
            symbol
            name
        }
    }
`;

const SUBSCRIBE_ASSET_PRICE_1m = gql`
    subscription NewAssetPrice($data: GetAssetPriceInput!) {
        newAssetPrice1m(data: $data) {
            assetInfoId
            open_time
            openPrice
            closePrice
            highPrice
            lowPrice
        }
    }
`;

const SUBSCRIBE_ASSET_PRICE_5m = gql`
    subscription NewAssetPrice($data: GetAssetPriceInput!) {
        newAssetPrice5m(data: $data) {
            assetInfoId
            open_time
            openPrice
            closePrice
            highPrice
            lowPrice
        }
    }
`;

export const getSubscriptNewAssetPriceHook = (timeFrame: string) => {
    switch (timeFrame) {
        case "5m":
            return {
                query: SUBSCRIBE_ASSET_PRICE_5m,
                hook: useSubscription<
                    NewAssetPrice5mSubscription,
                    NewAssetPrice5mSubscriptionVariables
                >,
            };
        default:
            return {
                query: SUBSCRIBE_ASSET_PRICE_1m,
                hook: useSubscription<
                    NewAssetPrice1mSubscription,
                    NewAssetPrice1mSubscriptionVariables
                >,
            };
    }
};

export const getSubscriptNewAssetPriceResult = (
    newData:
        | NewAssetPrice5mSubscription
        | NewAssetPrice1mSubscription
        | undefined,
) => {
    if (!newData) return null;

    if ((newData as NewAssetPrice5mSubscription).newAssetPrice5m) {
        return (newData as NewAssetPrice5mSubscription).newAssetPrice5m;
    } else if ((newData as NewAssetPrice1mSubscription).newAssetPrice1m) {
        return (newData as NewAssetPrice1mSubscription).newAssetPrice1m;
    }
};
