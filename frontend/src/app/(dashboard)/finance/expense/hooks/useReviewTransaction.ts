import { useTransactionQuery } from "@/app/(dashboard)/finance/expense/hooks/useTransactionQuery";
import { CreateExpenseInput } from "@/lib/schema/expense";
import { useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

export const useReviewTransaction = (
    form: UseFormReturn<CreateExpenseInput>,
) => {
    const transactions = useTransactionQuery();
    const [reviewTransactionId] = form.watch(["bankTransactionId"]);
    const reviewTransaction = useMemo(
        () => transactions.find((txn) => txn.id === reviewTransactionId),
        [transactions, reviewTransactionId],
    );

    return reviewTransaction;
};
