import gql from "graphql-tag";

export const GET_EXPENSE_CATEGORIES = gql`
    query GetExpenseCategories(
        $userId: Int!
        $name: String
        $startDate: DateTime
        $endDate: DateTime
        $month: Int
        $year: Int
    ) {
        getExpenseCategories(userId: $userId, name: $name) {
            color
            description
            name
            id
            countExpenses
            totalAmount(startDate: $startDate, endDate: $endDate)
            monthlyTargets(month: $month, year: $year) {
                month
                year
                target
            }
        }
    }
`;

// export const GET_BRIEF_EXPENSE_CATEGORIES = gql`
//     query GetExpenseCategories($userId: Int!, $startDate: DateTime, $endDate: DateTime, $month: Int, $year: Int) {
//         getExpenseCategories(userId: $userId) {
//             color
//             description
//             name
//             id
//             totalAmount(startDate: $startDate, endDate: $endDate)
//             monthlyTargets(month: $month, year: $year) {
//                 month
//                 year
//                 target
//             }
//         }
//     }
// `;

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

export const GET_MONTHLY_TARGETS = gql`
    query GetMonthlyTargets($categoryId: String!, $month: Int, $year: Int) {
        getMonthlyTargets(categoryId: $categoryId, month: $month, year: $year) {
            target
            month
            year
        }
    }
`;

export const CREATE_MONTHLY_TARGET = gql`
    mutation CreateMonthlyTarget($data: CreateMonthlyTargetInput!) {
        createMonthlyTarget(data: $data) {
            categoryId
        }
    }
`;

export const UPDATE_MONTHLY_TARGET = gql`
    mutation UpdateMonthlyTarget(
        $id: String!
        $data: UpdateMonthlyTargetInput!
    ) {
        updateMonthlyTarget(id: $id, data: $data) {
            categoryId
        }
    }
`;
