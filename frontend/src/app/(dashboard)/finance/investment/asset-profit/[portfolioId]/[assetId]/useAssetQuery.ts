import { useQuery } from "@apollo/client";
import { GetAssetQuery, GetAssetQueryVariables } from "@/gql/graphql";
import {
    GET_ASSET,
    getSubscriptNewAssetPriceHook,
    getSubscriptNewAssetPriceResult,
} from "@/api/script/crypto/crypto";
import { useMemo } from "react";
import { AssetProfitPageParams } from "@/app/(dashboard)/finance/investment/asset-profit/[portfolioId]/[assetId]/page";
import { TimeframeEnum } from "@/lib/utils/date-time/timeframe.enum";

export const useAssetQuery = (
    input: AssetProfitPageParams,
    timeFrame: TimeframeEnum,
) => {
    const { portfolioId: cryptoPortfolioId, assetId: assetInfoId } = input;
    const { hook, query } = getSubscriptNewAssetPriceHook(timeFrame);
    const { data: newData } = hook(query, {
        variables: { data: { assetInfoId, timeFrame } },
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

    const newPrice = getSubscriptNewAssetPriceResult(newData);

    const priceData = useMemo(() => {
        if (!data || loading) {
            return [];
        }

        return newPrice
            ? [...data.getAssetPrices, newPrice]
            : data.getAssetPrices;
    }, [data, newPrice, loading]);

    const profitData = data?.getHistoricalAssetProfits || [];

    return {
        priceData,
        profitData,
        fetchMore: fetchMoreData,
        assetInfo: data?.getAssetInfo,
        loading,
    };
};
