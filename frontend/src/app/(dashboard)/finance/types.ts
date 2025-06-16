import {
    GetBankManagersQuery,
} from "@/gql/graphql";

export type BankManager = GetBankManagersQuery['getBankManagers'][number];

export type HistoricalBalances = GetBankManagersQuery['getBankManagers'][number]['banks'][number]['historicalBalances'];