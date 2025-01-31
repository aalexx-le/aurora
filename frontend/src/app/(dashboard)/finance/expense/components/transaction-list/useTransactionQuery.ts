import { useQuery } from "@apollo/client";
import {
    GetBankTransactionsQuery,
    QueryGetBankTransactionsArgs,
} from "@/gql/graphql";
import { GET_TRANSACTIONS } from "@/api/script/bank";
import { useAppSelector } from "@/state/hooks";

export const useTransactionQuery = () => {
    const { user } = useAppSelector((state) => state.auth.state);
    const { data } = useQuery<
        GetBankTransactionsQuery,
        QueryGetBankTransactionsArgs
    >(GET_TRANSACTIONS, {
        variables: { userId: Number(user?.id ?? 0) },
    });

    return data?.getBankTransactions ?? [];
};
