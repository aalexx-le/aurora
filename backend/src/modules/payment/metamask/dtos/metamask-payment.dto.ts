import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import {
    IsEthereumAddress,
    IsInt,
    IsNumberString,
    IsOptional,
    IsString
} from "class-validator";

@InputType()
export class CreateMetaMaskPaymentMethodDto {
    @Field()
    @IsEthereumAddress()
    walletAddress: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    ensName?: string;
}

@InputType()
export class CreateMetaMaskTransactionDto {
    @Field()
    @IsString()
    transactionHash: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    tokenAddress?: string;

    @Field()
    @IsString()
    tokenSymbol: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    blockNumber?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    gasUsed?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    gasPrice?: string;

    @Field(() => Int)
    @IsInt()
    paymentTransactionId: number;
}

@InputType()
export class CreateMetaMaskSubscriptionDto {
    @Field(() => String)
    @IsString()
    planId: string;

    @Field(() => String)
    @IsString()
    priceId: string;

    @Field()
    @IsString()
    transactionHash: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    tokenAddress?: string;

    @Field()
    @IsString()
    tokenSymbol: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    blockNumber?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    gasUsed?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    gasPrice?: string;
}

@InputType()
export class CreateMetaMaskSubscriptionFromSessionDto {
    @Field(() => String)
    @IsString()
    sessionId: string;

    @Field()
    @IsString()
    transactionHash: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    tokenAddress?: string;

    @Field()
    @IsString()
    tokenSymbol: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    blockNumber?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    gasUsed?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    gasPrice?: string;
}

@ObjectType()
export class PaymentVerificationResult {
    @Field()
    isValid: boolean;

    @Field({ nullable: true })
    reason?: string;

    @Field({ nullable: true })
    estimatedGas?: string;
}

@ObjectType()
export class CryptoPriceResult {
    @Field()
    tokenSymbol: string;

    @Field()
    usdPrice: number;

    @Field()
    tokenAmount: string;
}
