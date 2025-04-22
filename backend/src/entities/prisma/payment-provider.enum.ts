import { registerEnumType } from '@nestjs/graphql';

export enum PaymentProvider {
    PADDLE = "PADDLE"
}


registerEnumType(PaymentProvider, { name: 'PaymentProvider', description: undefined })
