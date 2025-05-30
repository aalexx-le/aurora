"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { calendarRef, CalendarView } from "./data";

// Generate array of day options for dropdown
export const generateDaysInMonth = (daysInMonth: number) => 
  Array.from({ length: daysInMonth }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  }));

// Calendar navigation functions
export const goPrev = (calendarRef: calendarRef) => {
  const calendarApi = calendarRef.current?.getApi();
  const currentDate = calendarApi?.getDate();
  if (currentDate) {
    const newDate = new Date(currentDate);
    const view = calendarApi?.view.type;
    
    if (view === 'dayGridMonth') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === 'timeGridWeek') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'timeGridDay') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      // Default fallback
      newDate.setDate(newDate.getDate() - 1);
    }
    
    calendarApi?.gotoDate(newDate);
  }
};

export const goNext = (calendarRef: calendarRef) => {
  const calendarApi = calendarRef.current?.getApi();
  const currentDate = calendarApi?.getDate();
  if (currentDate) {
    const newDate = new Date(currentDate);
    const view = calendarApi?.view.type;
    
    if (view === 'dayGridMonth') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === 'timeGridWeek') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'timeGridDay') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      // Default fallback
      newDate.setDate(newDate.getDate() + 1);
    }
    
    calendarApi?.gotoDate(newDate);
  }
};

export const goToday = (calendarRef: calendarRef) => 
  calendarRef.current?.getApi().today();

// Date change handlers
export const handleDayChange = (calendarRef: calendarRef, currentDate: Date, day: string) => {
  const calendarApi = calendarRef.current?.getApi();
  const newDate = new Date(currentDate);
  newDate.setDate(Number(day));
  calendarApi?.gotoDate(newDate);
};

export const handleMonthChange = (calendarRef: calendarRef, currentDate: Date, month: string) => {
  const calendarApi = calendarRef.current?.getApi();
  const newDate = new Date(currentDate);
  newDate.setMonth(Number(month) - 1);
  calendarApi?.gotoDate(newDate);
};

export const handleYearChange = (calendarRef: calendarRef, currentDate: Date, e: ChangeEvent<HTMLInputElement>) => {
  const calendarApi = calendarRef.current?.getApi();
  const newDate = new Date(currentDate);
  newDate.setFullYear(Number(e.target.value));
  calendarApi?.gotoDate(newDate);
};

// View management
export const setView = (
  calendarRef: calendarRef,
  viewName: CalendarView,
  setCurrentView: Dispatch<SetStateAction<CalendarView>>
) => {
  const calendarApi = calendarRef.current?.getApi();
  setCurrentView(viewName);
  calendarApi?.changeView(viewName);
};

// Update viewedDate from calendar
export const updateViewedDate = (calendarRef: calendarRef, setViewedDate: (date: Date) => void) => {
    const newDate = calendarRef.current?.getApi().getDate();
    if (newDate) {
      setViewedDate(new Date(newDate));
    }
};

// Combined function for view change and date update
export const changeCalendarView = (
  calendarRef: calendarRef,
  viewName: CalendarView,
  setCurrentView: (view: CalendarView) => void,
) => {
  setCurrentView(viewName);
  calendarRef.current?.getApi().changeView(viewName);
};

// Helper for time calculations
export const getDateFromMinutes = (minutes: number) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setMinutes(minutes);
  return now;
};
