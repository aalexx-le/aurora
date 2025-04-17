import { useQuery } from "@apollo/client";
import {
    GetBankTransactionsQuery,
    GetBankTransactionsQueryVariables,
} from "@/gql/graphql";
import { GET_BANK_TRANSACTIONS } from "@/api/script/bank/transaction";

export const useTransactionQuery = () => {
    const { data } = useQuery<
        GetBankTransactionsQuery,
        GetBankTransactionsQueryVariables
    >(GET_BANK_TRANSACTIONS);

    return data?.getBankTransactions ?? [];
};
