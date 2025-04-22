import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import {
    NewHistoricalAssetProfit1hSubscription,
    NewHistoricalAssetProfit1hSubscriptionVariables,
    NewHistoricalAssetProfit1mSubscription,
    NewHistoricalAssetProfit1mSubscriptionVariables,
} from "@/gql/graphql";
import {
    AbbreviatedTimeFrameEnum,
    TimeframeEnum,
} from "@/lib/utils/date-time/timeframe.enum";
import { getAbbreviatedTimeFrame } from "@/lib/utils/date-time/get-currency-month-date-range";

const SUBSCRIBE_HISTORICAL_PROFIT_1m = gql`
    subscription NewHistoricalAssetProfit1m(
        $data: GetHistoricalAssetProfitInput!
    ) {
        newHistoricalAssetProfit1m(data: $data) {
            time
            totalCostInQuoteQty
            remainingQty
            estimatedProfit
        }
    }
`;

const SUBSCRIBE_HISTORICAL_PROFIT_1h = gql`
    subscription NewHistoricalAssetProfit1h(
        $data: GetHistoricalAssetProfitInput!
    ) {
        newHistoricalAssetProfit1h(data: $data) {
            time
            totalCostInQuoteQty
            remainingQty
            estimatedProfit
        }
    }
`;

export const getSubscriptNewHistoricalProfitHook = (
    timeFrame: TimeframeEnum,
) => {
    const abbreviatedTimeFrame = getAbbreviatedTimeFrame(timeFrame);
    switch (abbreviatedTimeFrame) {
        case AbbreviatedTimeFrameEnum.ONE_HOUR:
            return {
                query: SUBSCRIBE_HISTORICAL_PROFIT_1h,
                hook: useSubscription<
                    NewHistoricalAssetProfit1hSubscription,
                    NewHistoricalAssetProfit1hSubscriptionVariables
                >,
            };
        default:
            return {
                query: SUBSCRIBE_HISTORICAL_PROFIT_1m,
                hook: useSubscription<
                    NewHistoricalAssetProfit1mSubscription,
                    NewHistoricalAssetProfit1mSubscriptionVariables
                >,
            };
    }
};

export const getSubscriptNewHistoricalProfitResult = (
    newData:
        | NewHistoricalAssetProfit1hSubscription
        | NewHistoricalAssetProfit1mSubscription
        | undefined,
) => {
    if (!newData) return null;

    if (
        (newData as NewHistoricalAssetProfit1hSubscription)
            .newHistoricalAssetProfit1h
    ) {
        return (newData as NewHistoricalAssetProfit1hSubscription)
            .newHistoricalAssetProfit1h;
    } else if (
        (newData as NewHistoricalAssetProfit1mSubscription)
            .newHistoricalAssetProfit1m
    ) {
        return (newData as NewHistoricalAssetProfit1mSubscription)
            .newHistoricalAssetProfit1m;
    }
};
