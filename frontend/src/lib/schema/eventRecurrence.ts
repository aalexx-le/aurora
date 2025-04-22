import { RecurrenceType } from "@/gql/graphql";
import { z } from "zod";

// Define recurrence schema
export const recurrenceSchema = z.object({
    type: z.nativeEnum(RecurrenceType),
    interval: z.number().int().min(1),
    daysOfWeek: z.string().optional(),
    dayOfMonth: z.number().int().min(1).max(31).optional(),
    weekOfMonth: z.number().int().min(1).max(5).optional(),
    dayOfWeek: z.number().int().min(0).max(6).optional(),
    endDate: z.date().optional(),
    endCount: z.number().int().min(1).optional(),
});

export type RecurrenceInput = z.infer<typeof recurrenceSchema>;
