import { registerEnumType } from '@nestjs/graphql';

export enum PaddlePaymentTransactionScalarFieldEnum {
    id = "id",
    paymentTransactionId = "paymentTransactionId"
}


registerEnumType(PaddlePaymentTransactionScalarFieldEnum, { name: 'PaddlePaymentTransactionScalarFieldEnum', description: undefined })
