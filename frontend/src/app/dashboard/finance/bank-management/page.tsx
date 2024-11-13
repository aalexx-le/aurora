"use client";

import {GetBankQuery, GetExpensesQuery, QueryGetBankManagersArgs, QueryGetExpensesArgs,} from "@/gql/graphql";
import {useQuery} from "@apollo/client";
import {useAppSelector} from "@/state/hooks";
import {GET_BANKS} from "@/api/bank";
import {Skeleton} from "@/components/ui/skeleton";
import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import {ConvertCurrencyProvider} from "@/lib/context/convert-currency.context";
import {GET_EXPENSES} from "@/api/expense";
import {Expense} from "@/app/dashboard/finance/bank-management/components/expense-table/types";
import {BankManager} from "@/app/dashboard/finance/bank-management/components/transaction-table/types";
import Overview from "@/app/dashboard/finance/bank-management/features/overview/Overview";
import Details from "@/app/dashboard/finance/bank-management/features/details/Details";
import {DateFilterProvider,} from "@/lib/context/date-range.context";
import {useFilteredExpenses} from "@/app/dashboard/finance/bank-management/useFilteredExpenses";

interface IProps {
    bankManagers: BankManager[];
    expenses: Expense[];
}

const TABS = {
    OVERVIEW: "Overview",
    DATA: "Data",
};

function BankManagement({ bankManagers, expenses }: IProps) {
    return (
        <Tabs defaultValue={TABS.DATA}>
            <TabsList>
                <TabsTrigger value={TABS.OVERVIEW}>{TABS.OVERVIEW}</TabsTrigger>
                <TabsTrigger value={TABS.DATA}>{TABS.DATA}</TabsTrigger>
            </TabsList>
            <TabsContent value={TABS.OVERVIEW}>
                <Overview bankManagers={bankManagers} expenses={expenses} />
            </TabsContent>
            <TabsContent value={TABS.DATA}>
                <Details bankManagers={bankManagers} expenses={expenses} />
            </TabsContent>
        </Tabs>
    );
}

function BankManagementContainer() {
    const { user } = useAppSelector((state) => state.auth.state);

    const { data: bankManagerData, loading: bankManagerLoading } = useQuery<
        GetBankQuery,
        QueryGetBankManagersArgs
    >(GET_BANKS, {
        variables: { userId: Number(user?.id || 0) },
    });

    const {
        data: expenseData,
        loading: expenseLoading,
    } = useQuery<GetExpensesQuery, QueryGetExpensesArgs>(GET_EXPENSES, {
        variables: { userId: Number(user?.id || 0) }, // HARDCODE: number 0 to fix error Message: Variable "$userId" of non-null type "Int!" must not be null., Location: [object Object], Path: undefined
    });

    const expenses = useFilteredExpenses(expenseData?.getExpenses ?? []);

    // TODO: Skeleton
    if (bankManagerLoading || expenseLoading) {
        return <Skeleton />;
    }

    return (
        <BankManagement
            bankManagers={bankManagerData?.getBankManagers ?? []}
            expenses={expenses}
        />
    );
}

export default function BankManagementContainerWithContext() {
    return (
        <ConvertCurrencyProvider baseCurrency="VND">
            <DateFilterProvider>
                <BankManagementContainer />
            </DateFilterProvider>
        </ConvertCurrencyProvider>
    );
}
