import { registerEnumType } from '@nestjs/graphql';

export enum OKXCryptoPortfolioScalarFieldEnum {
    id = "id",
    cryptoPortfolioId = "cryptoPortfolioId",
    passphrase = "passphrase"
}


registerEnumType(OKXCryptoPortfolioScalarFieldEnum, { name: 'OKXCryptoPortfolioScalarFieldEnum', description: undefined })
