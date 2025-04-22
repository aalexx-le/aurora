import { GET_EVENTS, REMOVE_EVENT } from "@/api/scripts/schedule/event"; // Assuming this is the mutation for deleting an event
import { Button } from "@/components/ui/button";
import { RemoveEventCategoryMutationVariables, RemoveEventMutation } from "@/gql/graphql";
import { useMutation } from "@apollo/client";
import { Trash } from "lucide-react";
import * as React from "react";
import { Event } from "./types";
import { useEventCalendar } from "../../event-calendar-provider";

interface IProps {
    event: Event;
}

export function DeleteEventDialog({ event }: IProps) {
    const { setEventEditOpen } = useEventCalendar();
    const [removeEvent] = useMutation<RemoveEventMutation, RemoveEventCategoryMutationVariables>(REMOVE_EVENT, {
        refetchQueries: [GET_EVENTS],
    });
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()

        await removeEvent({ variables: { id: Number(event.id) } });
        setEventEditOpen(false);
    };
    return (
        // <DeleteDialog
        //     open={eventDeleteOpen}
        //     onOpenChange={setEventDeleteOpen}
        //     rows={[event]}
        //     showTrigger={true}
        //     onDelete={handleDelete}
        // />
        <Button type="button" variant="destructive" onClick={(e) => handleDelete(e)}>
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete
        </Button>
    )
}