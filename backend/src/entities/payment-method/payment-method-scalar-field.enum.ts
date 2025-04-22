import { registerEnumType } from '@nestjs/graphql';

export enum PaymentMethodScalarFieldEnum {
    id = "id",
    userId = "userId",
    provider = "provider"
}


registerEnumType(PaymentMethodScalarFieldEnum, { name: 'PaymentMethodScalarFieldEnum', description: undefined })
