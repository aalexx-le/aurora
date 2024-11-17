import { GetHistoricalBalancesQuery } from "@/gql/graphql";

export type HistoricalCryptoBalance =
    GetHistoricalBalancesQuery["getHistoricalBalances"][number];
