import { GET_EVENTS } from "@/api/schedule/event";
import {
    DELETE_EVENT_RECURRENCE,
    GET_EVENT_RECURRENCES,
} from "@/api/schedule/event-recurrence";
import {
    DeleteRecurrenceTemplateMutation,
    DeleteRecurrenceTemplateMutationVariables,
} from "@/gql/graphql";
import { useMutation } from "@apollo/client";

export const useDeleteEventRecurrenceMutation = () => {
    const [deleteRecurrence, { loading }] = useMutation<
        DeleteRecurrenceTemplateMutation,
        DeleteRecurrenceTemplateMutationVariables
    >(DELETE_EVENT_RECURRENCE, {
        refetchQueries: [GET_EVENT_RECURRENCES, GET_EVENTS],
    });

    const handleDeleteRecurrence = (id: number) => async () => {
        await deleteRecurrence({
            variables: {
                id: Number(id),
            },
        });
    };

    return {
        handleDeleteRecurrence,
        loading,
    };
};
