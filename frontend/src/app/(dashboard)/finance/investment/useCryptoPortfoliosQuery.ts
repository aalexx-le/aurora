import { GET_CRYPTO_PORTFOLIOS } from "@/api/scripts/crypto/crypto";
import {
    GetCryptoPortfoliosQuery,
    GetCryptoPortfoliosQueryVariables,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";

export const useCryptoPortfoliosQuery = () => {
    const { data, loading } = useQuery<
        GetCryptoPortfoliosQuery,
        GetCryptoPortfoliosQueryVariables
    >(GET_CRYPTO_PORTFOLIOS, {
        variables: {
            timeFrame: "1 day",
        },
    });

    const portfolios = data?.getCryptoPortfolios || [];

    return {
        portfolios: [...portfolios]
            .sort(
                (pa, pb) =>
                    pb.latestHistoricalBalances.estimatedBalance -
                    pa.latestHistoricalBalances.estimatedBalance,
            )
            .filter((p) => p.investmentCategoryName === "Investment"),
        loading,
    };
};
