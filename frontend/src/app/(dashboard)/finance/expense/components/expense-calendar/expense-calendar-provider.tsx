"use client";

import { BaseCalendarContextType, useBaseCalendarProvider } from "@/lib/context/base-calendar-context";
import { DataTableRowActionType } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

/**
 * Expense calendar specific context properties
 */
interface ExpenseCalendarContextType extends BaseCalendarContextType {
  // Expense selection state
  selectedExpense: any | null;
  setSelectedExpense: (expense: any | null) => void;
  
  // Action type (create/update)
  action: DataTableRowActionType | null;
  setAction: (action: DataTableRowActionType | null) => void;
}

// Create context
const ExpenseCalendarContext = createContext<ExpenseCalendarContextType | undefined>(undefined);

/**
 * Hook to use the expense calendar context
 * @returns The expense calendar context
 */
export const useExpenseCalendar = () => {
  const context = useContext(ExpenseCalendarContext);
  if (!context) {
    throw new Error("useExpenseCalendar must be used within an ExpenseCalendarProvider");
  }
  return context;
};

/**
 * Provider component for the expense calendar context
 */
export const ExpenseCalendarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Get common calendar state
  const baseCalendar = useBaseCalendarProvider();
  
  // Expense-specific state
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [action, setAction] = useState<DataTableRowActionType | null>(null);

  return (
    <ExpenseCalendarContext.Provider
      value={{
        ...baseCalendar,
        selectedExpense,
        setSelectedExpense,
        action,
        setAction,
      }}
    >
      {children}
    </ExpenseCalendarContext.Provider>
  );
}; 