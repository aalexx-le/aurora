'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinning';
import { Settings } from 'lucide-react';
import { useCustomerPortalSession } from '../../hooks/useCustomerPortalSession';

interface ManageSubscriptionButtonProps {
  subscriptionIds?: string[];
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const ManageSubscriptionButton = ({
  subscriptionIds,
  variant = 'outline',
  size = 'default',
  className,
}: ManageSubscriptionButtonProps) => {
  const { openCustomerPortal, loading } = useCustomerPortalSession();

  const handleManageSubscription = () => {
    openCustomerPortal(subscriptionIds);
  };

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? (
        <>
          <Spinner className="mr-2 h-4 w-4" />
          Opening...
        </>
      ) : (
        <>
          <Settings className="mr-2 h-4 w-4" />
          Manage Subscription
          {/* <ExternalLink className="ml-2 h-4 w-4" /> */}
        </>
      )}
    </Button>
  );
}; 