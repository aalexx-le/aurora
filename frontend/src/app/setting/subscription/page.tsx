import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManageSubscriptionButton } from "./components/manage-subscription-button";
import { SubscriptionForm } from "./components/subcription-form/SubscriptionForm";
import { SubscriptionList } from "./components/subscription-list/SubscriptionList";

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>
      <Separator />
      
      <Tabs defaultValue="current">
        <TabsList>
          <TabsTrigger value="current">Current Subscriptions</TabsTrigger>
          <TabsTrigger value="new">All Subscriptions</TabsTrigger>
        </TabsList>
        <TabsContent value="current" className="mt-6">
            <div className="space-y-4">
              <SubscriptionList />
              <ManageSubscriptionButton />
            </div>
        </TabsContent>
        <TabsContent value="new" className="mt-6">
            <SubscriptionForm />
        </TabsContent>
      </Tabs>
    </div>
  );
} 