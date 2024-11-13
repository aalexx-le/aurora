import {BankManager} from "@/app/dashboard/finance/bank-management/components/transaction-table/types";
import {Expense} from "@/app/dashboard/finance/bank-management/components/expense-table/types";
import DateFilter from "@/app/dashboard/finance/bank-management/components/date-filter/DateFilter";
import BankSummary from "@/app/dashboard/finance/bank-management/components/bank-summary/BankSummary";
import CategoryList from "@/app/dashboard/finance/bank-management/components/category-list/CategoryList";
import TransactionList from "@/app/dashboard/finance/bank-management/components/transaction-list/TransactionList";
import ExpenseTable from "@/app/dashboard/finance/bank-management/components/expense-table/ExpenseTable";
import React, {useEffect} from "react";
import {useTotalBankBalance} from "@/app/dashboard/finance/bank-management/features/overview/useTotalBankBalance";
import CategoryPieChart from "@/app/dashboard/finance/bank-management/components/category-pie-chart/CategoryPieChart";
import {useQuery} from "@apollo/client";
import {GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables,} from "@/gql/graphql";
import {GET_EXPENSE_CATEGORIES} from "@/api/expense-category";
import {Skeleton} from "@/components/ui/skeleton";
import {useAppSelector} from "@/state/hooks";
import {useDateFilterContext,} from "@/lib/context/date-range.context";

interface IProps {
    bankManagers: BankManager[];
    expenses: Expense[];
}

export default function Details({ bankManagers, expenses }: IProps) {
    const { user } = useAppSelector((state) => state.auth.state);
    const { dateRange } = useDateFilterContext();
    const totalBankBalance = useTotalBankBalance(bankManagers);
    const { loading, data, refetch } = useQuery<
        GetExpenseCategoriesQuery,
        GetExpenseCategoriesQueryVariables
    >(GET_EXPENSE_CATEGORIES, {
        variables: {
            userId: Number(user?.id),
        },
    });

    useEffect(() => {
        refetch({
            userId: Number(user?.id),
            startDate: dateRange?.from,
            endDate: dateRange?.to,
        });
    }, [dateRange, user, refetch]);

    const categories = data?.getExpenseCategories ?? [];

    if (loading) {
        return <Skeleton className="w-full h-full" />;
    }

    return (
        <div className="flex flex-1 flex-col gap-4 mt-4">
            <div className="flex gap-4">
                <DateFilter />
            </div>
            <div className="flex gap-4">
                <div className="flex grow-0 flex-col gap-4">
                    <div className="p-4 rounded-lg border shadow-sm">
                        <BankSummary totalBalance={totalBankBalance} />
                        <CategoryPieChart categories={categories} />
                        <CategoryList categories={categories} />
                    </div>
                </div>
                <div className="flex-1 flex-col flex gap-4">
                    <ExpenseTable expenses={expenses} />
                    <div className="p-4 rounded-lg border shadow-sm">
                        <TransactionList />
                    </div>
                </div>
            </div>
        </div>
    );
}
