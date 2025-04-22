import { registerEnumType } from '@nestjs/graphql';

export enum UnitPriceScalarFieldEnum {
    id = "id",
    amount = "amount",
    currencyCode = "currencyCode"
}


registerEnumType(UnitPriceScalarFieldEnum, { name: 'UnitPriceScalarFieldEnum', description: undefined })
