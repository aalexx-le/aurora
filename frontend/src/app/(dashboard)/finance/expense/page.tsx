"use client";

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {
    GetBankManagersQuery,
    GetBankManagersQueryVariables,
    GetExpensesQuery,
    QueryGetExpensesArgs
} from "@/gql/graphql";
import {useQuery} from "@apollo/client";
import {lazy, Suspense, useMemo} from "react";

import {GET_BANK_MANAGERS} from "@/api/script/bank/manager";
import {GET_EXPENSES} from "@/api/script/expense/expense";
import {
    CalendarTabSkeleton,
    ExpenseTabSkeleton,
    TransactionTabSkeleton
} from "@/app/(dashboard)/finance/expense/components/skeletons";
import {BankManager} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";
import {DateFilterProvider, useDateFilterContext,} from "@/lib/context/date-range.context";
import {Expense} from "./components/expense-table/types";

// Lazy load tab components for code splitting
const TransactionTab = lazy(() => import("@/app/(dashboard)/finance/expense/tabs/transaction/TransactionTab"));
const ExpenseTab = lazy(() => import("@/app/(dashboard)/finance/expense/tabs/expense/ExpenseTab"));
const ExpenseCalendarTab = lazy(() => import("@/app/(dashboard)/finance/expense/tabs/calendar/ExpenseCalendarTab"));

interface IProps {
    bankManagers: BankManager[];
    expenses: Expense[];
    loading: boolean;
}

const TABS = {
    OVERVIEW: "Overview",
    TRANSACTION: "Transaction",
    EXPENSE: "Expense",
    CALENDAR: "Calendar",
};

// Memoized tab component to prevent unnecessary re-renders
function ExpensePage({bankManagers, expenses, loading}: IProps) {
    return (
        <Tabs defaultValue={TABS.TRANSACTION}>
            <TabsList className="mb-2">
                <TabsTrigger value={TABS.TRANSACTION}>{TABS.TRANSACTION}</TabsTrigger>
                <TabsTrigger value={TABS.EXPENSE}>{TABS.EXPENSE}</TabsTrigger>
                <TabsTrigger value={TABS.CALENDAR}>{TABS.CALENDAR}</TabsTrigger>
            </TabsList>
            <Suspense fallback={
                <>
                    <TabsContent value={TABS.TRANSACTION}>
                        <TransactionTabSkeleton/>
                    </TabsContent>
                    <TabsContent value={TABS.EXPENSE}>
                        <ExpenseTabSkeleton/>
                    </TabsContent>
                    <TabsContent value={TABS.CALENDAR}>
                        <CalendarTabSkeleton/>
                    </TabsContent>
                </>
            }>
                <TabsContent value={TABS.TRANSACTION}>
                    <TransactionTab bankManagers={bankManagers}/>
                </TabsContent>
                <TabsContent value={TABS.EXPENSE}>
                    <ExpenseTab expenses={expenses}/>
                </TabsContent>
                <TabsContent value={TABS.CALENDAR}>
                    <ExpenseCalendarTab/>
                </TabsContent>
            </Suspense>
        </Tabs>
    );
}

function ExpensePageContainer() {
    const {dateRange} = useDateFilterContext();

    // Use fetchPolicy to optimize Apollo Client caching
    const {data: bankManagerData, loading: bankManagerLoading} = useQuery<
        GetBankManagersQuery,
        GetBankManagersQueryVariables
    >(GET_BANK_MANAGERS, {
        fetchPolicy: 'cache-first',
    });

    const {
        data: expenseData,
        loading: expenseLoading,
    } = useQuery<GetExpensesQuery, QueryGetExpensesArgs>(GET_EXPENSES, {
        variables: {
            startDate: dateRange.from,
            endDate: dateRange.to,
        },
        fetchPolicy: 'cache-and-network',
    });

    // Memoize expenses to prevent unnecessary re-renders
    const expenses = useMemo(() => {
        return expenseData?.getExpenses ?? [];
    }, [expenseData]);

    // Memoize bankManagers to prevent unnecessary re-renders
    const bankManagers = useMemo(() => {
        return bankManagerData?.getBankManagers ?? [];
    }, [bankManagerData]);

    return (
        <ExpensePage
            bankManagers={bankManagers}
            expenses={expenses}
            loading={bankManagerLoading || expenseLoading}
        />
    );
}

export default function ExpensePageContainerWithContext() {
    return (
        <ConvertCurrencyProvider baseCurrency="VND">
            <DateFilterProvider>
                <ExpensePageContainer/>
            </DateFilterProvider>
        </ConvertCurrencyProvider>
    );
}
