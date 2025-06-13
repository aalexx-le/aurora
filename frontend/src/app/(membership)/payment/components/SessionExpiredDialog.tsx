'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import MEMBERSHIP_ROUTE from '@/lib/routes/membership-plan.route';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface SessionExpiredDialogProps {
  isOpen: boolean;
  onReturnToPlans: () => void;
  onTryAgain?: () => void;
  showTryAgain?: boolean;
}

export const SessionExpiredDialog = ({
  isOpen,
  onReturnToPlans,
  onTryAgain,
  showTryAgain = false,
}: SessionExpiredDialogProps) => {
  const router = useRouter();

  const handleReturnToPlans = () => {
    onReturnToPlans();
    router.push(MEMBERSHIP_ROUTE.plan.value);
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>Session Expired</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>
              Your payment session has expired for security reasons. This typically happens 
              after 15-30 minutes of inactivity.
            </p>
            <p className="text-sm text-muted-foreground">
              To continue with your subscription, please return to the plans page and 
              start a new payment session.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          {showTryAgain && onTryAgain && (
            <Button
              variant="outline"
              onClick={onTryAgain}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
          
          <AlertDialogAction asChild>
            <Button 
              onClick={handleReturnToPlans}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Plans
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}; 