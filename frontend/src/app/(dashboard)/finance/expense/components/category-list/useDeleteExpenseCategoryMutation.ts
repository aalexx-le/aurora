import {
    GET_EXPENSE_CATEGORIES,
    REMOVE_EXPENSE_CATEGORY,
} from "@/api/scripts/expense/expense-category";
import {
    MutationRemoveExpenseCategoryArgs,
    RemoveExpenseCategoryMutation,
} from "@/gql/graphql";
import { useToast } from "@/hooks/use-toast";
import { getGraphqlErrorMessage } from "@/lib/utils/graphql";
import { useMutation } from "@apollo/client";

export const useDeleteExpenseCategoryMutation = () => {
    const { toast } = useToast();

    const [removeCategory, { loading }] = useMutation<
        RemoveExpenseCategoryMutation,
        MutationRemoveExpenseCategoryArgs
    >(REMOVE_EXPENSE_CATEGORY, {
        refetchQueries: [GET_EXPENSE_CATEGORIES, "GetExpenseCategories"],
        awaitRefetchQueries: true,
        onError: (error) => {
            toast({
                title: "Error",
                description:
                    "Cannot delete category because it is being used in expense",
                variant: "destructive",
                duration: 5000,
            });
        },
    });

    const handleDeleteCategory = (id: string) => async () => {
        try {
            await removeCategory({
                variables: { id },
            });
        } catch (e) {
            toast({
                title: "Error",
                description: getGraphqlErrorMessage(e),
                variant: "destructive",
            });
        }
    };

    return {
        handleDeleteCategory,
        loading,
    };
};
