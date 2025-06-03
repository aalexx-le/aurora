
// Feature constants
export const FEATURES = {
    CRYPTO_MULTIPLE_PORTFOLIOS: 'CRYPTO_MULTIPLE_PORTFOLIOS',
    CRYPTO_PORTFOLIO_ANALYSIS: 'CRYPTO_PORTFOLIO_ANALYSIS',
} as const;
  
export type FeatureName = typeof FEATURES[keyof typeof FEATURES];