import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { User } from '../user/user.model';
import { Event } from '../event/event.model';

@ObjectType()
export class EventCategory {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:false})
    color!: string;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => [Event], {nullable:true})
    events?: Array<Event>;
}
