import { registerEnumType } from '@nestjs/graphql';

export enum MetaMaskPaymentMethodScalarFieldEnum {
    id = "id",
    paymentMethodId = "paymentMethodId",
    walletAddress = "walletAddress",
    ensName = "ensName"
}


registerEnumType(MetaMaskPaymentMethodScalarFieldEnum, { name: 'MetaMaskPaymentMethodScalarFieldEnum', description: undefined })
