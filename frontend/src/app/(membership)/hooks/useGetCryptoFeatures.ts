import { GET_FEATURES } from "@/api/membership/feature";
import { GET_MEMBERSHIP_PLANS } from "@/api/membership/plan";
import { FeatureType } from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { useMemo } from "react";

export type UpgradeFeature = {
  name: string;
  type: string;
};

export const useGetCryptoFeatures = () => {
  const { data, loading } = useQuery(GET_FEATURES);

  const features = useMemo(() => {
    return (data?.getFeatures || []).filter(feature => feature.type === FeatureType.Crypto);
  }, [data]);

  return { features, loading };
}; 