import {
  GET_MY_MEMBERSHIP_FEATURES
} from "@/api/membership/feature-access";
import { FeatureName } from "@/lib/constants/membership-feature";
import { useQuery } from "@apollo/client";



export const useCryptoFeatureAccess = () => {
  const { data, loading } = useQuery(
    GET_MY_MEMBERSHIP_FEATURES,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  const hasFeature = (featureName: FeatureName): boolean => {
    if (!data?.myMembershipFeatures) return false;
    return data.myMembershipFeatures.some((membershipFeature) => 
      membershipFeature.feature?.name === featureName
    );
  };

  return {
    hasFeature,
    loading
  }
}; 