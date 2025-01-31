import { useQuery } from "@apollo/client";
import {
    GetCryptoPortfoliosQuery,
    GetCryptoPortfoliosQueryVariables,
} from "@/gql/graphql";
import { GET_CRYPTO_PORTFOLIOS } from "@/api/script/crypto/crypto";
import { useAppSelector } from "@/state/hooks";

export const useCryptoPortfoliosQuery = () => {
    const { user } = useAppSelector((state) => state.auth.state);
    const { data, loading } = useQuery<
        GetCryptoPortfoliosQuery,
        GetCryptoPortfoliosQueryVariables
    >(GET_CRYPTO_PORTFOLIOS, {
        variables: {
            data: { userId: Number(user?.id || 0) },
            timeFrame: "1 day",
        },
    });

    let portfolios = data?.getCryptoPortfolios || [];

    return {
        portfolios: [...portfolios].sort(
            (pa, pb) =>
                pb.latestHistoricalBalances.estimatedBalance -
                pa.latestHistoricalBalances.estimatedBalance,
        ).filter((p) => p.investmentCategoryName === "Investment"),
        loading,
    };
};
