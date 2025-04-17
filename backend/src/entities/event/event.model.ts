import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Recurrence } from '../recurrence/recurrence.model';
import { User } from '../user/user.model';
import { EventCategory } from '../event-category/event-category.model';

@ObjectType()
export class Event {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => Date, {nullable:false})
    startDate!: Date;

    @Field(() => Date, {nullable:false})
    endDate!: Date;

    @Field(() => Boolean, {defaultValue:false,nullable:false})
    allDay!: boolean;

    @Field(() => String, {nullable:true})
    color!: string | null;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => Int, {nullable:false})
    categoryId!: number;

    @Field(() => Int, {nullable:true})
    reminderMinutes!: number | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Recurrence, {nullable:true})
    recurrence?: Recurrence | null;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => EventCategory, {nullable:false})
    category?: EventCategory;
}
