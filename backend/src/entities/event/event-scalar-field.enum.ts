import { registerEnumType } from '@nestjs/graphql';

export enum EventScalarFieldEnum {
    id = "id",
    name = "name",
    description = "description",
    startDate = "startDate",
    endDate = "endDate",
    allDay = "allDay",
    color = "color",
    recurrenceId = "recurrenceId",
    userId = "userId",
    categoryId = "categoryId",
    reminderMinutes = "reminderMinutes",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}


registerEnumType(EventScalarFieldEnum, { name: 'EventScalarFieldEnum', description: undefined })
