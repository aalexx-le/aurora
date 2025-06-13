import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { MembershipDiscount } from '../membership-discount/membership-discount.model';
import { MembershipPrice } from '../membership-price/membership-price.model';

@ObjectType()
export class MembershipDiscountPrice {

    @Field(() => String, {nullable:false})
    discountId!: string;

    @Field(() => String, {nullable:false})
    priceId!: string;

    @Field(() => MembershipDiscount, {nullable:false})
    discount?: MembershipDiscount;

    @Field(() => MembershipPrice, {nullable:false})
    price?: MembershipPrice;
}
