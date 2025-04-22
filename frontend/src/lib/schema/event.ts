import { RecurrenceType } from "@/gql/graphql";
import { z } from "zod";

export const createEventSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    description: z.string().optional(),
    startDate: z.date({ required_error: "Please select a start time" }),
    endDate: z.date({ required_error: "Please select an end time" }),
    color: z.string().optional(),
    allDay: z.boolean(),
    categoryId: z.number().gt(0, "Please select a category"),
    reminderMinutes: z.number().int().min(0).max(1440).nullable().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

