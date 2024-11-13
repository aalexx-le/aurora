import { GetExpenseCategoriesQuery } from "@/gql/graphql";

export type ExpenseCategory =
    GetExpenseCategoriesQuery["getExpenseCategories"][number];
