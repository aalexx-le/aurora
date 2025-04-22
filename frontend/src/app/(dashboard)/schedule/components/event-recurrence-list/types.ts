import { GetRecurrenceTemplatesQuery } from "@/gql/graphql";

export type EventRecurrence =
    GetRecurrenceTemplatesQuery["getRecurrenceTemplates"][number];

export enum RecurrenceActionType {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
}

export interface RecurrenceAction {
    type: RecurrenceActionType;
    recurrence?: EventRecurrence;
}
