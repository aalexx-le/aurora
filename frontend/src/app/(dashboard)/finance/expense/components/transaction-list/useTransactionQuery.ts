import { GET_BANK_TRANSACTIONS } from "@/api/scripts/bank/transaction";
import {
    GetBankTransactionsQuery,
    GetBankTransactionsQueryVariables,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";

export const useTransactionQuery = () => {
    const { data } = useQuery<
        GetBankTransactionsQuery,
        GetBankTransactionsQueryVariables
    >(GET_BANK_TRANSACTIONS);

    return data?.getBankTransactions ?? [];
};
