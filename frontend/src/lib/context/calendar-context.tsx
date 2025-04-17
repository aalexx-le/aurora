"use client";

import { CalendarView } from "@/lib/utils/calendar/data";
import { DataTableRowActionType } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

/**
 * Base calendar context type with common properties for all calendar types
 */
interface BaseCalendarContextType {
  // Common calendar navigation state
  viewedDate: Date;
  setViewedDate: (date: Date) => void;
  currentView: CalendarView;
  setCurrentView: (view: CalendarView) => void;
  
  // Common date selection state
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  
  // Common utility functions
  getDateRangeForView: () => { startDate: Date; endDate: Date };
}

/**
 * Event calendar specific context properties
 */
interface EventCalendarContextType extends BaseCalendarContextType {
  // Event creation/editing state
  eventAddOpen: boolean;
  setEventAddOpen: (value: boolean) => void;
  eventEditOpen: boolean;
  setEventEditOpen: (value: boolean) => void;
  eventDeleteOpen: boolean;
  setEventDeleteOpen: (value: boolean) => void;
  
  // Event time selection
  eventAddStartTime: Date;
  setEventAddStartTime: (value: Date) => void;
  eventAddEndTime: Date;
  setEventAddEndTime: (value: Date) => void;
  
  // Availability checker
  availabilityCheckerEventAddOpen: boolean;
  setAvailabilityCheckerEventAddOpen: (value: boolean) => void;
}

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

// Create contexts
const EventCalendarContext = createContext<EventCalendarContextType | undefined>(undefined);
const ExpenseCalendarContext = createContext<ExpenseCalendarContextType | undefined>(undefined);

/**
 * Hook to use the event calendar context
 * @returns The event calendar context
 */
export const useEventCalendar = () => {
  const context = useContext(EventCalendarContext);
  if (!context) {
    throw new Error("useEventCalendar must be used within an EventCalendarProvider");
  }
  return context;
};

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
 * Base provider component with common calendar functionality
 * @param children - React children
 * @returns Common calendar state and functions
 */
const useBaseCalendarProvider = () => {
  const [viewedDate, _setViewedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>(CalendarView.DayGridMonth);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const setViewedDate = (date: Date) => {
    _setViewedDate(date);
  };

  /**
   * Get the appropriate date range based on the current view and viewed date
   * @returns An object containing startDate and endDate for the current view
   */
  const getDateRangeForView = (): { startDate: Date; endDate: Date } => {
    const year = viewedDate.getFullYear();
    const month = viewedDate.getMonth();
    const date = viewedDate.getDate();

    switch (currentView) {
      case CalendarView.TimeGridDay:
        // For day view, use the current day
        const dayStart = new Date(year, month, date);
        const dayEnd = new Date(year, month, date, 23, 59, 59);
        return { startDate: dayStart, endDate: dayEnd };
        
      case CalendarView.TimeGridWeek:
        // For week view, get the start and end of the week containing the viewed date
        const currentDay = viewedDate.getDay(); // 0 = Sunday, 6 = Saturday
        const weekStart = new Date(year, month, date - currentDay);
        const weekEnd = new Date(year, month, date + (6 - currentDay), 23, 59, 59);
        return { startDate: weekStart, endDate: weekEnd };
        
      case CalendarView.DayGridMonth:
      default:
        // For month view, get the start and end of the month
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
        return { startDate: monthStart, endDate: monthEnd };
    }
  };

  return {
    viewedDate,
    setViewedDate,
    currentView,
    setCurrentView,
    selectedDate,
    setSelectedDate,
    getDateRangeForView,
  };
};

/**
 * Provider component for the event calendar context
 */
export const EventCalendarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Get common calendar state
  const baseCalendar = useBaseCalendarProvider();
  
  // Event-specific state
  const [eventAddOpen, setEventAddOpen] = useState(false);
  const [eventEditOpen, setEventEditOpen] = useState(false);
  const [eventDeleteOpen, setEventDeleteOpen] = useState(false);
  const [eventAddStartTime, setEventAddStartTime] = useState<Date>(new Date());
  const [eventAddEndTime, setEventAddEndTime] = useState<Date>(new Date(new Date().getTime() + 30 * 60 * 1000));
  const [availabilityCheckerEventAddOpen, setAvailabilityCheckerEventAddOpen] = useState(false);

  return (
    <EventCalendarContext.Provider
      value={{
        ...baseCalendar,
        eventAddOpen,
        setEventAddOpen,
        eventEditOpen,
        setEventEditOpen,
        eventDeleteOpen,
        setEventDeleteOpen,
        availabilityCheckerEventAddOpen,
        setAvailabilityCheckerEventAddOpen,
        eventAddStartTime,
        setEventAddStartTime,
        eventAddEndTime,
        setEventAddEndTime,
      }}
    >
      {children}
    </EventCalendarContext.Provider>
  );
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