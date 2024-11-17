import React, {useEffect} from "react";
import {useQuery} from "@apollo/client";
import {GetExpenseCategoriesQuery, GetExpenseCategoriesQueryVariables,} from "@/gql/graphql";
import {GET_EXPENSE_CATEGORIES} from "@/api/expense-category";
import {Skeleton} from "@/components/ui/skeleton";
import {useAppSelector} from "@/state/hooks";
import {useDateFilterContext,} from "@/lib/context/date-range.context";
import {Expense} from "@/app/(dashboard)/finance/components/expense-table/types";
import DateFilter from "@/app/(dashboard)/finance/components/date-filter/DateFilter";
import ExpenseTable from "@/app/(dashboard)/finance/components/expense-table/ExpenseTable";

interface IProps {
    expenses: Expense[];
}

export default function ExpenseTab({ expenses }: IProps) {
    const { user } = useAppSelector((state) => state.auth.state);
    const { dateRange } = useDateFilterContext();
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

    if (loading) {
        return <Skeleton className="w-full h-full" />;
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
            <div className="flex gap-4">
                <DateFilter />
            </div>
            <div className="flex flex-col lg:flex-row gap-4">
                <ExpenseTable expenses={expenses} />
            </div>
        </div>
    );
}
