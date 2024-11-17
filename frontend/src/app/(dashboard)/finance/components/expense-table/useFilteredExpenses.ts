import { Expense } from "@/app/dashboard/finance/bank-management/components/expense/expense-table/types";
import { useDateFilterContext } from "@/lib/context/date-range.context";
import { useMemo } from "react";

export const useFilteredExpenses = (expenses: Expense[]) => {
    const { dateRange } = useDateFilterContext();

    return useMemo(() => {
        if (!dateRange.from && !dateRange.to) {
            return expenses;
        }
        return expenses.filter((expense) => {
            const date = new Date(expense.createdAt);
            if (dateRange.from && dateRange.to) {
                return date >= dateRange.from && date <= dateRange.to;
            } else if (dateRange.from) {
                return date >= dateRange.from;
            } else if (dateRange.to) {
                return date <= dateRange.to;
            }
            return false;
        });
    }, [dateRange, expenses]);
};
