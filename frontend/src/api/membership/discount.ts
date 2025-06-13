import { graphql } from "@/gql";

// Query to get all discounts
export const GET_DISCOUNTS = graphql(`
    query GetDiscounts {
        getDiscounts {
            id
            name
            description
            code
            type
            value
            currencyCode
            maxAmount
            isActive
            startDate
            endDate
            maxUses
            currentUses
            maxUsesPerUser
            targetType
            createdAt
            updatedAt
            prices {
                priceId
            }
            usageHistory {
                discountId
                membershipSubscriptionId
                originalAmount
                discountAmount
                finalAmount
                currencyCode
                usedAt
                ipAddress
                userAgent
            }
        }
    }
`);

// Query to get a specific discount by ID
export const GET_DISCOUNT = graphql(`
    query GetDiscount($id: String!) {
        getDiscount(id: $id) {
            id
            name
            description
            code
            type
            value
            currencyCode
            maxAmount
            isActive
            startDate
            endDate
            maxUses
            currentUses
            maxUsesPerUser
            targetType
            createdAt
            updatedAt
            prices {
                priceId
            }
            usageHistory {
                discountId
                membershipSubscriptionId
                originalAmount
                discountAmount
                finalAmount
                currencyCode
                usedAt
                ipAddress
                userAgent
            }
        }
    }
`);

// Mutation to create a new discount
export const CREATE_DISCOUNT = graphql(`
    mutation CreateDiscount($data: CreateDiscountDto!) {
        createDiscount(data: $data) {
            id
            name
            description
            code
            type
            value
            currencyCode
            maxAmount
            isActive
            startDate
            endDate
            maxUses
            currentUses
            maxUsesPerUser
            targetType
            createdAt
            updatedAt
        }
    }
`);

// Mutation to update an existing discount
export const UPDATE_DISCOUNT = graphql(`
    mutation UpdateDiscount($id: String!, $data: UpdateDiscountDto!) {
        updateDiscount(id: $id, data: $data) {
            id
            name
            description
            code
            type
            value
            currencyCode
            maxAmount
            isActive
            startDate
            endDate
            maxUses
            currentUses
            maxUsesPerUser
            targetType
            createdAt
            updatedAt
        }
    }
`);

// Mutation to delete a discount
export const DELETE_DISCOUNT = graphql(`
    mutation DeleteDiscount($id: String!) {
        deleteDiscount(id: $id)
    }
`);

// Query to validate a discount code
export const VALIDATE_DISCOUNT_CODE = graphql(`
    query ValidateDiscountCode($data: ValidateDiscountDto!) {
        validateDiscountCode(data: $data) {
            isValid
            discount {
                id
                name
                description
                code
                type
                value
                currencyCode
                maxAmount
                targetType
            }
            originalAmount
            discountAmount
            finalAmount
            errorCode
        }
    }
`); 

// Query to get discounts for a specific price
export const GET_DISCOUNTS_FOR_PRICE = graphql(`
    query GetDiscountsForPrice($priceId: String!) {
        getDiscountsForPrice(priceId: $priceId) {
            id
            name
            description
            code
            type
            value
            currencyCode
            maxAmount
            isActive
            startDate
            endDate
            maxUses
            currentUses
            maxUsesPerUser
            targetType
            createdAt
            updatedAt
        }
    }
`); 