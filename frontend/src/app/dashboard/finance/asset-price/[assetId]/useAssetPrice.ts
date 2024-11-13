import { useQuery } from "@apollo/client";
import { GetAssetQuery, GetAssetQueryVariables } from "@/gql/graphql";
import {
    GET_ASSET,
    getSubscriptNewAssetPriceHook,
    getSubscriptNewAssetPriceResult,
} from "@/api/crypto";
import { useMemo } from "react";

const getAbbreviatedTimeFrame = (timeFrame: string) => {
    const [time, unit] = timeFrame.split(" ");
    return time + unit.charAt(0);
};

export const useAssetPrice = (assetInfoId: string, timeFrame: string) => {
    const abbreviatedTimeFrame = getAbbreviatedTimeFrame(timeFrame);
    const { hook, query } = getSubscriptNewAssetPriceHook(abbreviatedTimeFrame);
    const { data: newData } = hook(query, {
        variables: { data: { assetInfoId, timeFrame } },
    });

    const { data, loading, fetchMore } = useQuery<
        GetAssetQuery,
        GetAssetQueryVariables
    >(GET_ASSET, {
        variables: {
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

    const historicalData = useMemo(() => {
        if (!data || loading) {
            return [];
        }

        return newPrice
            ? [...data.getAssetPrices, newPrice]
            : data.getAssetPrices;
    }, [data, newPrice, loading]);

    return {
        data: historicalData,
        fetchMore: fetchMoreData,
        assetInfo: data?.getAssetInfo,
        loading,
    };
};
