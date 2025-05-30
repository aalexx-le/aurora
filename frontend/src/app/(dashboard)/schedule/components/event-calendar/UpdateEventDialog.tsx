"use client";

import { GET_EVENTS, UPDATE_EVENT } from "@/api/schedule/event";
import { CreateOrUpdateDialog } from "@/components/crud/create-or-update-dialog";
import { Dialog } from "@/components/ui/dialog";
import { UpdateEventMutation, UpdateEventMutationVariables } from "@/gql/graphql";
import { CreateEventInput, createEventSchema } from "@/lib/schema/event";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useEventCalendar } from "../../event-calendar-provider";
import { DeleteEventDialog } from "./DeleteEventDialog";
import { GetEventForm } from "./getEventForm";
import { Event } from "./types";

interface UpdateEventDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog>  {
  event: Event
}

export function UpdateEventDialog({ event }: UpdateEventDialogProps) {
  const { setEventEditOpen, eventEditOpen } = useEventCalendar();
  const [updateEvent] = useMutation<UpdateEventMutation, UpdateEventMutationVariables>(UPDATE_EVENT, {
    refetchQueries: [GET_EVENTS],
  });

  const defaultValues = useMemo<CreateEventInput>(() => ({
    name: event.name,
    description: event.description || undefined,
    startDate: new Date(event.startDate),
    endDate: new Date(event.endDate),
    allDay: event.allDay,
    categoryId: event.category.id,
    color: event.color || '',
    recurrence: event.recurrence ? {
      type: event.recurrence.type,
      interval: event.recurrence.interval,
      daysOfWeek: event.recurrence.daysOfWeek || undefined,
      dayOfMonth: event.recurrence.dayOfMonth || undefined,
      weekOfMonth: event.recurrence.weekOfMonth || undefined,
      dayOfWeek: event.recurrence.dayOfWeek || undefined,
      endDate: event.recurrence.endDate ? new Date(event.recurrence.endDate) : undefined,
      endCount: event.recurrence.endCount || undefined,
    } : undefined
  }), [event]);

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventSchema),
    defaultValues
  })

  const handleSubmit = async (data: CreateEventInput) => {
    await updateEvent({
      variables: { 
        id: event.id,
        data
      }
    });
  };

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  return (
    <CreateOrUpdateDialog<CreateEventInput>
      title="Edit Event"
      form={form}
      formSchema={createEventSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      open={eventEditOpen}
      onOpenChange={setEventEditOpen}
      showTrigger={false}
      actionButtons={[
        <DeleteEventDialog event={event} key={1}/>,
      ]}
      isUpdate
    >
      {(form) => GetEventForm(form)}
    </CreateOrUpdateDialog>
  );
}
