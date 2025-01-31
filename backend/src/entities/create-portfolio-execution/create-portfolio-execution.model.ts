import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { CreateExecutionStatus } from '../prisma/create-execution-status.enum';

@ObjectType()
export class CreatePortfolioExecution {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Date, {nullable:true})
    time!: Date | null;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => CreateExecutionStatus, {defaultValue:'QUEUE',nullable:false})
    status!: `${CreateExecutionStatus}`;
}
