import { GetBankQuery } from "@/gql/graphql";

export type BankManager = GetBankQuery["getBankManagers"][number];

export type BankAccount = BankManager["banks"][number];

export type HistoricalBankBalances = BankAccount["historicalBalances"];

export type BankTransaction = BankAccount["transactions"][number];
