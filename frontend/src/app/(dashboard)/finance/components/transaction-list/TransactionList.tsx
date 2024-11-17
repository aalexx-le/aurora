import React from 'react';
import {useAppSelector} from "@/state/hooks";
import {useQuery} from "@apollo/client";
import {GetBankTransactionsQuery, QueryGetBankTransactionsArgs} from "@/gql/graphql";
import {GET_TRANSACTIONS} from "@/api/bank";
import {useFilteredTransactions} from "@/app/(dashboard)/finance/components/transaction-list/useFilteredTransactions";
import TransactionItem from "@/app/(dashboard)/finance/components/transaction-list/TransactionItem";
import {CreateExpenseSheet} from "@/app/(dashboard)/finance/components/expense-table/CreateExpenseSheet";

interface IProps {
}

const TransactionList = ({}: IProps) => {
    const {user} = useAppSelector((state) => state.auth.state);
    const {data} = useQuery<GetBankTransactionsQuery, QueryGetBankTransactionsArgs>(GET_TRANSACTIONS, {
        variables: {userId: Number(user?.id ?? 0)},
    });

    const transactions = useFilteredTransactions(data?.getBankTransactions ?? []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold text-muted-foreground tracking-wide">
                    Transactions
                </h2>
            </div>
            <div className="flex flex-col gap-6">
                {transactions.map((txn) => (
                    <div key={txn.id} className="flex gap-4 items-center justify-between rounded-lg">
                        <TransactionItem transaction={txn}/>
                        <CreateExpenseSheet transaction={txn} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;