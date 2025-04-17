import { registerEnumType } from '@nestjs/graphql';

export enum EventCategoryScalarFieldEnum {
    id = "id",
    name = "name",
    color = "color",
    userId = "userId"
}


registerEnumType(EventCategoryScalarFieldEnum, { name: 'EventCategoryScalarFieldEnum', description: undefined })
