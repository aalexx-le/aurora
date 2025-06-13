import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { DiscountType } from '../prisma/discount-type.enum';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';
import { Decimal } from '@prisma/client/runtime/library';
import { Int } from '@nestjs/graphql';
import { DiscountTargetType } from '../prisma/discount-target-type.enum';
import { MembershipDiscountUsage } from '../membership-discount-usage/membership-discount-usage.model';
import { MembershipDiscountPrice } from '../membership-discount-price/membership-discount-price.model';

@ObjectType()
export class MembershipDiscount {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => String, {nullable:true})
    code!: string | null;

    @Field(() => DiscountType, {nullable:false})
    type!: `${DiscountType}`;

    @Field(() => GraphQLDecimal, {nullable:false})
    value!: Decimal;

    @Field(() => String, {nullable:true})
    currencyCode!: string | null;

    @Field(() => GraphQLDecimal, {nullable:true})
    maxAmount!: Decimal | null;

    @Field(() => Boolean, {defaultValue:true,nullable:false})
    isActive!: boolean;

    @Field(() => Date, {nullable:true})
    startDate!: Date | null;

    @Field(() => Date, {nullable:true})
    endDate!: Date | null;

    @Field(() => Int, {nullable:true})
    maxUses!: number | null;

    @Field(() => Int, {defaultValue:1,nullable:true})
    maxUsesPerUser!: number | null;

    @Field(() => Int, {defaultValue:0,nullable:false})
    currentUses!: number;

    @Field(() => DiscountTargetType, {defaultValue:'FIRST_TIME_USER',nullable:false})
    targetType!: `${DiscountTargetType}`;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => [MembershipDiscountUsage], {nullable:true})
    usageHistory?: Array<MembershipDiscountUsage>;

    @Field(() => [MembershipDiscountPrice], {nullable:true})
    prices?: Array<MembershipDiscountPrice>;
}
