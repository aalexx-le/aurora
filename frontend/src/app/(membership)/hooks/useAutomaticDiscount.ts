import { DiscountType } from '@/gql/graphql';
import { useMemo } from 'react';
import { useDiscountsForPriceQuery } from './useDiscount';

export function useAutomaticDiscount(priceId: string) {
    const { data: automaticDiscounts, loading } = useDiscountsForPriceQuery(priceId);

    // Find the best automatic discount (highest value)
    const bestAutomaticDiscount = automaticDiscounts?.find(discount => 
        discount.isActive && 
        (!discount.endDate || new Date(discount.endDate) > new Date()) &&
        !discount.code // Automatic discounts shouldn't require codes
    );

    return {
        discount: bestAutomaticDiscount,
        loading,
    };
}

export function calculateDiscountAmount(
  discount: any, 
  originalAmount: number
): number {
  if (!discount) return 0;
  
  const discountValue = parseFloat(discount.value);
  switch (discount.type) {
    case DiscountType.Percentage:
      return originalAmount * discountValue;
    case DiscountType.FixedAmount:
      return discountValue;
    default:
      return 0;
  }
} 