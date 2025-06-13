import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { useCancelSubscriptionMutation } from "../../hooks/useCancelSubscriptionMutation";
import { useReactivateSubscriptionMutation } from "../../hooks/useReactivateSubscriptionMutation";
import { formatDate, getStatusColor } from "../../../../../lib/utils/subscription";
import { MembershipSubscription } from "../../types";

type SubscriptionCardProps = {
  subscription: MembershipSubscription; 
};

export const SubscriptionCard = ({ 
  subscription, 
}: SubscriptionCardProps) => {
  const { handleCancelSubscription, loading: cancelLoading } = useCancelSubscriptionMutation();
  const { handleReactivateSubscription, loading: reactivateLoading } = useReactivateSubscriptionMutation();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // const isTrialing = subscription.status === MembershipSubscriptionStatus.Trialing;
  // const isActive = subscription.status === MembershipSubscriptionStatus.Active;
  // const isCanceled = subscription.status === MembershipSubscriptionStatus.Canceled;

  return (
    <Card className="w-full max-w-full p-4">
      <CardHeader className="flex flex-row items-start justify-between p-0">
        <div className="flex-1 min-w-0">
          <CardTitle className="truncate">{subscription.plan?.name || 'Unnamed Plan'}</CardTitle>
          <CardDescription className="line-clamp-2">
            {subscription.plan?.description || 'No description'}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status}
          </Badge>
    
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(isActive || isTrialing) && (
                <>
                  <DropdownMenuItem onClick={() => onUpgrade(subscription.id)}>
                    Upgrade Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowCancelDialog(true)}>
                    Cancel Subscription
                  </DropdownMenuItem>
                </>
              )}
              {isCanceled && (
                <DropdownMenuItem onClick={() =>  handleReactivateSubscription(subscription.id)}>
                  Reactivate Subscription
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">
              Started: {formatDate(subscription.startDate)}
            </span>
          </div>
          {subscription.endDate && (
            <div className="flex items-center gap-2 sm:justify-end">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate">
                Expires: {formatDate(subscription.endDate)}
              </span>
            </div>
          )}
        </div>
        
        {/* <TransactionList transactions={subscription.paymentTransactions} /> */}
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
                handleCancelSubscription(subscription.id);
              }}
              disabled={cancelLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelLoading ? "Scheduling cancellation..." : "Yes, cancel subscription"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}; 