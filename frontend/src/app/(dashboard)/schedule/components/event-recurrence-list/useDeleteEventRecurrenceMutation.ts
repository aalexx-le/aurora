import { gql, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { EventRecurrence } from "./types";
import {
    DELETE_EVENT_RECURRENCE,
    GET_EVENT_RECURRENCES,
} from "@/api/scripts/schedule/event-recurrence";
import {
    DeleteRecurrenceTemplateMutation,
    DeleteRecurrenceTemplateMutationVariables,
} from "@/gql/graphql";
import { GET_EVENTS } from "@/api/scripts/schedule/event";

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
