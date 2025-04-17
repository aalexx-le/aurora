import { GET_BANK_ACCOUNTS } from "@/api/script/bank/account";
import { GET_BANK_MANAGERS } from "@/api/script/bank/manager";
import { GET_BANK_TRANSACTIONS, REMOVE_BANK_TRANSACTION } from "@/api/script/bank/transaction";
import { GET_EXPENSES } from "@/api/script/expense/expense";
import {
    AutoCreateExpenseSheet
} from "@/app/(dashboard)/finance/expense/components/expense-table/AutoCreateExpenseSheet";
import { CreateExpenseSheet } from "@/app/(dashboard)/finance/expense/components/expense-table/CreateExpenseSheet";
import {
    TransactionActionButton,
    TransactionRowActionType,
    TransactionRowActionUnionType
} from "@/app/(dashboard)/finance/expense/components/transaction-list/TransactionActionButton";
import TransactionItem from "@/app/(dashboard)/finance/expense/components/transaction-list/TransactionItem";
import {
    useFilteredTransactions
} from "@/app/(dashboard)/finance/expense/components/transaction-list/useFilteredTransactions";
import { useTransactionQuery } from "@/app/(dashboard)/finance/expense/components/transaction-list/useTransactionQuery";
import { DeleteDialog } from "@/app/(dashboard)/finance/expense/components/transaction-table/DeleteDialog";
import { BankTransaction } from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import { RemoveBankTransactionMutation, RemoveBankTransactionMutationVariables } from "@/gql/graphql";
import { useMutation } from "@apollo/client";
import { useState } from 'react';
import CreateTransactionDialog from './CreateTransactionDialog';

interface IProps {
}

const TransactionList = ({}: IProps) => {
    const [action, setAction] =
        useState<TransactionRowActionUnionType | null>(null);
    const [txn, setTxn] = useState<BankTransaction | null>(null);
    const data = useTransactionQuery()
    const transactions = useFilteredTransactions(data);
    const [removeTransaction] = useMutation<RemoveBankTransactionMutation, RemoveBankTransactionMutationVariables>(REMOVE_BANK_TRANSACTION, {
        refetchQueries: [GET_BANK_TRANSACTIONS, GET_BANK_MANAGERS, GET_BANK_ACCOUNTS, GET_EXPENSES],
    });

    const handleDelete = async () => {
        if (txn) {
            await removeTransaction({
                variables: { id: txn.id }
            });
            setTxn(null);
        }
    };

    console.log({transactions, data})

    return (
        <div className="flex flex-col gap-4 ">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-muted-foreground tracking-wide">
                    Transactions
                </h2>
                <CreateTransactionDialog />
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
                        <DeleteDialog
                            open={action === TransactionRowActionType.DELETE}
                            onOpenChange={() => setTxn(null)}
                            rows={[txn]}
                            showTrigger={false}
                            onDelete={handleDelete}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default TransactionList;