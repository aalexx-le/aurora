import { GET_EVENT_RECURRENCES } from "@/api/schedule/event-recurrence";
import {
    GetRecurrenceTemplatesQuery,
    GetRecurrenceTemplatesQueryVariables,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";

export const useEventRecurrencesQuery = () => {
    const { data, error, loading } = useQuery<
        GetRecurrenceTemplatesQuery,
        GetRecurrenceTemplatesQueryVariables
    >(GET_EVENT_RECURRENCES, {
        fetchPolicy: "cache-and-network",
    });

    return {
        recurrences: data?.getRecurrenceTemplates || [],
        error,
        loading,
    };
};
