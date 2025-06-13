import { graphql } from "@/gql";

export const CREATE_PAYMENT_SESSION = graphql(`
  mutation CreatePaymentSession($data: CreatePaymentSessionDto!) {
    createPaymentSession(data: $data) {
      sessionId
      planId    
      priceId
      discountId
      discountAmount
      finalAmount
      expiresAt
    }
  }
`);

export const GET_PAYMENT_SESSION = graphql(`
  query GetPaymentSession($data: GetPaymentSessionDto!) {
    getPaymentSession(data: $data) {
      sessionId
      planId
      priceId
      discountId
      discountAmount
      finalAmount
      expiresAt
    }
  }
`);