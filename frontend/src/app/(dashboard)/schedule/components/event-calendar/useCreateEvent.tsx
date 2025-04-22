import { CREATE_EVENT, GET_EVENTS } from "@/api/scripts/schedule/event";
import { GET_EVENT_RECURRENCES } from "@/api/scripts/schedule/event-recurrence";
import { CreateEventMutation, CreateEventMutationVariables } from "@/gql/graphql";
import { useMutation } from "@apollo/client";

export const useCreateEvent = () => {
    return useMutation<CreateEventMutation, CreateEventMutationVariables>(CREATE_EVENT, {
        refetchQueries: [GET_EVENTS, 'GetEvents', GET_EVENT_RECURRENCES, 'GetEventRecurrences'],
        awaitRefetchQueries: true,
    });
}