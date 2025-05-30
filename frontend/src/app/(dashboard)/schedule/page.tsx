"use client";

import {
  SchedulePageSkeleton
} from "@/app/(dashboard)/schedule/components/skeletons";
import { ConvertCurrencyProvider } from "@/lib/context/convert-currency.context";
import { DateFilterProvider } from "@/lib/context/date-range.context";
import { Suspense } from 'react';
import { EventCalendarProvider, useEventCalendar } from "./event-calendar-provider";

import { useRef } from "react";
import { UpdateEventDialog } from "./components/event-calendar/UpdateEventDialog";
import EventCalendarNav from "./components/event-calendar/event-calendar-nav";
import EventCategoryList from "./components/event-category-list/EventCategoryList";
import EventRecurrenceList from "./components/event-recurrence-list/EventRecurrenceList";
import EventCalendar from "./components/event-calendar/event-calendar";
import FullCalendar from "@fullcalendar/react";

// export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";

const SchedulePage = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const { selectedEvent } = useEventCalendar();

  return (
    <Suspense fallback={<SchedulePageSkeleton />}>
      <div className="space-y-5">
        <div className="flex justify-between">
          <EventCalendarNav
            calendarRef={calendarRef}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-4">
          <div className="flex flex-col gap-4">
            <EventCategoryList />
            <EventRecurrenceList />
          </div>
          <div className="col-span-4 overflow-hidden mb-5">
            <EventCalendar calendarRef={calendarRef} />
          </div>
        </div>

        {selectedEvent && (
          <UpdateEventDialog event={selectedEvent} />
        )}
      </div>
    </Suspense>
  );
};

// Root component with providers
export default function SchedulePageWithContext() {
  return (
    <ConvertCurrencyProvider baseCurrency="VND">
      <DateFilterProvider>
        <EventCalendarProvider>
          <SchedulePage />
        </EventCalendarProvider>
      </DateFilterProvider>
    </ConvertCurrencyProvider>
  );
}

