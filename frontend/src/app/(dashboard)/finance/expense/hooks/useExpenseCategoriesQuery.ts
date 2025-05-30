import { GET_EXPENSE_CATEGORIES } from "@/api/expense/expense-category";
import {
    GetExpenseCategoriesQuery,
    GetExpenseCategoriesQueryVariables,
} from "@/gql/graphql";
import { useDateFilterContext } from "@/lib/context/date-range.context";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

export const useExpenseCategoriesQuery = () => {
    const { dateRange } = useDateFilterContext();

    const { data, loading, refetch, error } = useQuery<
        GetExpenseCategoriesQuery,
        GetExpenseCategoriesQueryVariables
    >(GET_EXPENSE_CATEGORIES, {
        fetchPolicy: "cache-and-network",
        notifyOnNetworkStatusChange: true,
        errorPolicy: "all",
    });

    useEffect(() => {
        refetch({
            startDate: dateRange?.from,
            endDate: dateRange?.to,
            month: dateRange?.from?.getMonth(),
            year: dateRange?.from?.getFullYear(),
        });
    }, [dateRange, refetch]);

    const categories = data?.getExpenseCategories || [];

    return {
        categories,
        loading,
        error,
        refetch,
    };
};
