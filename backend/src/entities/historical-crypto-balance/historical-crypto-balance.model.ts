import { Field, Float, ObjectType } from "@nestjs/graphql";
import { CryptoPortfolio } from "../crypto-portfolio/crypto-portfolio.model";

@ObjectType()
export class HistoricalCryptoBalance {

    @Field(() => Date, {nullable:false})
    time!: Date;

    @Field(() => Float, {nullable:false})
    estimatedBalance!: number;

    @Field(() => Float, {nullable:false})
    changePercent!: number;

    @Field(() => Float, {nullable:false})
    changeBalance!: number;

    @Field(() => String, {nullable:false})
    cryptoPortfolioId!: string;

    @Field(() => CryptoPortfolio, {nullable:false})
    cryptoPortfolio?: CryptoPortfolio;
}
