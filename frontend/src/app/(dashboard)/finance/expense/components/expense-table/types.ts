import { GetExpensesQuery } from "@/gql/graphql";

export type Expense = GetExpensesQuery["getExpenses"][number];
