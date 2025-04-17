"use client";
import { CalendarView } from "@/lib/utils/calendar/data";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface EventsContextType {
  eventAddOpen: boolean;
  setEventAddOpen: (value: boolean) => void;
  eventEditOpen: boolean;
  setEventEditOpen: (value: boolean) => void;
  eventDeleteOpen: boolean;
  setEventDeleteOpen: (value: boolean) => void;
  availabilityCheckerEventAddOpen: boolean;
  setAvailabilityCheckerEventAddOpen: (value: boolean) => void;
  eventAddStartTime: Date;
  setEventAddStartTime: (value: Date) => void;
  eventAddEndTime: Date;
  setEventAddEndTime: (value: Date) => void;
  viewedDate: Date;
  setViewedDate: (date: Date) => void;
  currentView: CalendarView;
  setCurrentView: (view: CalendarView) => void;
  getDateRangeForView: () => { startDate: Date; endDate: Date };
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};

export const EventsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [eventAddOpen, setEventAddOpen] = useState(false);
  const [eventEditOpen, setEventEditOpen] = useState(false);
  const [eventDeleteOpen, setEventDeleteOpen] = useState(false);
  const [eventAddStartTime, setEventAddStartTime] = useState<Date>(new Date());
  const [eventAddEndTime, setEventAddEndTime] = useState<Date>(new Date(new Date().getTime() + 30 * 60 * 1000));
  const [availabilityCheckerEventAddOpen, setAvailabilityCheckerEventAddOpen] =
    useState(false);
  const [viewedDate, _setViewedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<CalendarView>(CalendarView.DayGridMonth);

  const setViewedDate = (date: Date) => {
    _setViewedDate(date);
  }

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

  return (
    <EventsContext.Provider
      value={{
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
        viewedDate,
        setViewedDate,
        currentView,
        setCurrentView,
        getDateRangeForView,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};
