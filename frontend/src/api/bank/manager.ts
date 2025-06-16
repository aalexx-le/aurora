import { graphql } from "@/gql/gql";

export const CREATE_BANK_MANAGER = graphql(`
    mutation CreateBankManager($data: CreateBankManagerInput!) {
        createBankManager(data: $data) {
            id
            name
            createdAt
        }
    }
`);

export const GET_BANK_MANAGERS = graphql(`
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
`);
