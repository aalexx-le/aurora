import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OKXCryptoPortfolio {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    cryptoPortfolioId!: string;

    @Field(() => String, {nullable:false})
    passphrase!: string;
}
