'use client';

import { DeleteDialog } from "@/components/crud/delete-dialog";
import { EmptyState } from "@/components/error-ui/EmptyState";
import { Card } from "@/components/ui/card";
import { DataTableRowActionType } from "@/types";
import { Repeat } from "lucide-react";
import { useState } from "react";
import { EventRecurrenceActionButton } from "./EventRecurrenceActionButton";
import { EventRecurrenceBadge } from "./EventRecurrenceBadge";
import { EventRecurrence } from "./types";
import { UpdateEventRecurrenceDialog } from "./UpdateEventRecurrenceDialog";
import { useDeleteEventRecurrenceMutation } from "./useDeleteEventRecurrenceMutation";
import { useEventRecurrencesQuery } from "./useEventRecurrencesQuery";
import { EventRecurrenceListSkeleton } from "../skeletons";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const EventRecurrenceList = () => {
    const [action, setAction] = useState<DataTableRowActionType | null>(null);
    const [recurrence, setRecurrence] = useState<EventRecurrence | null>(null);

    const { recurrences, loading } = useEventRecurrencesQuery();
    const { handleDeleteRecurrence } = useDeleteEventRecurrenceMutation();

    if (loading) {
        return <EventRecurrenceListSkeleton />;
    }

    return (
        <Card className="p-4 h-min">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-muted-foreground tracking-wide">
                        Recurrence
                    </h2>
                    {/* <CreateEventRecurrenceDialog /> */}
                </div>

                {!recurrences || recurrences.length === 0 ? (
                    <EmptyState
                        title="No recurrences found"
                        description="There are no recurrence patterns available."
                        icon={Repeat}
                        className="py-8 bg-transparent border-none"
                    />
                ) : (
                    recurrences.map((rec: EventRecurrence) => (
                        <div className="grid gap-2" key={rec.id}>
                            <div className="flex gap-4 items-center justify-between rounded-lg overflow-hidden w-full">
                                <EventRecurrenceActionButton
                                    row={rec}
                                    setAction={(v) => {
                                        setAction(v);
                                        setRecurrence(rec);
                                    }}
                                >
                                    <EventRecurrenceBadge
                                        recurrence={rec}
                                    />
                                </EventRecurrenceActionButton>
                            </div>
                        </div>
                    ))
                )}

                {recurrence && (
                    <>
                        <UpdateEventRecurrenceDialog
                            recurrence={recurrence}
                            open={action === DataTableRowActionType.UPDATE}
                            onOpenChange={() => setAction(null)}
                        />

                        <DeleteDialog
                            rows={[recurrence]}
                            open={action === DataTableRowActionType.DELETE}
                            onOpenChange={() => setAction(null)}
                            onDelete={handleDeleteRecurrence(Number(recurrence.id))}
                            showTrigger={false}
                        />
                    </>
                )}
            </div>
        </Card>
    );
};

export default EventRecurrenceList; 