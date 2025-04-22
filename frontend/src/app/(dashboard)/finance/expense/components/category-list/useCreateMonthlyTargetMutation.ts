import {
    CREATE_MONTHLY_TARGET,
    GET_EXPENSE_CATEGORIES,
} from "@/api/scripts/expense/expense-category";
import {
    CreateMonthlyTargetMutation,
    MutationCreateMonthlyTargetArgs,
} from "@/gql/graphql";
import { useToast } from "@/hooks/use-toast";
import { CreateMonthlyTargetInput } from "@/lib/schema/expenseCategory";
import { getGraphqlErrorMessage } from "@/lib/utils/graphql";
import { useMutation } from "@apollo/client";

export const useCreateMonthlyTargetMutation = (
    categoryId: string,
    onSuccess?: () => void,
) => {
    const { toast } = useToast();

    const [createMonthlyTarget, { loading }] = useMutation<
        CreateMonthlyTargetMutation,
        MutationCreateMonthlyTargetArgs
    >(CREATE_MONTHLY_TARGET, {
        refetchQueries: [GET_EXPENSE_CATEGORIES, "GetExpenseCategories"],
        awaitRefetchQueries: true,
    });

    const handleCreateMonthlyTarget = async (
        data: CreateMonthlyTargetInput,
    ) => {
        try {
            await createMonthlyTarget({
                variables: {
                    data: {
                        ...data,
                        categoryId,
                    },
                },
            });
            onSuccess?.();
        } catch (e) {
            toast({
                title: "Fail to create monthly target",
                description: getGraphqlErrorMessage(e),
                variant: "destructive",
            });
            throw e;
        }
    };

    return {
        handleCreateMonthlyTarget,
        loading,
    };
};
