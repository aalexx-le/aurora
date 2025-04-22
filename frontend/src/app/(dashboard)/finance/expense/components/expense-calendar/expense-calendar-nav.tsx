"use client";

import { Button } from "@/components/ui/button";
import {
  changeCalendarView,
  goNext,
  goPrev,
  goToday,
  updateViewedDate
} from "@/lib/utils/calendar/calendar-utils";
import { calendarRef as calendarRefType, CalendarView } from "@/lib/utils/calendar/data";
import FullCalendar from "@fullcalendar/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useExpenseCalendar } from "./expense-calendar-provider";

// Month names for display
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// View options configuration
const viewOptions = [
  { value: CalendarView.DayGridMonth, label: "Month" },
  { value: CalendarView.TimeGridWeek, label: "Week" },
  { value: CalendarView.TimeGridDay, label: "Day" }
];

interface ExpenseCalendarNavProps {
  calendarRef: React.RefObject<FullCalendar>;
}

export default function ExpenseCalendarNav({ calendarRef }: ExpenseCalendarNavProps) {
  const { 
    viewedDate, 
    setViewedDate, 
    currentView, 
    setCurrentView 
  } = useExpenseCalendar();
  
  const handleNavigation = (navFunction: (ref: calendarRefType) => void) => {
    navFunction(calendarRef);
    updateViewedDate(calendarRef, setViewedDate);
  };

  const handleViewChange = (view: CalendarView) => {
    changeCalendarView(calendarRef, view, setCurrentView);
    updateViewedDate(calendarRef, setViewedDate);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between w-full gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleNavigation(goPrev)}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleNavigation(goNext)}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleNavigation(goToday)}
          className="h-8"
        >
          Today
        </Button>
        <div className="text-lg font-semibold">
          {monthNames[viewedDate.getMonth()]} {viewedDate.getFullYear()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {viewOptions.map(view => (
          <Button
            key={view.value}
            variant={currentView === view.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleViewChange(view.value)}
            className="h-8"
          >
            {view.label}
          </Button>
        ))}
      </div>
    </div>
  );
} 