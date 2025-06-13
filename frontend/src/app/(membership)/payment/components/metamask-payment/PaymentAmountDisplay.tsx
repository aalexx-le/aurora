import { useCryptoAmount, usePayment, usePaymentData, usePriceLoading, useSelectedToken, useUsdPrice } from '@/hooks/usePayment';
import { formatTokenAmount, getTokenConfig } from '@/lib/utils/metamask-payment';
import { Loader2 } from 'lucide-react';
import React from 'react';

export const PaymentAmountDisplay: React.FC = () => {
  const selectedToken = useSelectedToken();
  const cryptoAmount = useCryptoAmount();
  const priceLoading = usePriceLoading();
  const usdPrice = useUsdPrice();
  const paymentData = usePaymentData();

  const tokenConfig = getTokenConfig(selectedToken);
  const decimals = tokenConfig?.decimals || 18;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Amount (USD):</span>
        <span className="font-semibold">${paymentData?.amount.toFixed(2)}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Amount ({selectedToken}):</span>
        <span className="font-semibold">
          {priceLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            `${formatTokenAmount(cryptoAmount, decimals)} ${selectedToken}`
          )}
        </span>
      </div>
      
      <div className="flex justify-end items-center text-xs text-muted-foreground">
        <span>1 {selectedToken} = ${usdPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}; 