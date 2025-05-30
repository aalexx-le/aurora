import { graphql } from "@/gql";

export const SUBSCRIBE_HISTORICAL_ASSET_PROFIT = graphql(`
    subscription NewHistoricalAssetProfit(
        $data: GetHistoricalAssetProfitInput!
    ) {
        newHistoricalAssetProfit(data: $data) {
            time
            totalCostInQuoteQty
            remainingQty
            estimatedProfit
        }
    }
`);