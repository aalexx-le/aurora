import gql from "graphql-tag";

export const GET_CREATE_PORTFOLIO_EXECUTIONS = gql`
    query GetCreatePortfolioExecutions {
        getCreatePortfolioExecutions {
            id
            userId
            currentStep
            currentMilestone
            progressPercent
            errorMessage
            recoveryAction
            retryCount
            maxRetries
            exchangeType
            executionContext
            createdAt
            updatedAt
            completedAt
        }
    }
`;

export const RETRY_PORTFOLIO_CREATION = gql`
    mutation RetryPortfolioCreation($executionId: Int!) {
        retryPortfolioCreation(executionId: $executionId) {
            id
            userId
            currentStep
            currentMilestone
            progressPercent
            errorMessage
            recoveryAction
            retryCount
            maxRetries
            exchangeType
            executionContext
            createdAt
            updatedAt
            completedAt
        }
    }
`;

export const UPDATE_PORTFOLIO_CREDENTIALS = gql`
    mutation UpdatePortfolioCredentials(
        $executionId: Int!
        $credentials: UpdateCredentialsInput!
    ) {
        updatePortfolioCredentials(
            executionId: $executionId
            credentials: $credentials
        ) {
            id
            userId
            currentStep
            currentMilestone
            progressPercent
            errorMessage
            recoveryAction
            retryCount
            maxRetries
            exchangeType
            executionContext
            createdAt
            updatedAt
            completedAt
        }
    }
`;

export const CREATE_SUPPORT_TICKET = gql`
    mutation CreateSupportTicket($data: CreateSupportTicketInput!) {
        createSupportTicket(data: $data)
    }
`;

export const PORTFOLIO_CREATION_STATUS_SUBSCRIPTION = gql`
    subscription OnPortfolioCreationStatus {
        onCreatePortfolioExecution {
            id
            userId
            currentStep
            currentMilestone
            progressPercent
            errorMessage
            recoveryAction
            retryCount
            maxRetries
            exchangeType
            executionContext
            createdAt
            updatedAt
            completedAt
        }
    }
`;
