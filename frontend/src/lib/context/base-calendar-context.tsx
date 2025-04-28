"use client";

import { CalendarView } from "@/lib/utils/calendar/data";
import { useCallback, useState } from "react";

/**
 * Base calendar context type with common properties for all calendar types
 */
export interface BaseCalendarContextType {
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
 * Base provider component with common calendar functionality
 * @returns Common calendar state and functions
 */
export const useBaseCalendarProvider = () => {
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
  const getDateRangeForView = useCallback((): { startDate: Date; endDate: Date } => {
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
        const currentDay = viewedDate.getDay(); // JavaScript: 0 = Sunday, 6 = Saturday
        
        // Convert to our calendar system where 0 = Monday, 6 = Sunday
        // Sunday (0) becomes 6, Monday (1) becomes 0, Tuesday (2) becomes 1, etc.
        const adjustedDay = currentDay === 0 ? 6 : currentDay - 1;
        
        // Create a new date object and set it to the start of the week (Monday)
        const weekStartDate = new Date(viewedDate);
        weekStartDate.setDate(weekStartDate.getDate() - adjustedDay);
        weekStartDate.setHours(0, 0, 0, 0);
        
        // Create a new date object and set it to the end of the week (Sunday)
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6);
        weekEndDate.setHours(23, 59, 59, 999);

        console.log(weekStartDate, weekEndDate);

        return { startDate: weekStartDate, endDate: weekEndDate };
        
      case CalendarView.DayGridMonth:
      default:
        // For month view, get the start and end of the month
        const monthStart = new Date(year, month, 1);
        const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
        return { startDate: monthStart, endDate: monthEnd };
    }
  }, [viewedDate, currentView]);

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