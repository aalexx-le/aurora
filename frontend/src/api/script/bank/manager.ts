import gql from "graphql-tag";

export const CREATE_BANK_MANAGER = gql`
    mutation CreateBankManager($data: CreateBankManagerInput!) {
        createBankManager(data: $data) {
            id
            name
            createdAt
        }
    }
`;

export const GET_BANK_MANAGERS = gql`
    query GetBankManagers {
        getBankManagers {
            id
            name
            createdAt
            updatedAt
            autoBankManager {
                thirdParty
            }
            banks {
                name
                accountName
                accountNumber
                balance
                historicalBalances {
                    balance
                    time
                }
                createdAt
                updatedAt
            }
        }
    }
`;