import gql from "graphql-tag";

export const CREATE_BANK_TRANSACTION = gql`
    mutation CreateBankTransaction($data: CreateBankTransactionInput!) {
        createBankTransaction(data: $data) {
            id
            amount
            description
            createdAt
            bankId
        }
    }
`;
export const GET_BANK_TRANSACTIONS = gql`
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