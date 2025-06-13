import { FEATURES } from "@/lib/constants/membership-feature";
import { useCryptoFeatureAccess } from "./useCryptoFeatureAccess";

export const useCryptoViewAnalysis = () => {
    const { hasFeature, loading } = useCryptoFeatureAccess();

    const canViewAnalysis = hasFeature(FEATURES.CRYPTO_PORTFOLIO_ANALYSIS);

    return {
        canViewAnalysis,
        loading,
    };
};
