import { FEATURES } from "@/lib/constants/membership-feature";
import { useCryptoFeatureAccess } from "./useCryptoFeatureAccess";
import { useCryptoPortfoliosQuery } from "./useCryptoPortfoliosQuery";

const LIMIT_PORTFOLIO_PER_USER = 1;

export const useCryptoLimitCreatePortfolio = () => {
    const { hasFeature, loading } = useCryptoFeatureAccess();
    const { portfolios } = useCryptoPortfoliosQuery();

    const numPortfolios = portfolios.length - 1; // -1 because the aggregate portfolio is not counted
    const hasUnlimitedAccess = hasFeature(FEATURES.CRYPTO_MULTIPLE_PORTFOLIOS);
    const canCreate =
        hasUnlimitedAccess || numPortfolios < LIMIT_PORTFOLIO_PER_USER;

    return {
        canCreate,
        current: numPortfolios,
        limit: hasUnlimitedAccess ? 99999 : LIMIT_PORTFOLIO_PER_USER,
        loading,
    };
};
