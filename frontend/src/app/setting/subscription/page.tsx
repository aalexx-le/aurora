import { Separator } from "@/components/ui/separator";
import { ManageSubscriptionButton } from "./components/manage-subscription-button";
import { SubscriptionList } from "./components/subscription-list/SubscriptionList";
import { BrowsePlansButton } from "./components/browse-plans-button/BrowsePlansButton";

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your current subscriptions and billing details.
        </p>
      </div>
      <Separator />
      
      <div className="space-y-4">
        <SubscriptionList />
        <div className="flex flex-col sm:flex-row gap-3">
          <ManageSubscriptionButton />
          <BrowsePlansButton />
        </div>
      </div>
    </div>
  );
} 