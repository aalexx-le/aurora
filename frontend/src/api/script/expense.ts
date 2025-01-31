import gql from "graphql-tag";

export const GET_EXPENSES = gql`
    query GetExpenses($startDate: DateTime, $endDate: DateTime) {
        getExpenses(startDate: $startDate, endDate: $endDate) {
            id
            category {
                id
                color
                name
            }
            transaction {
                id
                amount
                spentAmount
                description
            }
            createdAt
            description
            amount
            name
        }
    }
`;

export const GET_SUGGESTED_EXPENSES = gql`
    query GetSuggestedExpenses($bankTransactionId: String!) {
        getSuggestedExpenses(bankTransactionId: $bankTransactionId) {
            amount
            name
            bankTransactionId
            categoryId
            description
        }
    }
`;

export const CREATE_EXPENSE = gql`
    mutation CreateExpense($data: CreateExpenseInput!) {
        createExpense(data: $data) {
            id
            description
            amount
            name
        }
    }
`;

export const UPDATE_EXPENSE = gql`
    mutation UpdateExpense($id: String!, $data: UpdateExpenseInput!) {
        updateExpense(id: $id, data: $data) {
            id
            description
            amount
            name
        }
    }
`;

export const REMOVE_EXPENSE = gql`
    mutation RemoveExpense($id: String!) {
        removeExpense(id: $id) {
            id
            description
            amount
            name
        }
    }
`;

export const REMOVE_EXPENSES = gql`
    mutation RemoveExpenses($ids: [String!]!) {
        removeExpenses(ids: $ids)
    }
`;
