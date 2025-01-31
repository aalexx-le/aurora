import {useQuery} from "@apollo/client";
import {GetSuggestedExpensesQuery, GetSuggestedExpensesQueryVariables} from "@/gql/graphql";
import {GET_SUGGESTED_EXPENSES} from "@/api/script/expense";
import {useEffect} from "react";
import {CreateExpenseInput} from "@/lib/schema/expense";
import {UseFormReturn} from "react-hook-form";

export const useAISuggestExpenses = (form: UseFormReturn<CreateExpenseInput>) => {
    const {data} = useQuery<GetSuggestedExpensesQuery, GetSuggestedExpensesQueryVariables>(GET_SUGGESTED_EXPENSES, {
        variables: {
            bankTransactionId: form.getValues("bankTransactionId"),
        }
    })

    useEffect(() => {
        if (!data || !data.getSuggestedExpenses) return;

        const suggestedExpense = data.getSuggestedExpenses;

        form.reset(suggestedExpense[0] as CreateExpenseInput);

    }, [data?.getSuggestedExpenses, form]);

    return data?.getSuggestedExpenses || [];
}