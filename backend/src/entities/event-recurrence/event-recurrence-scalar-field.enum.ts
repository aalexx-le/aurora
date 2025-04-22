import { registerEnumType } from '@nestjs/graphql';

export enum EventRecurrenceScalarFieldEnum {
    id = "id",
    type = "type",
    interval = "interval",
    daysOfWeek = "daysOfWeek",
    dayOfMonth = "dayOfMonth",
    weekOfMonth = "weekOfMonth",
    dayOfWeek = "dayOfWeek",
    endDate = "endDate",
    endCount = "endCount",
    userId = "userId",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}


registerEnumType(EventRecurrenceScalarFieldEnum, { name: 'EventRecurrenceScalarFieldEnum', description: undefined })
