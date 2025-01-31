import gql from "graphql-tag";

export const GET_CREATE_PORTFOLIO_EXECUTIONS = gql`
    query GetCreatePortfolioExecutions($userId: Float!) {
        getCreatePortfolioExecutions(userId: $userId) {
            id
            status
            time
        }
    }
`;