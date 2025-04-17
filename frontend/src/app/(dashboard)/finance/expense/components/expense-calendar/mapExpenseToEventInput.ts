import { Expense } from "@/app/(dashboard)/finance/expense/components/expense-table/types";
import { EventInput } from "@fullcalendar/core/index.js";

/**
 * Maps expense data to FullCalendar event input format
 * @param expenses Array of expense objects
 * @returns Array of EventInput objects for FullCalendar
 */
export const mapExpenseToEventInput = (expenses: Expense[]): EventInput[] =>
    expenses.map((expense) => ({
        id: expense.id,
        title: expense.name,
        start: new Date(expense.createdAt),
        end: new Date(expense.createdAt),
        allDay: true, // Display expenses as all-day events
        color: expense.category?.color || "#6B7280",
        backgroundColor: expense.category?.color || "#6B7280",
        description: expense.description || "",
        extendedProps: {
            backup: expense,
        },
    }));
