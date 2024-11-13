import gql from "graphql-tag";

export const GET_EXPENSE_CATEGORIES = gql`
    query GetExpenseCategories(
        $userId: Int!
        $startDate: DateTime
        $endDate: DateTime
    ) {
        getExpenseCategories(userId: $userId) {
            color
            description
            name
            id
            countExpenses
            totalAmount(startDate: $startDate, endDate: $endDate)
        }
    }
`;

export const GET_BRIEF_EXPENSE_CATEGORIES = gql`
    query GetExpenseCategories($userId: Int!) {
        getExpenseCategories(userId: $userId) {
            color
            description
            name
            id
        }
    }
`;

export const CREATE_EXPENSE_CATEGORY = gql`
    mutation CreateExpenseCategory($data: CreateExpenseCategoryInput!) {
        createExpenseCategory(data: $data) {
            color
            description
            name
            id
        }
    }
`;

export const UPDATE_EXPENSE_CATEGORY = gql`
    mutation UpdateExpenseCategory(
        $id: String!
        $data: UpdateExpenseCategoryInput!
    ) {
        updateExpenseCategory(id: $id, data: $data) {
            color
            description
            name
            id
        }
    }
`;

export const REMOVE_EXPENSE_CATEGORY = gql`
    mutation RemoveExpenseCategory($id: String!) {
        removeExpenseCategory(id: $id) {
            id
        }
    }
`;
