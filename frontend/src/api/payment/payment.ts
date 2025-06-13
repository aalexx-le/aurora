import { graphql } from "@/gql";

export const GET_PAYMENT_METHODS = graphql(`
    query GetPaymentMethods {
        getPaymentMethods {
            id
            provider
            paddlePaymentMethod {
                id
                customerId
                addressId
                businessId
            }
            metaMaskPaymentMethod {
                id
                walletAddress
                ensName
            }
        }
    }
`);

// MetaMask Payment Mutations
export const CREATE_METAMASK_PAYMENT_METHOD = graphql(`
    mutation CreateMetaMaskPaymentMethod(
        $input: CreateMetaMaskPaymentMethodDto!
    ) {
        createMetaMaskPaymentMethod(input: $input)
    }
`);

export const CREATE_METAMASK_SUBSCRIPTION_FROM_SESSION = graphql(`
    mutation CreateMetaMaskSubscriptionFromSession(
        $input: CreateMetaMaskSubscriptionFromSessionDto!
    ) {
        createMetaMaskSubscriptionFromSession(input: $input)
    }
`);

// MetaMask Payment Queries
export const GET_CRYPTO_PRICE = graphql(`
    query GetCryptoPrice($tokenSymbol: String!, $usdAmount: Float!) {
        getCryptoPrice(tokenSymbol: $tokenSymbol, usdAmount: $usdAmount) {
            tokenAmount
            tokenSymbol
            usdPrice
        }
    }
`);
