"use client";

import { GetExpensesQuery, QueryGetExpensesArgs } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { Suspense } from "react";

import { GET_EXPENSES } from "@/api/expense/expense";
import { useBankManagersQuery } from "@/app/(dashboard)/finance/components/bank-manager-select/useBankManagersQuery";
import OverviewPage from "@/app/(dashboard)/finance/components/overview/OverviewPage";
import {
    FinancePageSkeleton
} from "@/app/(dashboard)/finance/components/skeletons";
import { useFilteredExpenses } from "@/app/(dashboard)/finance/expense/hooks/useFilteredExpenses";
import { ConvertCurrencyProvider } from "@/lib/context/convert-currency.context";
import { DateFilterProvider, } from "@/lib/context/date-range.context";
import { Expense } from "./expense/components/expense-table/types";
import { BankManager } from "./types";
// Lazy load the OverviewTab component


interface IProps {
    bankManagers: BankManager[];
    expenses: Expense[];
}

function FinancePage({bankManagers, expenses}: IProps) {
    return (
        <Suspense fallback={<FinancePageSkeleton />}>
            <OverviewPage bankManagers={bankManagers}/>
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
