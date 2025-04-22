"use client";

import { Button } from "@/components/ui/button";
import { CalendarView } from "@/lib/utils/calendar/data";
import { EventContentArg } from "@fullcalendar/core/index.js";
import { CopyIcon } from "@radix-ui/react-icons";
import { Event } from "./types";
import { useCreateEvent } from "./useCreateEvent";

type EventItemProps = {
  info: EventContentArg;
};

export default function EventItem({ info }: EventItemProps) {
  const { event } = info;
  const [startTimeStr, endTimeStr] = info.timeText.split(" - ");
  const [createEvent] = useCreateEvent()

  const start = new Date(event.start || "");
  const end = new Date(event.end || "");
  const timeDifference = (end.getTime() - start.getTime()) / (1000 * 60); // difference in minutes

  // Add a class for multi-day events
  const isMultiDay = event.end && event.start && 
    (event.end.getDate() !== event.start.getDate() || 
     event.end.getMonth() !== event.start.getMonth() || 
     event.end.getFullYear() !== event.start.getFullYear());

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event click handler from firing
    
    const eventData: Event = event.extendedProps.backup as Event

    try {
      let startDate = new Date(eventData.startDate)
      let endDate = new Date(eventData.endDate)
      if (info.view.type === CalendarView.DayGridMonth) {
        startDate = new Date(startDate.getTime() + 30 * 60000);
        endDate = new Date(endDate.getTime() + 30 * 60000);
      }
      await createEvent({
        variables: { 
          data: {
            name: eventData.name,
            description: eventData.description,
            startDate,
            endDate,
            allDay: eventData.allDay,
            categoryId: eventData.category.id,
            color: eventData.color
          }
        }
      });
    } catch (error) {
      console.error("Failed to duplicate event:", error);
    }
  };

  return (
    <div className={`overflow-hidden w-full relative group ${isMultiDay ? 'multi-day-event' : ''}`}>
      <Button
        variant="default"
        size="icon"
        className="w-6 h-6 absolute p-0 top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDuplicate}
      >
        <CopyIcon/>
      </Button>
      {info.view.type === "dayGridMonth" ? (
        <div
          style={{ background: info.backgroundColor }}
          className={`flex flex-col rounded-md w-full p-2 line-clamp-1 text-[0.5rem] sm:text-[0.6rem] md:text-xs`}
        >
          <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-950 truncate">
              {event.title}
            </p>
          </div>
          {/* <p className="text-gray-800">{startTimeStr}</p>
          <p className="text-gray-800">{endTimeStr}</p> */}
        </div>
      ) : (
        <div
          className={`flex flex-col rounded-md w-full p-1 line-clamp-1 text-[0.5rem] sm:text-[0.6rem] md:text-xs`}
        >
          <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-950 truncate">
              {event.title}
            </p>
          </div>
          {timeDifference > 30 && (
            <p className="text-gray-800 line-clamp-1">{`${startTimeStr} - ${endTimeStr}`}</p>
          )}
          {/* <p className="text-gray-800">{startTimeStr}</p>
          <p className="text-gray-800">{endTimeStr}</p> */}
        </div>
      )}
    </div>
  );
}