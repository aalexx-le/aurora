"use client";

import {Expense, GetBankQuery, GetExpensesQuery, QueryGetBankManagersArgs, QueryGetExpensesArgs,} from "@/gql/graphql";
import {useQuery} from "@apollo/client";
import {useAppSelector} from "@/state/hooks";
import {GET_BANKS} from "@/api/script/bank";
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";

import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";
import {GET_EXPENSES} from "@/api/script/expense";
import {DateFilterProvider,} from "@/lib/context/date-range.context";
import OverviewTab from "@/app/(dashboard)/finance/components/overview/OverviewTab";
import {BankManager} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import {useFilteredExpenses} from "@/app/(dashboard)/finance/expense/components/expense-table/useFilteredExpenses";

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
    const {user} = useAppSelector((state) => state.auth.state);

    const {data: bankManagerData, loading: bankManagerLoading} = useQuery<
        GetBankQuery,
        QueryGetBankManagersArgs
    >(GET_BANKS, {
        variables: {userId: Number(user?.id || 0)},
    });

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
            bankManagers={bankManagerData?.getBankManagers ?? []}
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
