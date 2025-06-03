import { FeatureLockedCard } from "@/components/upgrade/FeatureLockedCard";
import { useCryptoViewAnalysis } from "../../hooks/useCryptoViewAnalysis";
import { IPortfolioAnalysisProps, PortfolioAnalysis } from "./PortfolioAnalysis";
import { PortfolioAnalysisSkeleton } from "../skeletons";

export default function PortfolioAnalysisWithLock(props: IPortfolioAnalysisProps) {
    const { canViewAnalysis, loading } = useCryptoViewAnalysis();

    if (loading) {
        return <PortfolioAnalysisSkeleton />;
    }
    
    // Show feature locked card if user doesn't have access
    if (!canViewAnalysis) {
        return (
            <FeatureLockedCard
                title="Portfolio Analysis"
                description="Get detailed insights into your portfolio performance, asset allocation, and profit analysis with our advanced analytics tools."
                features={[
                    "Detailed portfolio breakdown and analysis",
                    "Asset allocation visualization",
                    "Profit/loss tracking and trends",
                    "Performance metrics and insights",
                    "Export analysis reports"
                ]}
                className="flex-1"
            />
        );
    }

    return <PortfolioAnalysis {...props} />;
}