import { registerEnumType } from '@nestjs/graphql';

export enum TimePeriodScalarFieldEnum {
    id = "id",
    interval = "interval",
    frequency = "frequency"
}


registerEnumType(TimePeriodScalarFieldEnum, { name: 'TimePeriodScalarFieldEnum', description: undefined })
