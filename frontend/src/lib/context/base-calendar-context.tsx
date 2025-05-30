"use client";

import { CalendarView } from "@/lib/utils/calendar/data";
import { useCallback, useEffect, useState } from "react";

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
  
  currentPeriod: { startDate: Date; endDate: Date } | null;
  setCurrentPeriod: (period: { startDate: Date; endDate: Date }) => void;
}

/**
 * Base provider component with common calendar functionality
 * @returns Common calendar state and functions
 */
export const useBaseCalendarProvider = () => {
  const [viewedDate, _setViewedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>(CalendarView.DayGridMonth);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<{ startDate: Date; endDate: Date } | null>(null);

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

      // if new start date and end date are inside the period of current 

      return { startDate: weekStartDate, endDate: weekEndDate };
      
    case CalendarView.DayGridMonth:
    default:
      // For month view, get the start and end of the month
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
      return { startDate: monthStart, endDate: monthEnd };
  }
}, [viewedDate, currentView]);

  useEffect(() => {
    const newPeriod = getDateRangeForView();
    
    // Only update currentPeriod if it doesn't exist yet or if the new period is not inside the current period
    if (!currentPeriod || 
        newPeriod.startDate < currentPeriod.startDate || 
        newPeriod.endDate > currentPeriod.endDate) {
      setCurrentPeriod(newPeriod);
    }
  }, [viewedDate, currentView, getDateRangeForView, currentPeriod]);

  const setViewedDate = (date: Date) => {
    _setViewedDate(date);
  };

  

  return {
    viewedDate,
    setViewedDate,
    currentView,
    setCurrentView,
    selectedDate,
    setSelectedDate,
    currentPeriod,
    setCurrentPeriod
  };
}; 