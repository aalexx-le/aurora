import { useMutation } from "@apollo/client";
import {
    CreateCryptoPortfolioMutation,
    CreateCryptoPortfolioMutationVariables,
    CreateOkxCryptoPortfolioMutation,
    CreateOkxCryptoPortfolioMutationVariables,
} from "@/gql/graphql";
import {
    CREATE_CRYPTO_PORTFOLIO,
    CREATE_OKX_CRYPTO_PORTFOLIO,
    GET_CRYPTO_PORTFOLIOS,
} from "@/api/script/crypto/crypto";
import { GET_CREATE_PORTFOLIO_EXECUTIONS } from "@/api/script/crypto/execution";

export const useCreatePortfolio = () => {
    const [createPortfolio] = useMutation<
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

    const [createOKXPortfolio] = useMutation<
        CreateOkxCryptoPortfolioMutation,
        CreateOkxCryptoPortfolioMutationVariables
    >(CREATE_OKX_CRYPTO_PORTFOLIO, {
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
        createOKXPortfolio,
    };
};
