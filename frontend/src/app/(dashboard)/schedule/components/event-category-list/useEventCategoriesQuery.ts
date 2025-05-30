import { GET_EVENT_CATEGORIES } from "@/api/schedule/event-category";
import {
    GetEventCategoriesQuery,
    GetEventCategoriesQueryVariables,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";

export const useEventCategoriesQuery = () => {
    const { data, loading } = useQuery<
        GetEventCategoriesQuery,
        GetEventCategoriesQueryVariables
    >(GET_EVENT_CATEGORIES);

    const categories = data?.getEventCategories || [];

    return {
        categories,
        loading,
    };
};
