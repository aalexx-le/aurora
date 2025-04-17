import { GetEventsQuery } from "@/gql/graphql";

export type Event = GetEventsQuery["getEvents"][number];
