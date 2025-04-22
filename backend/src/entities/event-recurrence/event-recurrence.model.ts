import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { RecurrenceType } from '../prisma/recurrence-type.enum';
import { Event } from '../event/event.model';
import { User } from '../user/user.model';

@ObjectType()
export class EventRecurrence {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => RecurrenceType, {nullable:false})
    type!: `${RecurrenceType}`;

    @Field(() => Int, {defaultValue:1,nullable:false})
    interval!: number;

    @Field(() => String, {nullable:true})
    daysOfWeek!: string | null;

    @Field(() => Int, {nullable:true})
    dayOfMonth!: number | null;

    @Field(() => Int, {nullable:true})
    weekOfMonth!: number | null;

    @Field(() => Int, {nullable:true})
    dayOfWeek!: number | null;

    @Field(() => Date, {nullable:true})
    endDate!: Date | null;

    @Field(() => Int, {nullable:true})
    endCount!: number | null;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => [Event], {nullable:true})
    events?: Array<Event>;

    @Field(() => User, {nullable:false})
    user?: User;
}
