import gql from "graphql-tag";
import { useSubscription } from "@apollo/client";
import {
    NewAssetPrice1mSubscription,
    NewAssetPrice1mSubscriptionVariables,
    NewAssetPrice5mSubscription,
    NewAssetPrice5mSubscriptionVariables,
    NewHistoricalCryptoBalance1hSubscription,
    NewHistoricalCryptoBalance1hSubscriptionVariables,
    NewHistoricalCryptoBalance1mSubscription,
    NewHistoricalCryptoBalance1mSubscriptionVariables,
} from "@/gql/graphql";
import { getAbbreviatedTimeFrame } from "@/lib/utils/date-time/get-currency-month-date-range";
import {
    AbbreviatedTimeFrameEnum,
    TimeframeEnum,
} from "@/lib/utils/date-time/timeframe.enum";

export const CREATE_CRYPTO_PORTFOLIO = gql`
    mutation CreateCryptoProfile($data: CreateCryptoPortfolioInput!) {
        createCryptoPortfolio(data: $data) {
            userId
        }
    }
`;

export const CREATE_OKX_CRYPTO_PORTFOLIO = gql`
    mutation CreateOKXCryptoPortfolio($data: CreateOKXCryptoPortfolioInput!) {
        createOKXCryptoPortfolio(data: $data) {
            userId
        }
    }
`;



export const GET_CRYPTO_PORTFOLIOS = gql`
    query GetCryptoPortfolios(
        $data: GetCryptoPortfolioInput!
        $timeFrame: String!
    ) {
        getCryptoPortfolios(data: $data) {
            id
            name
            exchanges
            tradingType
            investmentCategoryName
            latestHistoricalBalances(timeFrame: $timeFrame) {
                changeBalance
                changePercent
                estimatedBalance
            }
            latestAssetProfits {
                estimatedProfit
                remainingQty
                totalCostInQuoteQty
                cryptoPortfolio {
                    id
                    exchanges
                    name
                }
                assetInfo {
                    id
                    logo
                    lastPrice
                    symbol
                    tag
                }
            }
            balances {
                id
                balance
                cryptoPortfolio {
                    id
                    exchanges
                    name
                }
                assetInfo {
                    id
                    logo
                    lastPrice
                    symbol
                    tag
                }
            }
        }
    }
`;

export const GET_HISTORICAL_ASSET_PROFIT = gql`
    query GetHistoricalAssetProfits(
        $data: GetHistoricalAssetProfitInput!
        $pagination: PaginationInput!
    ) {
        getHistoricalAssetProfits(data: $data, pagination: $pagination) {
            time
            estimatedProfit
            remainingQty
            totalCostInQuoteQty
        }
    }
`;

export const GET_HISTORICAL_BALANCE = gql`
    query GetHistoricalBalances(
        $data: GetHistoricalBalanceInput!
        $pagination: PaginationInput!
    ) {
        getHistoricalBalances(data: $data, pagination: $pagination) {
            time
            estimatedBalance
            changePercent
            changeBalance
        }
    }
`;

export const GET_ASSET = gql`
    query GetAsset(
        $pagination: PaginationInput!
        $getAssetPriceData: GetAssetPriceInput!
        $getAssetProfitData: GetHistoricalAssetProfitInput!
        $getAssetInfoData: GetAssetInfoInput!
    ) {
        getHistoricalAssetProfits(
            data: $getAssetProfitData
            pagination: $pagination
        ) {
            time
            estimatedProfit
            remainingQty
            totalCostInQuoteQty
        }

        getAssetPrices(data: $getAssetPriceData, pagination: $pagination) {
            open_time
            openPrice
            closePrice
            highPrice
            lowPrice
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

export const getSubscriptNewAssetPriceHook = (timeFrame: TimeframeEnum) => {
    const abbreviatedTimeFrame = getAbbreviatedTimeFrame(timeFrame);
    switch (abbreviatedTimeFrame) {
        case AbbreviatedTimeFrameEnum.FIVE_MINUTES:
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

const SUBSCRIBE_HISTORICAL_BALANCE_1m = gql`
    subscription NewHistoricalCryptoBalance1m(
        $data: GetHistoricalBalancesInput!
    ) {
        newHistoricalCryptoBalance1m(data: $data) {
            cryptoPortfolioId
            time
            estimatedBalance
            changeBalance
            changePercent
        }
    }
`;

const SUBSCRIBE_HISTORICAL_BALANCE_1h = gql`
    subscription NewHistoricalCryptoBalance1h(
        $data: GetHistoricalBalancesInput!
    ) {
        newHistoricalCryptoBalance1h(data: $data) {
            cryptoPortfolioId
            time
            estimatedBalance
            changeBalance
            changePercent
        }
    }
`;

// Function to get the appropriate subscription hook based on the time frame
export const getSubscriptNewHistoricalBalanceHook = (
    timeFrame: TimeframeEnum,
) => {
    const abbreviatedTimeFrame = getAbbreviatedTimeFrame(timeFrame);
    switch (abbreviatedTimeFrame) {
        case AbbreviatedTimeFrameEnum.ONE_HOUR:
            return {
                query: SUBSCRIBE_HISTORICAL_BALANCE_1h,
                hook: useSubscription<
                    NewHistoricalCryptoBalance1hSubscription,
                    NewHistoricalCryptoBalance1hSubscriptionVariables
                >,
            };
        default:
            return {
                query: SUBSCRIBE_HISTORICAL_BALANCE_1m,
                hook: useSubscription<
                    NewHistoricalCryptoBalance1mSubscription,
                    NewHistoricalCryptoBalance1mSubscriptionVariables
                >,
            };
    }
};

// Function to get the subscription result
export const getSubscriptNewHistoricalBalanceResult = (
    newData:
        | NewHistoricalCryptoBalance1hSubscription
        | NewHistoricalCryptoBalance1mSubscription
        | undefined,
) => {
    if (!newData) return null;

    if (
        (newData as NewHistoricalCryptoBalance1hSubscription)
            .newHistoricalCryptoBalance1h
    ) {
        return (newData as NewHistoricalCryptoBalance1hSubscription)
            .newHistoricalCryptoBalance1h;
    } else if (
        (newData as NewHistoricalCryptoBalance1mSubscription)
            .newHistoricalCryptoBalance1m
    ) {
        return (newData as NewHistoricalCryptoBalance1mSubscription)
            .newHistoricalCryptoBalance1m;
    }
};
