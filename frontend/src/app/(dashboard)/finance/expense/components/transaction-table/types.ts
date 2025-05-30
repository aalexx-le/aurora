import { BankManager } from "@/gql/graphql";

export type BankAccount = BankManager["banks"][number];

export type HistoricalBankBalances = BankAccount["historicalBalances"];

export type BankTransaction = BankAccount["transactions"][number];
