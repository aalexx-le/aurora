import { GetEventCategoriesQuery } from "@/gql/graphql";

export type EventCategory =
    GetEventCategoriesQuery["getEventCategories"][number];
