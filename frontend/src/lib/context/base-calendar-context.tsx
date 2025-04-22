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
    _setViewedDate(prevDate => {
      const prevMonth = prevDate.getMonth();
      const newMonth = date.getMonth();

      if (prevMonth === newMonth) {
        return prevDate;
      }

      return date;
    });
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
        const currentDay = viewedDate.getDay(); // 0 = Sunday, 6 = Saturday
        // Make sure we include Sunday as the first day (subtract the day number to get to Sunday)
        const weekStart = new Date(year, month, date - currentDay); // This gives us Sunday
        const weekEnd = new Date(year, month, date + (7 - currentDay), 23, 59, 59); // This gives us Saturday
        return { startDate: weekStart, endDate: weekEnd };
        
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