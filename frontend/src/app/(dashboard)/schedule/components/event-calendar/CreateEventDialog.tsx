"use client";

import { CreateOrUpdateDialog } from "@/components/crud/create-or-update-dialog";
import { Button } from "@/components/ui/button";
import { RecurrenceType } from "@/gql/graphql";
import { CreateEventInput, createEventSchema } from "@/lib/schema/event";
import { RecurrenceInput, recurrenceSchema } from "@/lib/schema/eventRecurrence";
import { CalendarView } from "@/lib/utils/calendar/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useEventCalendar } from "../../event-calendar-provider";
import { GetEventForm } from "./getEventForm";
import { useCreateEvent } from "./useCreateEvent";

interface CreateEventDialogProps {
}

export function CreatEventDialog({}: CreateEventDialogProps) {
  const { eventAddOpen, setEventAddOpen, eventAddStartTime, eventAddEndTime, currentView, setEventAddStartTime, setEventAddEndTime } = useEventCalendar();
  const [createEvent] = useCreateEvent()

  const eventDefaultValues = useMemo<CreateEventInput>(() => ({
    name: "",
    description: "",
    startDate: eventAddStartTime,
    endDate: eventAddEndTime,
    allDay: false,
    categoryId: 0,
    hasRecurrence: false,
  }), [eventAddStartTime, eventAddEndTime]);

  const recurrenceDefaultValues = useMemo<RecurrenceInput>(() => ({
    type: RecurrenceType.Daily,
    interval: 1,
  }), []);

  const eventForm = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues: eventDefaultValues
  });

  const recurrenceForm = useForm<RecurrenceInput>({
    resolver: zodResolver(recurrenceSchema),
    defaultValues: recurrenceDefaultValues
  });

  // useEffect(() => {
  //   if (eventAddOpen) {
  //     eventForm.reset(eventDefaultValues);
  //   }
  // }, [eventAddOpen, eventDefaultValues, eventForm]);

  // useEffect(() => {
  //   if (eventAddOpen) {
  //     recurrenceForm.reset(recurrenceDefaultValues);
  //   }
  // }, [eventAddOpen, recurrenceDefaultValues, recurrenceForm]);

  const handleSubmit = async (data: CreateEventInput) => {
    const { hasRecurrence, ...eventData } = data;
    const recurrence = hasRecurrence ? recurrenceForm.getValues() : null;
    await createEvent({
      variables: { data: { ...eventData, recurrence } }
    })
  };

  const handleAddEvent = () => {
    if (currentView === CalendarView.DayGridMonth) {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      setEventAddStartTime(startDate);
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      setEventAddEndTime(endDate);
    }
  }

  return (
    <CreateOrUpdateDialog<CreateEventInput>
      open={eventAddOpen}
      onOpenChange={setEventAddOpen}
      title="Add Event"
      formSchema={createEventSchema}
      defaultValues={eventDefaultValues}
      onSubmit={handleSubmit}
      triggerButton={
        <Button onClick={handleAddEvent}>
          <PlusIcon/>
          <p>Add Event</p>
        </Button>
      }
      form={eventForm}
    >
      {(form) => GetEventForm(form, recurrenceForm)}
    </CreateOrUpdateDialog>
  );
}
