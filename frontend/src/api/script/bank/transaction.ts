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
    query GetBankTransactions {
        getBankTransactions {
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

export const REMOVE_BANK_TRANSACTION = gql`
    mutation RemoveBankTransaction($id: Int!) {
        removeBankTransaction(id: $id) {
            id
        }
    }
`;
