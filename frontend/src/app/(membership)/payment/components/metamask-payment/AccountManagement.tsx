'use client'

import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { usePayment } from '@/hooks/usePayment';
import { useMetaMask } from '@/providers/MetaMaskProvider';
import React from 'react';

export const AccountManagement: React.FC = () => {
  const { state, actions } = usePayment();
  const { disconnect } = useMetaMask();

  const handleDisconnectAccount = async () => {
    await actions.disconnectWallet({ disconnect });
  };

  return (
    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
      <div>
        <p className="text-sm font-medium">Connected Account</p>
        <p className="text-xs text-muted-foreground font-mono">
          {state.account?.slice(0, 6)}...{state.account?.slice(-4)}
        </p>
      </div>
      <div className="flex gap-2">
        <CopyButton
          textToCopy={state.account || ''}
          successMessage="Wallet address copied"
          errorMessage="Failed to copy wallet address"
          variant="outline"
          size="sm"
          iconSize="h-3 w-3"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnectAccount}
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
}; 