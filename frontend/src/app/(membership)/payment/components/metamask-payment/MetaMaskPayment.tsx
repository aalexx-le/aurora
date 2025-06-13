'use client'

import { GET_CRYPTO_PRICE } from '@/api/payment/payment';
import { MetaMaskPaymentData } from '@/app/(membership)/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GetCryptoPriceQuery, QueryGetCryptoPriceArgs } from '@/gql/graphql';

import MEMBERSHIP_ROUTE from '@/lib/routes/membership-plan.route';
import { useMetaMask } from '@/providers/MetaMaskProvider';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  checkTokenBalance,
  connectWallet,
  processPayment,
  selectCryptoAmount,
  selectError,
  selectIsExpired,
  selectIsPaymentButtonDisabled,
  selectLoadingState,
  selectPaymentButtonText,
  selectSelectedToken,
  setPaymentData,
  setPriceLoading,
  setWalletConnection,
  updateCryptoAmount,
  updateUsdPrice
} from '@/state/slices/payment.slice';
import { useQuery } from '@apollo/client';
import { unwrapResult } from '@reduxjs/toolkit';
import { AlertTriangle, Loader2, Wallet } from 'lucide-react';
import React, { useEffect } from 'react';
import { AccountManagement, PaymentAmountDisplay, PaymentSteps, TokenSelector, WalletConnectionPrompt } from '.';
import {
  useCreateMetaMaskPaymentMethod,
  useCreateMetaMaskSubscriptionFromSession,
} from '../../hooks/useMetaMaskPayment';
import { useSessionManager } from '../../hooks/useSessionManager';
import { SessionExpiredDialog } from '../SessionExpiredDialog';

// Types
interface MetaMaskPaymentProps {
  paymentData: MetaMaskPaymentData;
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

// Main Component (uses Redux instead of Context)
export const MetaMaskPayment: React.FC<MetaMaskPaymentProps> = ({
  paymentData,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const dispatch = useAppDispatch();
  
  // Redux selectors
  const selectedToken = useAppSelector(selectSelectedToken);
  const cryptoAmount = useAppSelector(selectCryptoAmount);
  const error = useAppSelector(selectError);
  const isExpired = useAppSelector(selectIsExpired);
  const isPaymentButtonDisabled = useAppSelector(selectIsPaymentButtonDisabled);
  const paymentButtonText = useAppSelector(selectPaymentButtonText);
  const loading = useAppSelector(selectLoadingState);
  
  // Session management
  const { handleSessionExpired, resetSession } = useSessionManager({
    redirectPath: MEMBERSHIP_ROUTE.plan.value,
  });
  
  const { 
    account,
    isConnected,
    connect,
    disconnect,
    signMessage,
    transferToken,
    getTokenBalance
  } = useMetaMask();
  
  const { create: createPaymentMethod } = useCreateMetaMaskPaymentMethod();
  const { create: createSubscriptionFromSession } = useCreateMetaMaskSubscriptionFromSession();

  // GraphQL query for crypto price
  const { data: priceData, loading: priceLoading, error: priceError } = useQuery<
    GetCryptoPriceQuery,
    QueryGetCryptoPriceArgs
  >(GET_CRYPTO_PRICE, {
    variables: {
      tokenSymbol: selectedToken,
      usdAmount: paymentData.amount,
    },
    skip: !selectedToken || !paymentData.amount,
  });

  // Sync MetaMask provider state with Redux
  useEffect(() => {
    dispatch(setWalletConnection({ account, isConnected }));
  }, [account, isConnected, dispatch]);

  // Update price loading state
  useEffect(() => {
    dispatch(setPriceLoading(priceLoading));
  }, [priceLoading, dispatch]);

  // Update crypto price when data changes
  useEffect(() => {
    if (priceData?.getCryptoPrice && !priceLoading && !priceError) {
      dispatch(updateCryptoAmount(priceData.getCryptoPrice.tokenAmount || '0'));
      dispatch(updateUsdPrice(priceData.getCryptoPrice.usdPrice || 0));
    }
  }, [priceData, priceLoading, priceError, dispatch]);

  // Set payment data
  useEffect(() => {
    dispatch(setPaymentData(paymentData));
  }, [paymentData, dispatch]);

  // Check token balance when connected and token changes
  useEffect(() => {
    if (isConnected && account && selectedToken) {
      dispatch(checkTokenBalance({
        account,
        tokenSymbol: selectedToken,
        getTokenBalance,
      }));
    }
  }, [isConnected, account, selectedToken, dispatch, getTokenBalance]);

  const handleConnect = async () => {
    dispatch(connectWallet({ connect }));
  };

  const handlePayment = async () => {
    if (!account || !paymentData) return;

    try {
      unwrapResult(await dispatch(processPayment({
        account,
        paymentData,
        selectedToken,
        cryptoAmount,
        signMessage,
        transferToken,
        createPaymentMethod,
        createSubscriptionFromSession,
      })));

      onPaymentSuccess?.();
      
    } catch (error) {
      // Payment failed - call error callback
      const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.';
      onPaymentError?.(errorMessage);
    }
  };

  // Render wallet connection prompt if not connected
  if (!isConnected || !account) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              MetaMask Payment
            </CardTitle>
            <CardDescription>
              Pay with cryptocurrency using your MetaMask wallet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <WalletConnectionPrompt onConnect={handleConnect} isConnecting={loading.isConnecting} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            MetaMask Payment
          </CardTitle>
          <CardDescription>
            Pay with cryptocurrency using your MetaMask wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Session Expired Alert */}
          {isExpired && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your payment session has expired. Please return to the plans page and start a new payment session.
              </AlertDescription>
            </Alert>
          )}

          {/* Account Management */}
          <AccountManagement />
          <Separator />

          {/* Token Selection with Balance Information */}
          <TokenSelector />
          <PaymentAmountDisplay />
          <Separator />

          {/* Payment Steps */}
          <PaymentSteps />
          <Separator />

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={isPaymentButtonDisabled}
            className="w-full"
            size="lg"
          >
            {(loading.isPaymentLoading || loading.subscriptionLoading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {paymentButtonText}
          </Button>
        </CardContent>
      </Card>
      
      {/* Session Expired Dialog */}
      <SessionExpiredDialog
        isOpen={isExpired}
        onReturnToPlans={resetSession}
        showTryAgain={false}
      />
    </div>
  );
};