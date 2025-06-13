import { GET_CRYPTO_PORTFOLIOS } from "@/api/crypto/crypto";
import { PORTFOLIO_CREATION_STATUS_SUBSCRIPTION } from "@/api/crypto/execution";
import {
    OnPortfolioCreationStatusSubscription,
    PortfolioCreationMilestone,
} from "@/gql/graphql";
import { useQuery, useSubscription } from "@apollo/client";

export const useCryptoPortfoliosQuery = () => {
    const { data, loading, refetch } = useQuery(GET_CRYPTO_PORTFOLIOS, {
        variables: {
            timeFrame: "1 day",
        },
        fetchPolicy: "cache-and-network",
    });

    useSubscription<OnPortfolioCreationStatusSubscription>(
        PORTFOLIO_CREATION_STATUS_SUBSCRIPTION,
        {
            onData: (options) => {
                const isCompleted =
                    options.data.data?.onCreatePortfolioExecution
                        .currentMilestone ===
                    PortfolioCreationMilestone.Completed;
                if (isCompleted) {
                    refetch();
                }
            },
        },
    );

    const portfolios = data?.getCryptoPortfolios || [];

    return {
        portfolios: [...portfolios].sort(
            (pa, pb) =>
                pb.latestHistoricalBalances.estimatedBalance -
                pa.latestHistoricalBalances.estimatedBalance,
        ),
        // .filter((p) => p.investmentCategoryName === "Investment"),
        loading,
    };
};
