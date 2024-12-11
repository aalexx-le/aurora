import React from 'react';
import {useAppSelector} from "@/state/hooks";
import {useQuery} from "@apollo/client";
import {GetBankTransactionsQuery, QueryGetBankTransactionsArgs} from "@/gql/graphql";
import {GET_TRANSACTIONS} from "@/api/script/bank";
import {useFilteredTransactions} from "@/app/(dashboard)/finance/expense/components/transaction-list/useFilteredTransactions";
import TransactionItem from "@/app/(dashboard)/finance/expense/components/transaction-list/TransactionItem";
import {CreateExpenseSheet} from "@/app/(dashboard)/finance/expense/components/expense-table/CreateExpenseSheet";
import {useTransactionQuery} from "@/app/(dashboard)/finance/expense/components/transaction-list/useTransactionQuery";

interface IProps {
}

const TransactionList = ({}: IProps) => {
    const data = useTransactionQuery()

    const transactions = useFilteredTransactions(data);

    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex justify-between">
                <h2 className="text-xl font-bold text-muted-foreground tracking-wide">
                    Transactions
                </h2>
            </div>
            <div className="flex flex-col gap-6">
                {transactions.map((txn) => (
                    <div key={txn.id} className="flex gap-4 items-center justify-between rounded-lg">
                        <TransactionItem transaction={txn}/>
                        <CreateExpenseSheet initTransactionId={txn.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionList;