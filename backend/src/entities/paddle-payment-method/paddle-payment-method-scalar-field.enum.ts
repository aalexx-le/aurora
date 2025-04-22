import { registerEnumType } from '@nestjs/graphql';

export enum PaddlePaymentMethodScalarFieldEnum {
    id = "id",
    paymentMethodId = "paymentMethodId",
    customerId = "customerId",
    addressId = "addressId",
    businessId = "businessId"
}


registerEnumType(PaddlePaymentMethodScalarFieldEnum, { name: 'PaddlePaymentMethodScalarFieldEnum', description: undefined })
