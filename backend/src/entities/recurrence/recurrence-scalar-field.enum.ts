import { registerEnumType } from '@nestjs/graphql';

export enum RecurrenceScalarFieldEnum {
    id = "id",
    type = "type",
    interval = "interval",
    daysOfWeek = "daysOfWeek",
    dayOfMonth = "dayOfMonth",
    weekOfMonth = "weekOfMonth",
    dayOfWeek = "dayOfWeek",
    endDate = "endDate",
    endCount = "endCount",
    eventId = "eventId",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}


registerEnumType(RecurrenceScalarFieldEnum, { name: 'RecurrenceScalarFieldEnum', description: undefined })
