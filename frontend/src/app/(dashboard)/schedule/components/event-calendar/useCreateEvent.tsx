import { CREATE_EVENT, GET_EVENTS } from "@/api/script/schedule/event";
import { CreateEventMutation, CreateEventMutationVariables } from "@/gql/graphql";
import { useMutation } from "@apollo/client";

export const useCreateEvent = () => {
    return useMutation<CreateEventMutation, CreateEventMutationVariables>(CREATE_EVENT, {
        refetchQueries: [GET_EVENTS, 'GetEvents'],
        awaitRefetchQueries: true,
    });
}