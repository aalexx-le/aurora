import { gql } from "@apollo/client";

export const PORTFOLIO_CREATION_STATUS_SUBSCRIPTION = gql`
    subscription OnPortfolioCreationStatus {
        onCreatePortfolioExecution {
            id
            userId
            status
            time
        }
    }
`;
