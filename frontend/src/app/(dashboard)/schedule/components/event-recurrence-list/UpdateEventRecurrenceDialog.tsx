import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RecurrenceType } from "@/gql/graphql";
import { RecurrenceInput, recurrenceSchema } from "@/lib/schema/eventRecurrence";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { RecurrenceForm } from "./RecurrenceForm";
import { EventRecurrence } from "./types";
import { useUpdateEventRecurrenceMutation } from "./useUpdateEventRecurrenceMutation";

interface UpdateEventRecurrenceDialogProps {
  recurrence: EventRecurrence;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UpdateEventRecurrenceDialog = ({
  recurrence,
  open,
  onOpenChange,
}: UpdateEventRecurrenceDialogProps) => {
  const { handleUpdateRecurrence, loading } = useUpdateEventRecurrenceMutation();

  const defaultValues = useMemo<RecurrenceInput>(() => ({
    type: recurrence.type as RecurrenceType || RecurrenceType.Daily,
    interval: recurrence.interval || 1,
    daysOfWeek: recurrence.daysOfWeek || "",
    dayOfMonth: recurrence.dayOfMonth || undefined,
    dayOfWeek: recurrence.dayOfWeek || undefined,
    weekOfMonth: recurrence.weekOfMonth || undefined,
    endDate: recurrence.endDate ? new Date(recurrence.endDate) : undefined,
    endCount: recurrence.endCount || undefined,
  }), [recurrence]);

  const form = useForm<RecurrenceInput>({
    resolver: zodResolver(recurrenceSchema),
    defaultValues
  });

  const handleSubmit = async (data: RecurrenceInput) => {
    const success = await handleUpdateRecurrence({
      id: recurrence.id,
      ...data,
    });
    if (success) {
      onOpenChange(false);
    }
    return success;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Recurrence Template</DialogTitle>
          <DialogDescription>
            Modify this recurrence template for your recurring events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Template Details</h3>
                <p className="text-sm text-muted-foreground">
                  Update this recurrence pattern for your events.
                </p>
              </div>
              
              <RecurrenceForm 
                form={form}
                setRecurrenceSummary={() => {}}
              />

              <div className="flex justify-end mt-4">
                <button
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Recurrence"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 