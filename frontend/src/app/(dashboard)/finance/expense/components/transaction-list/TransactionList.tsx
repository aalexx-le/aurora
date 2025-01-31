import React, {useState} from 'react';
import {
    useFilteredTransactions
} from "@/app/(dashboard)/finance/expense/components/transaction-list/useFilteredTransactions";
import TransactionItem from "@/app/(dashboard)/finance/expense/components/transaction-list/TransactionItem";
import {CreateExpenseSheet} from "@/app/(dashboard)/finance/expense/components/expense-table/CreateExpenseSheet";
import {useTransactionQuery} from "@/app/(dashboard)/finance/expense/components/transaction-list/useTransactionQuery";
import {
    TransactionActionButton,
    TransactionRowActionType,
    TransactionRowActionUnionType
} from "@/app/(dashboard)/finance/expense/components/transaction-list/TransactionActionButton";
import {BankTransaction} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import {
    AutoCreateExpenseSheet
} from "@/app/(dashboard)/finance/expense/components/expense-table/AutoCreateExpenseSheet";

interface IProps {
}

const TransactionList = ({}: IProps) => {
    const [action, setAction] =
        useState<TransactionRowActionUnionType | null>(null);
    const [txn, setTxn] = useState<BankTransaction | null>(null);
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
                        <TransactionActionButton
                            row={txn}
                            setAction={(t) => {
                                setAction(t)
                                setTxn(txn)
                            }}
                        />
                    </div>
                ))}

                {txn && (
                    <>
                        <AutoCreateExpenseSheet
                            initTransactionId={txn.id}
                            open={action === TransactionRowActionType.CREATE_FROM_AI_SUGGESTION}
                            onOpenChange={() => setAction(null)}
                        />
                        <CreateExpenseSheet
                            initTransactionId={txn.id}
                            open={action === TransactionRowActionType.CREATE}
                            onOpenChange={() => setAction(null)}
                        />
                    </>
                )}

            </div>
        </div>
    );
};

export default TransactionList;