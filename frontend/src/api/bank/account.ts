import gql from "graphql-tag";

export const CREATE_BANK_ACCOUNT = gql`
    mutation CreateBankAccount($data: CreateBankAccountInput!) {
        createBankAccount(data: $data) {
            id
            name
            accountNumber
            balance
            createdAt
        }
    }
`;

export const GET_BANK_ACCOUNTS = gql`
    query GetBankAccounts {
        getBankAccounts {
            id
            name
            accountNumber
            balance
            fullName
            createdAt
            updatedAt
        }
    }
`;
