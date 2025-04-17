"use client";

import { CreateOrUpdateDialog } from "@/components/create-or-update-dialog";
import { Button } from "@/components/ui/button";
import { useEventCalendar } from "@/lib/context/calendar-context";
import { CreateEventInput, createEventSchema } from "@/lib/schema/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { getEventForm } from "./getEventForm";
import { useCreateEvent } from "./useCreateEvent";

interface CreateEventDialogProps {
}

export function CreatEventDialog({}: CreateEventDialogProps) {
  const { eventAddOpen, setEventAddOpen, eventAddStartTime, eventAddEndTime } = useEventCalendar();
  const [createEvent] = useCreateEvent()

  const defaultValues = useMemo<CreateEventInput>(() => ({
    name: "",
    description: "",
    startDate: eventAddStartTime,
    endDate: eventAddEndTime,
    allDay: false,
    categoryId: 0,
    // recurrence: ""
  }), [eventAddStartTime, eventAddEndTime]);

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues
  });

  useEffect(() => {
    if (eventAddOpen) {
      form.reset(defaultValues);
    }
  }, [eventAddOpen, defaultValues, form]);

  const handleSubmit = async (data: CreateEventInput) => {
    await createEvent({
      variables: { data: {
        ...data
      }}
    })
  };

  return (
    <CreateOrUpdateDialog<CreateEventInput>
      open={eventAddOpen}
      onOpenChange={setEventAddOpen}
      title="Add Event"
      formSchema={createEventSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      triggerButton={
        <Button>
          <PlusIcon/>
          <p>Add Event</p>
        </Button>
      }
      form={form}
    >
      {getEventForm}
    </CreateOrUpdateDialog>
  );
}
