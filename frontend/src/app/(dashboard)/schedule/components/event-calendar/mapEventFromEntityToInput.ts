import { EventInput } from "@fullcalendar/core/index.js";
import { Event } from "./types";

export function mapEventFromEntityToInput(events: Event[]): EventInput[] {
    return events.map((event) => ({
        id: String(event.id),
        title: event.name,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        allDay: event.allDay,
        color: event.color || event.category?.color,
        backgroundColor: event.color || event.category?.color,
        description: event.description,
        extendedProps: {
            backup: event,
        },
    }));
}
