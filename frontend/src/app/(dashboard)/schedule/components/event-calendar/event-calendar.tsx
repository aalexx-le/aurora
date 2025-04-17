"use client";

import { useEventCalendar } from "@/lib/context/calendar-context";
import {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import "./event-calendar.css";

import { GET_EVENTS, UPDATE_EVENT } from "@/api/script/schedule/event";
import { Card } from "@/components/ui/card";
import { UpdateEventMutation, UpdateEventMutationVariables } from "@/gql/graphql";
import { useToast } from "@/hooks/use-toast";
import { getDateFromMinutes } from "@/lib/utils/calendar/calendar-utils";
import { earliestTime } from "@/lib/utils/calendar/data";
import { getGraphqlErrorMessage } from "@/lib/utils/graphql";
import { useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import EventCategoryList from "../event-category-list/EventCategoryList";
import { EventCalendarSkeleton } from "../skeletons";
import DayHeader from "./DayHeader";
import DayRender from "./DayRender";
import EventCalendarNav from "./event-calendar-nav";
import EventItem from "./EventItem";
import { Event } from "./types";
import { UpdateEventDialog } from "./UpdateEventDialog";

interface IProps {
    events: EventInput[];
    loading?: boolean;
}

function EventCalendarContent({events, loading = false}: IProps) {
    const {
        setEventAddOpen,
        setEventEditOpen,
        setEventAddStartTime,
        setEventAddEndTime,
        setViewedDate,
        currentView,
        viewedDate
    } = useEventCalendar();

    const {toast} = useToast();

    const calendarRef = useRef<FullCalendar | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();

    // Set up the update event mutation
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
        const endTime = new Date(info.date.getTime() + 30 * 60 * 1000); // 30 minutes between start and end time

        setEventAddStartTime(info.date);
        setEventAddEndTime(endTime);

        setEventAddOpen(true);
    }

    const handleEventContent = (eventInfo: any) => {
        return <EventItem info={eventInfo}/>;
    };

    const earliestHour = getDateFromMinutes(earliestTime)
        .getHours()
        .toString()
        .padStart(2, "0");
    const earliestMin = getDateFromMinutes(earliestTime)
        .getMinutes()
        .toString()
        .padStart(2, "0");

    const calendarEarliestTime = `${earliestHour}:${earliestMin}`;

    return (
        <div className="space-y-5">
            <div className="flex justify-between">
                <EventCalendarNav
                    calendarRef={calendarRef}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-6 lg:gap-4">
                <EventCategoryList/>

                {loading ? (
                    <div className="col-span-5">
                        <EventCalendarSkeleton/>
                    </div>
                ) : (
                    <Card className="col-span-5 overflow-hidden">
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
                            weekends={true}
                            firstDay={1}
                            initialView={currentView}
                            initialDate={viewedDate}
                            headerToolbar={false}
                            slotMinTime={calendarEarliestTime}
                            allDaySlot={false}
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
                            dayCellContent={(dayInfo) => <DayRender info={dayInfo}/>}
                            eventContent={handleEventContent}
                            dayHeaderContent={(headerInfo) => <DayHeader info={headerInfo}/>}
                            eventClick={(eventInfo) => handleEventClick(eventInfo)}
                            eventChange={(eventInfo) => handleEventChange(eventInfo)}
                            select={handleDateSelect}
                            datesSet={({view}) => setViewedDate(new Date(view.currentStart))}
                            dateClick={(eventInfo) => handleDateClick(eventInfo)}
                            nowIndicator
                            droppable
                            editable
                            eventStartEditable
                        />
                    </Card>
                )}

            </div>
            
            {selectedEvent && (
                <UpdateEventDialog event={selectedEvent}/>
            )}
        </div>
    );
}

export default function EventCalendar(props: IProps) {
    return (
        <EventCalendarContent {...props} />
    );
}