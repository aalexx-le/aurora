import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import {
    CatalogType,
    CurrencyCode,
    Interval,
    Status,
    TaxCategory,
    TaxMode,
} from "@paddle/paddle-node-sdk";

@ObjectType()
export class TimePeriod {
    @Field(() => String)
    interval: Interval;

    @Field(() => Int)
    frequency: number;
}

@ObjectType()
export class PaddlePriceQuantity {
    @Field(() => Int)
    minimum: number;

    @Field(() => Int)
    maximum: number;
}

@ObjectType()
export class PaddleUnitPrice {
    @Field(() => String)
    amount: string;

    @Field(() => String)
    currencyCode: CurrencyCode;
}

@ObjectType()
export class PaddleProduct {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    type?: CatalogType;

    @Field(() => String)
    taxCategory: TaxCategory;

    @Field({ nullable: true })
    imageUrl?: string;

    @Field(() => String)
    status: Status;

    @Field({ nullable: true })
    createdAt?: Date;
}

@ObjectType()
export class PaddlePrice {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    productId: string;

    @Field()
    description: string;

    @Field(() => TimePeriod, { nullable: true })
    billingCycle?: TimePeriod;

    @Field(() => TimePeriod, { nullable: true })
    trialPeriod?: TimePeriod;

    @Field(() => PaddlePriceQuantity)
    quantity: PaddlePriceQuantity;

    @Field(() => String)
    taxMode: TaxMode;

    @Field(() => PaddleUnitPrice, { nullable: true })
    unitPrice?: PaddleUnitPrice;

    @Field(() => String)
    status: Status;

    @Field({ nullable: true })
    createdAt?: Date;
}

@ObjectType()
export class PaddleDiscount {
    @Field(() => ID)
    id: string;

    @Field()
    description: string;

    @Field(() => String)
    type: string;

    @Field()
    amount: string;

    @Field({ nullable: true })
    currencyCode?: string;

    @Field({ nullable: true })
    enabledForCheckout?: boolean;

    @Field({ nullable: true })
    code?: string;

    @Field({ nullable: true })
    recur?: boolean;

    @Field(() => Int, { nullable: true })
    maximumRecurringIntervals?: number;

    @Field(() => Int, { nullable: true })
    usageLimit?: number;

    @Field(() => [String], { nullable: true })
    restrictTo?: string[];

    @Field({ nullable: true })
    expiresAt?: string;

    @Field(() => String)
    status: Status;

    @Field({ nullable: true })
    createdAt?: Date;
}
