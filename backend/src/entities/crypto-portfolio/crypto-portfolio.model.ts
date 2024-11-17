import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { TradingType } from '../prisma/trading-type.enum';
import { AssetBalance } from '../asset-balance/asset-balance.model';
import { User } from '../user/user.model';
import { HistoricalCryptoBalance } from '../historical-crypto-balance/historical-crypto-balance.model';

@ObjectType()
export class CryptoPortfolio {

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => String, {nullable:false,defaultValue:'binance'})
    exchanges!: string;

    @Field(() => TradingType, {nullable:false})
    tradingType!: keyof typeof TradingType;

    @Field(() => String, {nullable:false})
    apiKey!: string;

    @Field(() => String, {nullable:false})
    secretKey!: string;

    @Field(() => Date, {nullable:true})
    updateTime!: Date | null;

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:true})
    investmentCategoryName!: string | null;

    @Field(() => [AssetBalance], {nullable:true})
    balances?: Array<AssetBalance>;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => [HistoricalCryptoBalance], {nullable:true})
    historicalBalances?: Array<HistoricalCryptoBalance>;
}
