import { useGetCryptoFeatures } from "@/app/(membership)/hooks/useGetCryptoFeatures";
import { FeatureLockedCard } from "@/components/upgrade";
import { useCryptoViewAnalysis } from "../../hooks/useCryptoViewAnalysis";
import { PortfolioAnalysisSkeleton } from "../skeletons";
import { IPortfolioAnalysisProps, PortfolioAnalysis } from "./PortfolioAnalysis";

export default function PortfolioAnalysisWithLock(props: IPortfolioAnalysisProps) {
    const { canViewAnalysis, loading } = useCryptoViewAnalysis();
    const { features, loading: featuresLoading } = useGetCryptoFeatures();

    if (loading || featuresLoading) {
        return <PortfolioAnalysisSkeleton />;
    }
    
    // Show feature locked card if user doesn't have access
    if (!canViewAnalysis) {
        const featureNames = features.map(f => f.name);

        return (
            <FeatureLockedCard
                title="Portfolio Analysis"
                description="Get detailed insights into your portfolio performance, asset allocation, and profit analysis with our advanced analytics tools."
                features={featureNames}
                className="flex-1"
            />
        );
    }

    return <PortfolioAnalysis {...props} />;
}