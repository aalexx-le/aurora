import { registerEnumType } from '@nestjs/graphql';

export enum PassphraseCryptoPortfolioScalarFieldEnum {
    id = "id",
    cryptoPortfolioId = "cryptoPortfolioId",
    passphrase = "passphrase"
}


registerEnumType(PassphraseCryptoPortfolioScalarFieldEnum, { name: 'PassphraseCryptoPortfolioScalarFieldEnum', description: undefined })
