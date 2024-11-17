import { useDateFilterContext } from "@/lib/context/date-range.context";
import { useMemo } from "react";
import { BankTransaction } from "@/app/dashboard/finance/bank-management/components/transaction-table/types";

export const useFilteredTransactions = (transactions: BankTransaction[]) => {
    const { dateRange } = useDateFilterContext();
    return useMemo(() => {
        if (!dateRange.from && !dateRange.to) {
            return transactions;
        }
        return transactions.filter((transaction: BankTransaction) => {
            const date = new Date(transaction.createdAt);
            if (dateRange.from && dateRange.to) {
                return date >= dateRange.from && date <= dateRange.to;
            } else if (dateRange.from) {
                return date >= dateRange.from;
            } else if (dateRange.to) {
                return date <= dateRange.to;
            }
            return false;
        });
    }, [dateRange, transactions]);
};
