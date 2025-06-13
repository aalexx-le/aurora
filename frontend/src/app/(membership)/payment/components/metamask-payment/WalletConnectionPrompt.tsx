'use client'

import { Button } from '@/components/ui/button';
import { Loader2, Wallet } from 'lucide-react';
import React from 'react';

interface WalletConnectionPromptProps {
  onConnect: () => void;
  isConnecting: boolean;
}

export const WalletConnectionPrompt: React.FC<WalletConnectionPromptProps> = ({ 
  onConnect, 
  isConnecting 
}) => {
  return (
    <div className="text-center space-y-4">
      <p className="text-sm text-muted-foreground">
        Connect your MetaMask wallet to continue with payment
      </p>
      <Button 
        onClick={onConnect} 
        disabled={isConnecting} 
        className="w-full"
        size="lg"
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect MetaMask
          </>
        )}
      </Button>
    </div>
  );
}; 