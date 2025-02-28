import { useQuery } from "@apollo/client";
import {
    GetBankTransactionsQuery,
    QueryGetBankTransactionsArgs,
} from "@/gql/graphql";
import { useAppSelector } from "@/state/hooks";
import {GET_BANK_TRANSACTIONS} from "@/api/script/bank/transaction";

export const useTransactionQuery = () => {
    const { user } = useAppSelector((state) => state.auth.state);
    const { data } = useQuery<
        GetBankTransactionsQuery,
        QueryGetBankTransactionsArgs
    >(GET_BANK_TRANSACTIONS, {
        variables: { userId: Number(user?.id ?? 0) },
    });

    return data?.getBankTransactions ?? [];
};
