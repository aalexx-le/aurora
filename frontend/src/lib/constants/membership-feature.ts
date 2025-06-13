// Feature constants
export const FEATURES = {
    CRYPTO_MULTIPLE_PORTFOLIOS: "Unlimited crypto portfolios",
    CRYPTO_PORTFOLIO_ANALYSIS: "Advanced portfolio analysis",
} as const;

export type FeatureName = (typeof FEATURES)[keyof typeof FEATURES];
