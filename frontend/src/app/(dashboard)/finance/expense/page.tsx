"use client";

import {Expense, GetBankQuery, GetExpensesQuery, QueryGetBankManagersArgs, QueryGetExpensesArgs,} from "@/gql/graphql";
import {useQuery} from "@apollo/client";
import {useAppSelector} from "@/state/hooks";
import {GET_BANKS} from "@/api/script/bank";
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";
import {GET_EXPENSES} from "@/api/script/expense";
import {DateFilterProvider,} from "@/lib/context/date-range.context";
import OverviewTab from "@/app/(dashboard)/finance/components/overview/OverviewTab";
import {BankManager} from "@/app/(dashboard)/finance/expense/components/transaction-table/types";
import TransactionTab from "@/app/(dashboard)/finance/expense/tabs/transaction/TransactionTab";
import ExpenseTab from "@/app/(dashboard)/finance/expense/tabs/expense/ExpenseTab";
import {useFilteredExpenses} from "@/app/(dashboard)/finance/expense/components/expense-table/useFilteredExpenses";

interface IProps {
    bankManagers: BankManager[];
    expenses: Expense[];
}

const TABS = {
    OVERVIEW: "Overview",
    TRANSACTION: "Transaction",
    EXPENSE: "Expense",
};

function ExpensePage({bankManagers, expenses}: IProps) {
    return (
        <Tabs defaultValue={TABS.TRANSACTION}>
            <TabsList className="mb-2">
                <TabsTrigger value={TABS.TRANSACTION}>{TABS.TRANSACTION}</TabsTrigger>
                <TabsTrigger value={TABS.EXPENSE}>{TABS.EXPENSE}</TabsTrigger>
            </TabsList>
            <TabsContent value={TABS.TRANSACTION}>
                <TransactionTab bankManagers={bankManagers}/>
            </TabsContent>
            <TabsContent value={TABS.EXPENSE}>
                <ExpenseTab expenses={expenses}/>
            </TabsContent>
        </Tabs>
    );
}

function ExpensePageContainer() {
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
    } = useQuery<GetExpensesQuery, QueryGetExpensesArgs>(GET_EXPENSES, {
        variables: {userId: Number(user?.id || 0)}, // HARDCODE: number 0 to fix error Message: Variable "$userId" of non-null type "Int!" must not be null., Location: [object Object], Path: undefined
    });

    const expenses = useFilteredExpenses(expenseData?.getExpenses ?? []);

    // TODO: Skeleton
    if (bankManagerLoading || expenseLoading) {
        return <Skeleton/>;
    }

    return (
        <ExpensePage
            bankManagers={bankManagerData?.getBankManagers ?? []}
            expenses={expenses}
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
