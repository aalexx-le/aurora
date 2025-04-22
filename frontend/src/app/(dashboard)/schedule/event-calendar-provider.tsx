"use client";

import { BaseCalendarContextType, useBaseCalendarProvider } from "@/lib/context/base-calendar-context";
import { createContext, ReactNode, useContext, useState } from "react";

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
}

// Create context
const EventCalendarContext = createContext<EventCalendarContextType | undefined>(undefined);

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
  
  // Set start time to the beginning of the current day (00:00:00)
  const [eventAddStartTime, setEventAddStartTime] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  
  // Set end time to the end of the current day (23:59:59)
  const [eventAddEndTime, setEventAddEndTime] = useState<Date>(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return today;
  });

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