import gql from "graphql-tag";

export const GET_PAYMENT_METHODS = gql`
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
        }
    }
`;
