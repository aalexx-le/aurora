import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MembershipSubscriptionStatus } from "@/gql/graphql";
import { Calendar, Clock, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { MembershipSubscription } from "../../types";
import { formatDate, getStatusColor } from "../../utils/subscription-helpers";
import { TransactionList } from "./TransactionList";

type SubscriptionCardProps = {
  subscription: MembershipSubscription; 
  onCancel: (id: string) => void;
  onUpgrade: (id: string) => void;
  cancelingId: string | null;
  paddleLoading: boolean;
};

export const SubscriptionCard = ({ 
  subscription, 
  onCancel,
  onUpgrade,
  cancelingId,
  paddleLoading 
}: SubscriptionCardProps) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const isCanceling = cancelingId === subscription.id;
  const isTrialing = subscription.status === MembershipSubscriptionStatus.Trialing;
  const isActive = subscription.status === MembershipSubscriptionStatus.Active;
  const isCanceled = subscription.status === MembershipSubscriptionStatus.Canceled;

  return (
    <Card className="overflow-hidden p-4">
      <CardHeader className="flex flex-row items-start justify-between p-0">
        <div>
          <CardTitle>{subscription.plan?.name || 'Unnamed Plan'}</CardTitle>
          <CardDescription>
            {subscription.plan?.description || 'No description'}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status}
          </Badge>
    
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(isActive || isTrialing) && (
                <>
                  {/* <DropdownMenuItem onClick={() => onUpgrade(subscription.id)}>
                    Upgrade Plan
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onClick={() => setShowCancelDialog(true)}>
                    Cancel Subscription
                  </DropdownMenuItem>
                </>
              )}
              {isCanceled && (
                <DropdownMenuItem onClick={() => onUpgrade(subscription.id)}>
                  Reactivate Subscription
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Started: {formatDate(subscription.startDate)}
            </span>
          </div>
          {subscription.endDate && (
            <div className="flex items-center justify-end gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Expires: {formatDate(subscription.endDate)}
              </span>
            </div>
          )}
        </div>
        
        <TransactionList transactions={subscription.paymentTransactions} />
      </CardContent>
    
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will schedule your subscription to be canceled at the end of your current billing period. 
              You&apos;ll continue to have full access to all features until then. 
              Your subscription status will update automatically once the cancellation is processed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep my subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCancelDialog(false);
                onCancel(subscription.id);
              }}
              disabled={isCanceling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCanceling ? "Scheduling cancellation..." : "Yes, cancel subscription"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}; 