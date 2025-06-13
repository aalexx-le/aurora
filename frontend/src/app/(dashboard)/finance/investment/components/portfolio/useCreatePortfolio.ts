import {
    CREATE_CRYPTO_PORTFOLIO,
    GET_CRYPTO_PORTFOLIOS,
} from "@/api/crypto/crypto";
import { GET_CREATE_PORTFOLIO_EXECUTIONS } from "@/api/crypto/execution";
import {
    CreateCryptoPortfolioMutation,
    CreateCryptoPortfolioMutationVariables,
} from "@/gql/graphql";
import { useMutation } from "@apollo/client";

export const useCreatePortfolio = () => {
    const [createPortfolio, { loading: createPortfolioLoading }] = useMutation<
        CreateCryptoPortfolioMutation,
        CreateCryptoPortfolioMutationVariables
    >(CREATE_CRYPTO_PORTFOLIO, {
        awaitRefetchQueries: true,
        refetchQueries: [
            GET_CRYPTO_PORTFOLIOS,
            "GetCryptoPortfolios",
            GET_CREATE_PORTFOLIO_EXECUTIONS,
            "GetCreatePortfolioExecutions",
        ],
    });

    return {
        createPortfolio,
        loading: createPortfolioLoading,
    };
};
