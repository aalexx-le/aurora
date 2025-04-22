import { registerEnumType } from '@nestjs/graphql';

export enum PaymentTransactionScalarFieldEnum {
    id = "id",
    membershipSubscriptionId = "membershipSubscriptionId",
    userId = "userId",
    amount = "amount",
    currency = "currency",
    status = "status",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}


registerEnumType(PaymentTransactionScalarFieldEnum, { name: 'PaymentTransactionScalarFieldEnum', description: undefined })
