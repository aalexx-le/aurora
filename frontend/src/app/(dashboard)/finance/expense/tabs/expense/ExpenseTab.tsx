import { GET_EXPENSE_CATEGORIES } from "@/api/script/expense/expense-category";
import DateFilter from "@/app/(dashboard)/finance/expense/components/date-filter/DateFilter";
import { ResetDateFilterButton } from "@/app/(dashboard)/finance/expense/components/date-filter/ResetDateFilterButton";
import ExpenseTable from "@/app/(dashboard)/finance/expense/components/expense-table/ExpenseTable";
import { Expense } from "@/app/(dashboard)/finance/expense/components/expense-table/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables, } from "@/gql/graphql";
import { useDateFilterContext, } from "@/lib/context/date-range.context";
import { useAppSelector } from "@/state/hooks";
import { useQuery } from "@apollo/client";
import { memo, Suspense, useEffect, useMemo } from "react";

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
    const { user } = useAppSelector((state) => state.auth.state);
    const { dateRange } = useDateFilterContext();
    
    // Optimize query with fetchPolicy and add error handling
    const { loading, data, refetch, error } = useQuery<
        GetExpenseCategoriesQuery,
        GetExpenseCategoriesQueryVariables
    >(GET_EXPENSE_CATEGORIES, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all',
    });

    useEffect(() => {
        refetch({
            startDate: dateRange?.from,
            endDate: dateRange?.to,
        });
    }, [dateRange, user, refetch]);

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
