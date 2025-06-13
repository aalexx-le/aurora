import { registerEnumType } from '@nestjs/graphql';

export enum PaymentProvider {
    PADDLE = "PADDLE",
    METAMASK = "METAMASK"
}


registerEnumType(PaymentProvider, { name: 'PaymentProvider', description: undefined })
