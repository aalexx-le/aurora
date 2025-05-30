import { gql } from "graphql-tag";

export const GET_EVENTS = gql`
    query GetEvents($startDate: DateTime, $endDate: DateTime) {
        getEvents(startDate: $startDate, endDate: $endDate) {
            id
            name
            startDate
            endDate
            allDay
            color
            description
            category {
                id
                name
                color
            }
            recurrence {
                type
                interval
                daysOfWeek
                dayOfMonth
                weekOfMonth
                dayOfWeek
                endDate
                endCount
            }
        }
    }
`;

export const CREATE_EVENT = gql`
    mutation CreateEvent($data: CreateEventInput!) {
        createEvent(data: $data) {
            id
            name
            startDate
            endDate
            category {
                id
            }
            recurrence {
                id
            }
        }
    }
`;

export const UPDATE_EVENT = gql`
    mutation UpdateEvent($id: Int!, $data: UpdateEventInput!) {
        updateEvent(id: $id, data: $data) {
            id
            name
            startDate
            endDate
        }
    }
`;

export const REMOVE_EVENT = gql`
    mutation RemoveEvent($id: Int!) {
        removeEvent(id: $id) {
            id
        }
    }
`;
