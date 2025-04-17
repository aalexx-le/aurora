"use client";

import { GET_EVENTS } from "@/api/script/schedule/event";
import {
    SchedulePageSkeleton
} from "@/app/(dashboard)/schedule/components/skeletons";
import { GetEventsQuery, GetEventsQueryVariables } from "@/gql/graphql";
import { EventCalendarProvider, useEventCalendar } from '@/lib/context/calendar-context';
import { ConvertCurrencyProvider } from "@/lib/context/convert-currency.context";
import { DateFilterProvider } from "@/lib/context/date-range.context";
import { useQuery } from "@apollo/client";
import { EventInput } from '@fullcalendar/core';
import { lazy, Suspense, useMemo } from 'react';
import {
    mapEventFromEntityToInput
} from "@/app/(dashboard)/schedule/components/event-calendar/mapEventFromEntityToInput";

// Lazy load components
const EventCalendar = lazy(() => import('./components/event-calendar/event-calendar'));

// Simple presentational component
const SchedulePage = ({ events, loading }: { events: EventInput[], loading: boolean }) => (
  <div className="h-[calc(100vh-76px)] p-4">
    <Suspense fallback={<SchedulePageSkeleton />}>
      <EventCalendar events={events} loading={loading}/>
    </Suspense>
  </div>
);

// Container component with data fetching logic
const SchedulePageContainer = () => {
  // Get date range based on current view and date
  const { getDateRangeForView } = useEventCalendar();
  const { startDate, endDate } = useMemo(
    () => getDateRangeForView(),
    [getDateRangeForView]
  );
  
  // Fetch events
  const { data, loading } = useQuery<GetEventsQuery, GetEventsQueryVariables>(
    GET_EVENTS, 
    {
      variables: { startDate, endDate },
      fetchPolicy: 'network-only',
      skip: !startDate || !endDate,
    }
  );

  // Map to calendar format
  const events = useMemo(
    () => mapEventFromEntityToInput(data?.getEvents ?? []), 
    [data]
  );

  return <SchedulePage events={events} loading={loading}/>;
};

// Root component with providers
export default function SchedulePageWithContext() {
  return (
    <ConvertCurrencyProvider baseCurrency="VND">
      <DateFilterProvider>
        <EventCalendarProvider>
            <SchedulePageContainer />
        </EventCalendarProvider>
      </DateFilterProvider>
    </ConvertCurrencyProvider>
  );
}

