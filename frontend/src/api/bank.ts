import gql from "graphql-tag";

export const GET_BANKS = gql`
    query GetBank($userId: Int!) {
        getBankManagers(userId: $userId) {
            name
            createdAt
            updatedAt
            banks {
                name
                accountName
                accountNumber
                balance
                createdAt
                updatedAt
            }
        }
    }
`;

export const GET_TRANSACTIONS = gql`
    query GetBankTransactions($userId: Float!) {
        getBankTransactions(userId: $userId) {
            id
            amount
            spentAmount
            createdAt
            description
            bank {
                name
            }
        }
    }
`;
