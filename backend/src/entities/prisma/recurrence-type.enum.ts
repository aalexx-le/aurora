import { registerEnumType } from '@nestjs/graphql';

export enum RecurrenceType {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}


registerEnumType(RecurrenceType, { name: 'RecurrenceType', description: undefined })
