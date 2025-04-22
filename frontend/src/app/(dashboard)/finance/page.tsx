"use client";

import { GetExpensesQuery, QueryGetExpensesArgs } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { Suspense, lazy } from "react";

import { GET_EXPENSES } from "@/api/scripts/expense/expense";
import { useBankManagersQuery } from "@/app/(dashboard)/finance/components/bank-manager-select/useBankManagersQuery";
import {
    FinancePageSkeleton
} from "@/app/(dashboard)/finance/components/skeletons";
import { useFilteredExpenses } from "@/app/(dashboard)/finance/expense/components/expense-table/useFilteredExpenses";
import { BankManager } from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import { ConvertCurrencyProvider } from "@/lib/context/convert-currency.context";
import { DateFilterProvider, } from "@/lib/context/date-range.context";
import { Expense } from "./expense/components/expense-table/types";

// Lazy load the OverviewTab component
const OverviewTab = lazy(() => import("@/app/(dashboard)/finance/components/overview/OverviewTab"));

interface IProps {
    bankManagers: BankManager[];
    expenses: Expense[];
}

function FinancePage({bankManagers, expenses}: IProps) {
    return (
        <Suspense fallback={<FinancePageSkeleton />}>
            <OverviewTab bankManagers={bankManagers}/>
        </Suspense>
    );
}

function FinancePageContainer() {
    const {loading: bankManagerLoading, bankManagers} = useBankManagersQuery();

    const {
        data: expenseData,
        loading: expenseLoading,
    } = useQuery<GetExpensesQuery, QueryGetExpensesArgs>(GET_EXPENSES);

    const expenses = useFilteredExpenses(expenseData?.getExpenses ?? []);

    if (bankManagerLoading || expenseLoading) {
        return <FinancePageSkeleton />;
    }

    return (
        <FinancePage
            bankManagers={bankManagers}
            expenses={expenses}
        />
    );
}

export default function FinancePageContainerWithContext() {
    return (
        <ConvertCurrencyProvider baseCurrency="VND">
            <DateFilterProvider>
                <FinancePageContainer/>
            </DateFilterProvider>
        </ConvertCurrencyProvider>
    );
}
