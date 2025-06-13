import { registerEnumType } from '@nestjs/graphql';

export enum MetaMaskPaymentTransactionScalarFieldEnum {
    id = "id",
    paymentTransactionId = "paymentTransactionId",
    transactionHash = "transactionHash",
    tokenAddress = "tokenAddress",
    tokenSymbol = "tokenSymbol",
    blockNumber = "blockNumber",
    gasUsed = "gasUsed",
    gasPrice = "gasPrice"
}


registerEnumType(MetaMaskPaymentTransactionScalarFieldEnum, { name: 'MetaMaskPaymentTransactionScalarFieldEnum', description: undefined })
