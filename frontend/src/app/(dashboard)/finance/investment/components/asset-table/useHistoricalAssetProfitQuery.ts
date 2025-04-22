import { GET_HISTORICAL_ASSET_PROFIT } from "@/api/scripts/crypto/crypto";
import {
    GetHistoricalAssetProfitsQuery,
    GetHistoricalAssetProfitsQueryVariables,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";

export const useHistoricalAssetProfitQuery = (
    cryptoPortfolioId: string,
    assetInfoId: string,
    timeFrame: string = "1 day",
) => {
    const { data, loading, error } = useQuery<
        GetHistoricalAssetProfitsQuery,
        GetHistoricalAssetProfitsQueryVariables
    >(GET_HISTORICAL_ASSET_PROFIT, {
        variables: {
            data: {
                cryptoPortfolioId,
                assetInfoId,
                timeFrame,
            },
            pagination: {
                take: 500,
            },
        },
    });

    const profitData = data?.getHistoricalAssetProfits ?? [];

    return {
        profitData,
        loading,
        error,
    };
};
