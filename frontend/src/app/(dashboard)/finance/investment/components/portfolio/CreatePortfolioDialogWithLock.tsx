import { useGetCryptoFeatures } from "@/app/(membership)/hooks/useGetCryptoFeatures";
import { Button } from "@/components/ui/button";
import { UpgradeDialog } from "@/components/upgrade";
import { Crown } from "lucide-react";
import { useCryptoLimitCreatePortfolio } from "../../hooks/useCryptoLimitCreatePortfolio";
import CreatePortfolioDialog from "./CreatePortfolioDialog";

export default function CreatePortfolioDialogWithLock() {
    const { canCreate, current, limit, loading } = useCryptoLimitCreatePortfolio();
    const { features, loading: featuresLoading } = useGetCryptoFeatures();

    if (!canCreate) {
        const featureNames = features.map(f => f.name);

        return (
            <UpgradeDialog
                title="Portfolio Limit Reached"
                description="You've reached the maximum number of portfolios for free accounts. Upgrade to Pro to create unlimited portfolios and unlock advanced features."
                currentUsage={`Current portfolios: ${current}/${limit}`}
                features={featureNames}
                upgradeText="Unlock Unlimited Portfolios"
                triggerButton={
                    <Button 
                        variant="outline" 
                        disabled={loading || featuresLoading}
                        className=" bg-background hover:bg-accent border-yellow-500 transition-all text-yellow-500 hover:text-yellow-400 
                        hover:border-yellow-400 duration-300 gap-2"
                    >
                        <Crown className="h-4 w-4" />
                        <span>Upgrade to Create</span>
                    </Button>
                }
            />
        );
    }

    return <CreatePortfolioDialog />;
}; 