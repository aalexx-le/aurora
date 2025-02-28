import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { CryptoPortfolio } from '../crypto-portfolio/crypto-portfolio.model';

@ObjectType()
export class OKXCryptoPortfolio {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    cryptoPortfolioId!: string;

    @Field(() => String, {nullable:false})
    passphrase!: string;

    @Field(() => CryptoPortfolio, {nullable:false})
    cryptoPortfolio?: CryptoPortfolio;
}
