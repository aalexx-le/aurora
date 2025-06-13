import { graphql } from "@/gql";

export const CREATE_CRYPTO_PORTFOLIO = graphql(`
    mutation CreateCryptoPortfolio($data: CreateCryptoPortfolioInput!) {
        createCryptoPortfolio(data: $data) {
            userId
        }
    }
`);

export const GET_CRYPTO_PORTFOLIOS = graphql(`
    query GetCryptoPortfolios($timeFrame: String!) {
        getCryptoPortfolios {
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
`);

export const GET_HISTORICAL_ASSET_PROFIT = graphql(`
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
`);

export const GET_HISTORICAL_BALANCE = graphql(`
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
`);

export const GET_ASSET = graphql(`
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
`);

export const SUBSCRIBE_ASSET_PRICE = graphql(`
    subscription NewAssetPrice($data: GetAssetPriceInput!) {
        newAssetPrice(data: $data) {
            assetInfoId
            open_time
            openPrice
            closePrice
            highPrice
            lowPrice
        }
    }
`);

export const SUBSCRIBE_HISTORICAL_BALANCE = graphql(`
    subscription NewHistoricalCryptoBalance(
        $data: GetHistoricalBalancesInput!
    ) {
        newHistoricalCryptoBalance(data: $data) {
            cryptoPortfolioId
            time
            estimatedBalance
            changeBalance
            changePercent
        }
    }
`);
