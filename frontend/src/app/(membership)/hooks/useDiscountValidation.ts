import { useCallback, useState } from 'react';
import { DiscountValidationResult } from '../types';
import { useValidateDiscountCode } from './useDiscount';
import { DiscountErrorCode, ValidateDiscountDto } from '@/gql/graphql';

interface UseDiscountValidationProps {}

export const useDiscountValidation = ({}: UseDiscountValidationProps = {}) => {
  const [validateDiscountCode] = useValidateDiscountCode();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountValidationResult | null>(null);

  const validateDiscount = useCallback(async (params: ValidateDiscountDto) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await validateDiscountCode({
        variables: { 
          data: {
            code: params.code,
            priceId: params.priceId,
          }
        }
      });
      
      if (result.data?.validateDiscountCode?.isValid) {
        const validationResult = result.data.validateDiscountCode;
        setAppliedDiscount(validationResult);
        return validationResult;
      } else {
        const errorMessage = result.data?.validateDiscountCode?.errorCode || 'Invalid discount code. Please check and try again.';
        setError(errorMessage);
        return null;
      }
    } catch (error: any) {
      // Handle specific GraphQL errors
      const errorMessage = error.message || 'Failed to validate discount code. Please try again.';
      
      let userFriendlyError = errorMessage;
      if (errorMessage.includes(DiscountErrorCode.DiscountNotFound)) {
        userFriendlyError = 'Invalid discount code. Please check and try again.';
      } else if (errorMessage.includes(DiscountErrorCode.DiscountExpired)) {
        userFriendlyError = 'This discount code has expired.';
      } else if (errorMessage.includes(DiscountErrorCode.DiscountExhausted)) {
        userFriendlyError = 'This discount code has reached its usage limit.';
      } else if (errorMessage.includes(DiscountErrorCode.UserLimitExceeded)) {
        userFriendlyError = "You've already used this discount code.";
      } else if (errorMessage.includes(DiscountErrorCode.DiscountNotApplicable)) {
        userFriendlyError = 'This discount is not applicable to the selected plan.';
      }
      
      setError(userFriendlyError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [validateDiscountCode]);

  const clearDiscount = useCallback(() => {
    setAppliedDiscount(null);
    setError('');
  }, []);

  return {
    validateDiscount,
    clearDiscount,
    loading,
    error,
    appliedDiscount,
  };
}; 