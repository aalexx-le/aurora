import { gql } from "graphql-tag";

export const GET_EVENT_CATEGORIES = gql`
    query GetEventCategories {
        getEventCategories {
            id
            name
            color
        }
    }
`;

export const CREATE_EVENT_CATEGORY = gql`
    mutation CreateEventCategory($data: CreateEventCategoryInput!) {
        createEventCategory(data: $data) {
            id
            name
            color
        }
    }
`;

export const UPDATE_EVENT_CATEGORY = gql`
    mutation UpdateEventCategory($id: Int!, $data: UpdateEventCategoryInput!) {
        updateEventCategory(id: $id, data: $data) {
            id
            name
            color
        }
    }
`;

export const REMOVE_EVENT_CATEGORY = gql`
    mutation RemoveEventCategory($id: Int!) {
        removeEventCategory(id: $id) {
            id
        }
    }
`;
