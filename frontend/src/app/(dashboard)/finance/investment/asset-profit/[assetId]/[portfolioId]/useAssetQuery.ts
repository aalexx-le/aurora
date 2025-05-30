import { SUBSCRIBE_HISTORICAL_ASSET_PROFIT } from "@/api/crypto/asset-profit";
import {
    GET_ASSET,
    SUBSCRIBE_ASSET_PRICE,
} from "@/api/crypto/crypto";
import { AssetProfitPageParams } from "@/app/(dashboard)/finance/investment/asset-profit/[assetId]/[portfolioId]/page";
import { GetAssetQuery, GetAssetQueryVariables } from "@/gql/graphql";
import { TimeframeEnum } from "@/lib/utils/date-time/timeframe.enum";
import { useQuery, useSubscription } from "@apollo/client";
import { useMemo } from "react";

export const useAssetQuery = (
    input: AssetProfitPageParams,
    timeFrame: TimeframeEnum,
) => {
    const { portfolioId: cryptoPortfolioId, assetId: assetInfoId } = input;
    const { data: newPriceData } = useSubscription(SUBSCRIBE_ASSET_PRICE, {
        variables: { data: { assetInfoId, timeFrame } },
    });
    const { data: newProfitData } = useSubscription(SUBSCRIBE_HISTORICAL_ASSET_PROFIT, {
        variables: { data: { cryptoPortfolioId, assetInfoId, timeFrame } },
    });

    const { data, loading, fetchMore } = useQuery<
        GetAssetQuery,
        GetAssetQueryVariables
    >(GET_ASSET, {
        variables: {
            getAssetProfitData: { cryptoPortfolioId, assetInfoId, timeFrame },
            getAssetPriceData: { assetInfoId, timeFrame },
            getAssetInfoData: { id: assetInfoId },
            pagination: { take: 500 },
        },
    });

    const fetchMoreData = async () => {
        if (!data || loading) {
            return;
        }

        await fetchMore({
            variables: {
                pagination: {
                    take: 10,
                    after: data.getAssetPrices[0].open_time,
                },
            },
        });
    };


    const priceData = useMemo(() => {
        if (!data || loading) {
            return [];
        }

        if (!newPriceData?.newAssetPrice) {
            return data.getAssetPrices;
        }

        return [...data.getAssetPrices, newPriceData.newAssetPrice];
    }, [data, newPriceData, loading]);

    const profitData = useMemo(() => {
        if (!data?.getHistoricalAssetProfits || loading) {
            return [];
        }

        if (!newProfitData?.newHistoricalAssetProfit) {
            return data.getHistoricalAssetProfits;
        }

        return [...data.getHistoricalAssetProfits, newProfitData.newHistoricalAssetProfit];
    }, [data, newProfitData, loading]);

    return {
        priceData,
        profitData,
        fetchMore: fetchMoreData,
        assetInfo: data?.getAssetInfo,
        loading,
    };
};
