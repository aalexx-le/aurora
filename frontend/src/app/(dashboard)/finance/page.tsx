"use client";

import {Expense, GetExpensesQuery, QueryGetExpensesArgs,} from "@/gql/graphql";
import {useQuery} from "@apollo/client";
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";

import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";
import {GET_EXPENSES} from "@/api/script/expense";
import {DateFilterProvider,} from "@/lib/context/date-range.context";
import OverviewTab from "@/app/(dashboard)/finance/components/overview/OverviewTab";
import {BankManager} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import {useFilteredExpenses} from "@/app/(dashboard)/finance/expense/components/expense-table/useFilteredExpenses";
import {useBankManagersQuery} from "@/app/(dashboard)/finance/components/bank-manager-select/useBankManagersQuery";

interface IProps {
    bankManagers: BankManager[];
    expenses: Expense[];
}

function FinancePage({bankManagers, expenses}: IProps) {
    return (
        <OverviewTab bankManagers={bankManagers}/>
    );
}

function FinancePageContainer() {
    const {loading: bankManagerLoading, bankManagers} = useBankManagersQuery();

    const {
        data: expenseData,
        loading: expenseLoading,
    } = useQuery<GetExpensesQuery, QueryGetExpensesArgs>(GET_EXPENSES);

    const expenses = useFilteredExpenses(expenseData?.getExpenses ?? []);

    // TODO: Skeleton
    if (bankManagerLoading || expenseLoading) {
        return <Skeleton/>;
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
