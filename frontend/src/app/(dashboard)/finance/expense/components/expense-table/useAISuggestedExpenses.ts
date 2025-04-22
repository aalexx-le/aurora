import { GET_SUGGESTED_EXPENSES } from "@/api/scripts/expense/expense";
import {
    GetSuggestedExpensesQuery,
    GetSuggestedExpensesQueryVariables,
} from "@/gql/graphql";
import { CreateExpenseInput } from "@/lib/schema/expense";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

export const useAISuggestExpenses = (
    form: UseFormReturn<CreateExpenseInput>,
) => {
    const { data } = useQuery<
        GetSuggestedExpensesQuery,
        GetSuggestedExpensesQueryVariables
    >(GET_SUGGESTED_EXPENSES, {
        variables: {
            data: {
                bankTransactionId: form.getValues("bankTransactionId"),
            },
        },
    });

    useEffect(() => {
        if (!data || !data.getSuggestedExpenses) return;

        const suggestedExpense = data.getSuggestedExpenses;

        form.reset(suggestedExpense[0] as CreateExpenseInput);
    }, [data, form]);

    return data?.getSuggestedExpenses || [];
};
