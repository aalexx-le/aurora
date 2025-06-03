import { Button } from "@/components/ui/button";
import { UpgradeDialog } from "@/components/upgrade/UpgradeDialog";
import { Crown } from "lucide-react";
import { useCryptoLimitCreatePortfolio } from "../../hooks/useCryptoLimitCreatePortfolio";
import CreatePortfolioDialog from "./CreatePortfolioDialog";

export default function CreatePortfolioDialogWithLock() {
    const { canCreate, current, limit, loading } = useCryptoLimitCreatePortfolio();

    // Show upgrade dialog if user doesn't have access to create portfolios
    if (!canCreate) {
        return (
            <UpgradeDialog
                title="Portfolio Limit Reached"
                description="You've reached the maximum number of portfolios for free accounts. Upgrade to Pro to create unlimited portfolios and unlock advanced features."
                currentUsage={`Current portfolios: ${current}/${limit}`}
                features={[
                    "Unlimited crypto portfolios",
                    "Advanced portfolio analysis",
                    "Real-time profit tracking",
                ]}
                upgradeText="Unlock Unlimited Portfolios"
                triggerButton={
                    <div className="relative group">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            disabled={loading}
                            className="relative bg-background hover:bg-accent border-yellow-500/50 transition-all duration-300 group"
                        >
                            <Crown className="h-4 w-4 text-muted-foreground text-yellow-500 transition-colors duration-300" />
                        </Button>
                    </div>
                }
            />
        );
    }

    return <CreatePortfolioDialog />;
}; 