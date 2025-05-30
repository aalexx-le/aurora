"use client";

import {
    DateSelectArg,
    EventChangeArg,
    EventClickArg
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEventCalendar } from "../../event-calendar-provider";
import "./event-calendar.css";

import { GET_EVENTS, UPDATE_EVENT } from "@/api/schedule/event";
import DayHeader from "./DayHeader";
import DayRender from "./DayRender";

import {
    mapEventFromEntityToInput
} from "@/app/(dashboard)/schedule/components/event-calendar/mapEventFromEntityToInput";
import { GetEventsQuery, GetEventsQueryVariables, UpdateEventMutation, UpdateEventMutationVariables } from "@/gql/graphql";
import { useToast } from "@/hooks/use-toast";
import { getDateFromMinutes } from "@/lib/utils/calendar/calendar-utils";
import { CalendarView, EARLIEST_TIME } from "@/lib/utils/calendar/data";
import { getGraphqlErrorMessage } from "@/lib/utils/graphql";
import { useMutation, useQuery } from "@apollo/client";
import { MutableRefObject, useMemo } from 'react';
import { EventCalendarSkeleton } from "../skeletons";
import EventItem from "./EventItem";
import { Event } from "./types";

interface IProps {
    calendarRef: MutableRefObject<FullCalendar | null>;
}

export default function EventCalendar({calendarRef}: IProps) {
    const { toast } = useToast();
    const {
        setEventAddOpen,
        setEventEditOpen,
        setEventAddStartTime,
        setEventAddEndTime,
        setViewedDate,
        currentView,
        viewedDate,
        setSelectedEvent,
        currentPeriod
      } = useEventCalendar();
  const { startDate, endDate } = currentPeriod ?? { startDate: new Date(), endDate: new Date() };
  
  // Use suspense query with better caching strategy
  const { data, loading } = useQuery<GetEventsQuery, GetEventsQueryVariables>(
    GET_EVENTS, 
    {
      variables: { startDate, endDate },
      // fetchPolicy: 'cache-and-network', // Use cache first, then update in background
      skip: !startDate || !endDate,
    }
  );

  const [updateEvent] = useMutation<UpdateEventMutation, UpdateEventMutationVariables>(
    UPDATE_EVENT,
    {
      refetchQueries: [
        {
          query: GET_EVENTS,
        }
      ],
      onError: (error) => {
        toast({
          title: "Failed to update event",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  );

  // Map to calendar format
  const events = useMemo(
    () => mapEventFromEntityToInput(data?.getEvents ?? []), 
    [data]
  );
  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvent(info.event.extendedProps.backup as Event);
    setEventEditOpen(true);
  };

  const handleEventChange = async (info: EventChangeArg) => {
    try {
      await updateEvent({
        variables: {
          id: Number(info.event.id),
          data: {
            startDate: info.event.start!,
            endDate: info.event.end!,
          }
        }
      });
    } catch (error) {
      toast({
        title: "Failed to update event",
        description: getGraphqlErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const handleDateSelect = (info: DateSelectArg) => {
  };

  const handleDateClick = (info: DateClickArg) => {

    if (currentView === CalendarView.DayGridMonth) {
      const startDate = new Date(info.date);
      startDate.setHours(7, 0, 0, 0);
      setEventAddStartTime(startDate);
      const endDate = new Date(info.date);
      endDate.setHours(8, 0, 0, 0);
      setEventAddEndTime(endDate);
    }
    else {
      const date = new Date(info.date);
      const endTime = new Date(info.date.getTime() + 30 * 60 * 1000); // 30 minutes in between 
      setEventAddStartTime(info.date);
      setEventAddEndTime(endTime);
    }

    setEventAddOpen(true);
  }

  const handleEventContent = (eventInfo: any) => {
    return <EventItem info={eventInfo} />;
  };

  const earliestHour = getDateFromMinutes(EARLIEST_TIME)
    .getHours()
    .toString()
    .padStart(2, "0");
  const earliestMin = getDateFromMinutes(EARLIEST_TIME)
    .getMinutes()
    .toString()
    .padStart(2, "0");

  const calendarEarliestTime = `${earliestHour}:${earliestMin}`;

  if (loading) {
    return <EventCalendarSkeleton />
  }

    return (
        <FullCalendar
            events={events}
            ref={calendarRef}
            timeZone="local"
            plugins={[
                dayGridPlugin,
                timeGridPlugin,
                interactionPlugin,
                listPlugin,
            ]}
            weekNumberCalculation="ISO"
            weekends={true}
            firstDay={1}
            initialView={currentView}
            initialDate={viewedDate}
            headerToolbar={false}
            slotMinTime={calendarEarliestTime}
            allDaySlot={true}
            displayEventEnd={true}
            windowResizeDelay={0}

            slotLabelFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }}
            eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }}
            contentHeight={"auto"}
            expandRows={true}
            dayCellContent={(dayInfo) => <DayRender info={dayInfo} />}
            eventContent={handleEventContent}
            dayHeaderContent={(headerInfo) => <DayHeader info={headerInfo} />}
            eventClick={(eventInfo) => handleEventClick(eventInfo)}
            eventChange={(eventInfo) => handleEventChange(eventInfo)}
            select={handleDateSelect}
            datesSet={({ view }) => setViewedDate(new Date(view.currentStart))}
            dateClick={(eventInfo) => handleDateClick(eventInfo)}
            nowIndicator
            droppable
            editable
            eventStartEditable
        />
    );
}
