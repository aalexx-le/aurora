import {useTransactionQuery} from "@/app/(dashboard)/finance/expense/components/transaction-list/useTransactionQuery";
import {useMemo} from "react";
import {UseFormReturn} from "react-hook-form";
import {CreateExpenseInput} from "@/lib/schema/expense";

export const useReviewTransaction = (form: UseFormReturn<CreateExpenseInput>) => {
    const transactions = useTransactionQuery()
    const [reviewTransactionId] = form.watch(["bankTransactionId"]);
    const reviewTransaction = useMemo(
        () => transactions.find((txn) => txn.id === reviewTransactionId),
        [transactions, reviewTransactionId]
    );

    return reviewTransaction;
}