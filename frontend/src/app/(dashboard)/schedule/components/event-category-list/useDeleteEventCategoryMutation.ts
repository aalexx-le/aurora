import { GET_EVENTS } from "@/api/schedule/event";
import {
    GET_EVENT_CATEGORIES,
    REMOVE_EVENT_CATEGORY,
} from "@/api/schedule/event-category";
import {
    RemoveEventCategoryMutation,
    RemoveEventCategoryMutationVariables,
} from "@/gql/graphql";
import { useToast } from "@/hooks/use-toast";
import { getGraphqlErrorMessage } from "@/lib/utils/graphql";
import { useMutation } from "@apollo/client";

export const useDeleteEventCategoryMutation = () => {
    const { toast } = useToast();

    const [removeCategory, { loading }] = useMutation<
        RemoveEventCategoryMutation,
        RemoveEventCategoryMutationVariables
    >(REMOVE_EVENT_CATEGORY, {
        refetchQueries: [GET_EVENT_CATEGORIES, GET_EVENTS],
        awaitRefetchQueries: true,
    });

    const handleDeleteCategory = (id: number) => async () => {
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
