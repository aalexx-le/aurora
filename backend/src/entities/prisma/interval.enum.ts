import { registerEnumType } from '@nestjs/graphql';

export enum Interval {
    day = "day",
    week = "week",
    month = "month",
    year = "year"
}


registerEnumType(Interval, { name: 'Interval', description: undefined })
