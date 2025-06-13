import {
    CREATE_DISCOUNT,
    DELETE_DISCOUNT,
    GET_DISCOUNT,
    GET_DISCOUNTS,
    GET_DISCOUNTS_FOR_PRICE,
    UPDATE_DISCOUNT,
    VALIDATE_DISCOUNT_CODE
} from "@/api/membership/discount";
import type {
    CreateDiscountMutation,
    CreateDiscountMutationVariables,
    DeleteDiscountMutation,
    DeleteDiscountMutationVariables,
    GetDiscountQuery,
    GetDiscountQueryVariables,
    GetDiscountsForPriceQuery,
    GetDiscountsForPriceQueryVariables,
    GetDiscountsQuery,
    UpdateDiscountMutation,
    UpdateDiscountMutationVariables,
    ValidateDiscountCodeQuery,
    ValidateDiscountCodeQueryVariables
} from "@/gql/graphql";
import { useLazyQuery, useMutation, useQuery, useSuspenseQuery } from "@apollo/client";

// Query hooks
export const useDiscountsQuery = () => {
    return useSuspenseQuery<GetDiscountsQuery>(GET_DISCOUNTS, {
        fetchPolicy: 'cache-and-network',
    });
};

export const useDiscountQuery = (id: string) => {
    return useQuery<GetDiscountQuery, GetDiscountQueryVariables>(GET_DISCOUNT, {
        variables: { id },
        skip: !id,
    });
};

export const useDiscountsForPriceQuery = (priceId: string) => {
    const { data, loading, error } = useQuery<GetDiscountsForPriceQuery, GetDiscountsForPriceQueryVariables>(GET_DISCOUNTS_FOR_PRICE, {
        variables: { priceId },
        skip: !priceId,
        fetchPolicy: 'cache-and-network',
    });

    return {
        data: data?.getDiscountsForPrice || [],
        loading,
        error,
    }
};

export const useValidateDiscountCode = () => {
    return useLazyQuery<ValidateDiscountCodeQuery, ValidateDiscountCodeQueryVariables>(VALIDATE_DISCOUNT_CODE);
};

// Mutation hooks
export const useCreateDiscount = () => {
    return useMutation<CreateDiscountMutation, CreateDiscountMutationVariables>(CREATE_DISCOUNT, {
        refetchQueries: [{ query: GET_DISCOUNTS }],
    });
};

export const useUpdateDiscount = () => {
    return useMutation<UpdateDiscountMutation, UpdateDiscountMutationVariables>(UPDATE_DISCOUNT, {
        refetchQueries: [{ query: GET_DISCOUNTS }],
    });
};

export const useDeleteDiscount = () => {
    return useMutation<DeleteDiscountMutation, DeleteDiscountMutationVariables>(DELETE_DISCOUNT, {
        refetchQueries: [{ query: GET_DISCOUNTS }],
    });
}; 