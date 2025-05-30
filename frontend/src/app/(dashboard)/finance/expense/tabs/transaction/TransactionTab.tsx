import { GET_EXPENSE_CATEGORIES } from "@/api/expense/expense-category";
import CreateBankAccountDialog from "@/app/(dashboard)/finance/bank/components/account-list/CreateBankAccountDialog";
import CreateBankManagerDialog from "@/app/(dashboard)/finance/bank/components/manager-list/CreateBankManagerDialog";
import BankManagerSelect from "@/app/(dashboard)/finance/components/bank-manager-select/BankManagerSelect";
import { useTotalBankBalance } from "@/app/(dashboard)/finance/components/overview/useTotalBankBalance";
import BankSummary from "@/app/(dashboard)/finance/expense/components/bank-summary/BankSummary";
import ExpenseCategoryList from "@/app/(dashboard)/finance/expense/components/category-list/ExpenseCategoryList";
import CategoryPieChart from "@/app/(dashboard)/finance/expense/components/category-pie-chart/CategoryPieChart";
import DateFilter from "@/app/(dashboard)/finance/expense/components/date-filter/DateFilter";
import { ResetDateFilterButton } from "@/app/(dashboard)/finance/expense/components/date-filter/ResetDateFilterButton";
import TransactionList from "@/app/(dashboard)/finance/expense/components/transaction-list/TransactionList";
import { BankManager } from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import { Skeleton } from "@/components/ui/skeleton";
import { GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables, } from "@/gql/graphql";
import { useDateFilterContext, } from "@/lib/context/date-range.context";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { bankActions } from "@/state/slices/bank.slice";
import { useQuery } from "@apollo/client";
import { memo, Suspense, useCallback, useEffect, useMemo } from "react";

interface IProps {
    bankManagers: BankManager[];
}

// Memoized components with proper typing
const MemoizedCategoryPieChart = memo(CategoryPieChart);
const MemoizedCategoryList = memo(ExpenseCategoryList);
const MemoizedTransactionList = memo(TransactionList);
const MemoizedBankSummary = memo(BankSummary);

// Full screen skeleton component for categories
const CategorySkeleton = () => (
    <Skeleton className="h-[300px] w-full rounded-md my-4" />
);

// Full screen skeleton component for transaction list
const TransactionSkeleton = () => (
    <Skeleton className="h-[calc(100vh-16rem)] w-full rounded-md" />
);

function TransactionTab({bankManagers}: IProps) {
    const dispatch = useAppDispatch();
    const {user} = useAppSelector((state) => state.auth.state);
    const {bankManager} = useAppSelector((state) => state.bank);
    const {dateRange} = useDateFilterContext();
    const totalBankBalance = useTotalBankBalance(bankManagers);
    
    // Optimize query with fetchPolicy and add proper error handling
    const {loading, data, refetch, error} = useQuery<
        GetExpenseCategoriesQuery,
        GetExpenseCategoriesQueryVariables
    >(GET_EXPENSE_CATEGORIES, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
        errorPolicy: 'all',
    });

    // Use useCallback instead of useMemo for functions
    const handleBankManagerSelect = useCallback((selectedManager: BankManager) => {
        dispatch(bankActions.setBankManager(selectedManager));
    }, [dispatch]);

    useEffect(() => {
        refetch({
            startDate: dateRange?.from,
            endDate: dateRange?.to,
            month: dateRange?.from?.getMonth(),
            year: dateRange?.from?.getFullYear()
        });
    }, [dateRange, user, refetch]);

    // Memoize categories to prevent unnecessary re-renders
    const categories = useMemo(() => {
        return data?.getExpenseCategories ?? [];
    }, [data]);

    // Show error state if query fails
    if (error) {
        return (
            <div className="p-4 rounded-md bg-red-50 border border-red-200">
                <h3 className="text-red-800 font-medium">Error loading expense categories</h3>
                <p className="text-red-600 text-sm">{error.message}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex justify-between gap-4">
                <div className="flex gap-4">
                    <BankManagerSelect 
                        selectedBankManagerId={bankManager?.id}
                        setSelectedBankManager={handleBankManagerSelect}
                    />
                    <CreateBankManagerDialog/>
                    <CreateBankAccountDialog/>
                </div>
                <div className="flex gap-4">
                    <DateFilter/>
                    <ResetDateFilterButton/>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
                <div className="col-span-1 lg:sticky lg:top-4 self-start h-min p-4 rounded-lg border shadow-sm mb-4 lg:mb-0">
                    <MemoizedBankSummary totalBalance={totalBankBalance}/>
                    {loading ? (
                        <CategorySkeleton />
                    ) : (
                        <>
                            <CategoryPieChart categories={categories}/>
                            <MemoizedCategoryList categories={categories}/>
                        </>
                    )}
                </div>
                <div className="col-span-2 p-4 rounded-lg border shadow-sm h-min">
                    <Suspense fallback={<TransactionSkeleton />}>
                        <MemoizedTransactionList />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(TransactionTab);
