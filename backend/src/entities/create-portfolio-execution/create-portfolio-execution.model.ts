import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { PortfolioCreationStep } from '../prisma/portfolio-creation-step.enum';
import { PortfolioCreationMilestone } from '../prisma/portfolio-creation-milestone.enum';
import { ErrorRecoveryAction } from '../prisma/error-recovery-action.enum';
import { Exchanges } from '../prisma/exchanges.enum';
import { GraphQLJSON } from 'graphql-type-json';
import { User } from '../user/user.model';

@ObjectType()
export class CreatePortfolioExecution {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => PortfolioCreationStep, {nullable:true})
    currentStep!: `${PortfolioCreationStep}` | null;

    @Field(() => PortfolioCreationMilestone, {nullable:true})
    currentMilestone!: `${PortfolioCreationMilestone}` | null;

    @Field(() => Int, {defaultValue:0,nullable:false})
    progressPercent!: number;

    @Field(() => String, {nullable:true})
    errorMessage!: string | null;

    @Field(() => ErrorRecoveryAction, {nullable:true})
    recoveryAction!: `${ErrorRecoveryAction}` | null;

    @Field(() => Int, {defaultValue:0,nullable:false})
    retryCount!: number;

    @Field(() => Int, {defaultValue:3,nullable:false})
    maxRetries!: number;

    @Field(() => Exchanges, {nullable:true})
    exchangeType!: `${Exchanges}` | null;

    @Field(() => GraphQLJSON, {nullable:true})
    executionContext!: any | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => Date, {nullable:true})
    completedAt!: Date | null;

    @Field(() => User, {nullable:false})
    user?: User;
}
