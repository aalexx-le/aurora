import { useExpenseCategoriesQuery } from "@/app/(dashboard)/finance/expense/components/category-list/useExpenseCategoriesQuery";
import DateFilter from "@/app/(dashboard)/finance/expense/components/date-filter/DateFilter";
import { ResetDateFilterButton } from "@/app/(dashboard)/finance/expense/components/date-filter/ResetDateFilterButton";
import ExpenseTable from "@/app/(dashboard)/finance/expense/components/expense-table/ExpenseTable";
import { Expense } from "@/app/(dashboard)/finance/expense/components/expense-table/types";
import { Skeleton } from "@/components/ui/skeleton";
import { memo, Suspense, useMemo } from "react";

interface IProps {
    expenses: Expense[];
}

// Memoized components to prevent unnecessary re-renders
const MemoizedExpenseTable = memo(ExpenseTable);

// Full screen skeleton component for expense table
const ExpenseTableSkeleton = () => (
    <Skeleton className="h-[calc(100vh-12rem)] w-full rounded-md" />
);

function ExpenseTab({ expenses }: IProps) {
    const { loading, error } = useExpenseCategoriesQuery();

    // Memoize expenses to prevent unnecessary re-renders
    const memoizedExpenses = useMemo(() => expenses, [expenses]);

    // Show error state if query fails
    if (error) {
        return (
            <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <h3 className="text-red-800 font-medium">Error loading expense data</h3>
                <p className="text-red-600 text-sm">{error.message}</p>
            </div>
        );
    }

    if (loading) {
        return <ExpenseTableSkeleton />;
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex gap-2">
                <DateFilter />
                <ResetDateFilterButton />
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                <Suspense fallback={<ExpenseTableSkeleton />}>
                    <MemoizedExpenseTable expenses={memoizedExpenses} />
                </Suspense>
            </div>
        </div>
    );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(ExpenseTab);
