import { registerEnumType } from '@nestjs/graphql';

export enum AssetBalanceScalarFieldEnum {
    id = "id",
    assetInfoId = "assetInfoId",
    balance = "balance",
    locked = "locked",
    cryptoPortfolioId = "cryptoPortfolioId"
}


registerEnumType(AssetBalanceScalarFieldEnum, { name: 'AssetBalanceScalarFieldEnum', description: undefined })
