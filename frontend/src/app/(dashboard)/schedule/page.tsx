"use client";

import { GET_EVENTS } from "@/api/scripts/schedule/event";
import {
  mapEventFromEntityToInput
} from "@/app/(dashboard)/schedule/components/event-calendar/mapEventFromEntityToInput";
import {
  SchedulePageSkeleton
} from "@/app/(dashboard)/schedule/components/skeletons";
import { GetEventsQuery, GetEventsQueryVariables } from "@/gql/graphql";
import { ConvertCurrencyProvider } from "@/lib/context/convert-currency.context";
import { DateFilterProvider } from "@/lib/context/date-range.context";
import { useQuery, useSuspenseQuery } from "@apollo/client";
import { Suspense, useMemo } from 'react';
import EventCalendar from "./components/event-calendar/event-calendar";
import { EventCalendarProvider, useEventCalendar } from "./event-calendar-provider";

// Data fetching wrapper component that maintains a stable event state
const SchedulePage = () => {
  // Get date range based on current view and date
  const { getDateRangeForView } = useEventCalendar();
  const { startDate, endDate } = useMemo(
    () => getDateRangeForView(),
    [getDateRangeForView]
  );
  
  // Use suspense query with better caching strategy
  const { data } = useQuery<GetEventsQuery, GetEventsQueryVariables>(
    GET_EVENTS, 
    {
      variables: { startDate, endDate },
      // fetchPolicy: 'cache-and-network', // Use cache first, then update in background
      skip: !startDate || !endDate,
    }
  );

  // Map to calendar format
  const currentEvents = useMemo(
    () => mapEventFromEntityToInput(data?.getEvents ?? []), 
    [data]
  );

  return (
    <Suspense fallback={<SchedulePageSkeleton />}>
      <EventCalendar events={currentEvents} />
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

