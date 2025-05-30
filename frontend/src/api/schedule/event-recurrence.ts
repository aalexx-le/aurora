import { gql } from "graphql-tag";

export const GET_EVENT_RECURRENCES = gql`
    query GetRecurrenceTemplates {
        getRecurrenceTemplates {
            id
            type
            interval
            daysOfWeek
            dayOfMonth
            weekOfMonth
            dayOfWeek
            endDate
            endCount
            userId
            createdAt
            updatedAt
            events {
                id
                name
                description
                startDate
                endDate
                allDay
                color
                categoryId
                reminderMinutes
                category {
                    id
                    name
                    color
                }
            }
        }
    }
`;

export const GET_EVENT_RECURRENCE = gql`
    query GetRecurrenceTemplate($id: Int!) {
        getRecurrenceTemplate(id: $id) {
            id
            type
            interval
            daysOfWeek
            dayOfMonth
            weekOfMonth
            dayOfWeek
            endDate
            endCount
            userId
            createdAt
            updatedAt
        }
    }
`;

export const UPDATE_EVENT_RECURRENCE = gql`
    mutation UpdateRecurrenceTemplate(
        $id: Int!
        $data: UpdateEventRecurrenceInput!
    ) {
        updateRecurrenceTemplate(id: $id, data: $data) {
            id
            type
            interval
            daysOfWeek
            dayOfMonth
            weekOfMonth
            dayOfWeek
            endDate
            endCount
            userId
            createdAt
            updatedAt
        }
    }
`;

export const DELETE_EVENT_RECURRENCE = gql`
    mutation DeleteRecurrenceTemplate($id: Int!) {
        deleteRecurrenceTemplate(id: $id) {
            id
        }
    }
`;
