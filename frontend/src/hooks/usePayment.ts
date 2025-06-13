import { MetaMaskPaymentData } from '@/app/(membership)/types';
import { PaymentStepId, PaymentStepStatus } from '@/lib/utils/metamask-payment';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  CheckBalanceArgs,
  checkTokenBalance,
  clearError,
  clearPaymentData,
  // Async thunks
  connectWallet,
  // Types
  ConnectWalletArgs,
  disconnectWallet,
  DisconnectWalletArgs,
  processPayment,
  ProcessPaymentArgs,
  resetPaymentSteps,
  selectAccount,
  selectCryptoAmount,
  selectError,
  selectHasSufficientBalance,
  selectIsCheckingBalance,
  selectIsConnected,
  selectIsConnecting,
  selectIsDisconnecting,
  selectIsPaymentButtonDisabled,
  selectIsPaymentLoading,
  selectLoadingState,
  selectPaymentButtonText,
  selectPaymentData,
  // Selectors
  selectPaymentState,
  selectPaymentSteps,
  selectPriceLoading,
  selectSelectedToken,
  selectSubscriptionLoading,
  selectSupportedTokens,
  selectTokenBalance,
  selectUsdPrice,
  setError,
  setPaymentData,
  setPriceLoading,
  setSubscriptionLoading,
  setWalletConnection,
  updateCryptoAmount,
  // Actions
  updateSelectedToken,
  updateStepStatus,
  updateTokenBalance,
  updateUsdPrice,
} from '@/state/slices/payment.slice';
import { useCallback } from 'react';

// =============================================================================
// MAIN PAYMENT HOOK
// =============================================================================

export const usePayment = () => {
  const dispatch = useAppDispatch();
  
  // State selectors
  const paymentState = useAppSelector(selectPaymentState);
  const selectedToken = useAppSelector(selectSelectedToken);
  const cryptoAmount = useAppSelector(selectCryptoAmount);
  const usdPrice = useAppSelector(selectUsdPrice);
  const tokenBalance = useAppSelector(selectTokenBalance);
  const paymentSteps = useAppSelector(selectPaymentSteps);
  const account = useAppSelector(selectAccount);
  const isConnected = useAppSelector(selectIsConnected);
  const supportedTokens = useAppSelector(selectSupportedTokens);
  const paymentData = useAppSelector(selectPaymentData);
  const error = useAppSelector(selectError);
  
  // Loading state selectors
  const loadingState = useAppSelector(selectLoadingState);
  
  // Computed selectors
  const hasSufficientBalance = useAppSelector(selectHasSufficientBalance);
  const isPaymentButtonDisabled = useAppSelector(selectIsPaymentButtonDisabled);
  const paymentButtonText = useAppSelector(selectPaymentButtonText);

  // Action creators
  const actions = {
    // Payment state updates
    updateSelectedToken: useCallback((token: string) => {
      dispatch(updateSelectedToken(token));
    }, [dispatch]),

    updateCryptoAmount: useCallback((amount: string) => {
      dispatch(updateCryptoAmount(amount));
    }, [dispatch]),

    updateUsdPrice: useCallback((price: number) => {
      dispatch(updateUsdPrice(price));
    }, [dispatch]),

    updateTokenBalance: useCallback((balance: string) => {
      dispatch(updateTokenBalance(balance));
    }, [dispatch]),

    // Payment steps management
    resetPaymentSteps: useCallback(() => {
      dispatch(resetPaymentSteps());
    }, [dispatch]),

    updateStepStatus: useCallback((stepId: PaymentStepId, status: PaymentStepStatus) => {
      dispatch(updateStepStatus({ stepId, status }));
    }, [dispatch]),

    // Wallet state updates
    setWalletConnection: useCallback((account: string | null, isConnected: boolean) => {
      dispatch(setWalletConnection({ account, isConnected }));
    }, [dispatch]),

    // Payment flow management
    setPaymentData: useCallback((data: MetaMaskPaymentData) => {
      dispatch(setPaymentData(data));
    }, [dispatch]),

    clearPaymentData: useCallback(() => {
      dispatch(clearPaymentData());
    }, [dispatch]),

    // Loading state updates
    setPriceLoading: useCallback((loading: boolean) => {
      dispatch(setPriceLoading(loading));
    }, [dispatch]),

    setSubscriptionLoading: useCallback((loading: boolean) => {
      dispatch(setSubscriptionLoading(loading));
    }, [dispatch]),

    // Error handling
    clearError: useCallback(() => {
      dispatch(clearError());
    }, [dispatch]),

    setError: useCallback((error: string) => {
      dispatch(setError(error));
    }, [dispatch]),

    // Async actions
    connectWallet: useCallback((args: ConnectWalletArgs) => {
      return dispatch(connectWallet(args));
    }, [dispatch]),

    disconnectWallet: useCallback((args: DisconnectWalletArgs) => {
      return dispatch(disconnectWallet(args));
    }, [dispatch]),

    checkTokenBalance: useCallback((args: CheckBalanceArgs) => {
      return dispatch(checkTokenBalance(args));
    }, [dispatch]),

    processPayment: useCallback((args: ProcessPaymentArgs) => {
      return dispatch(processPayment(args));
    }, [dispatch]),
  };

  return {
    // State
    state: {
      selectedToken,
      cryptoAmount,
      usdPrice,
      tokenBalance,
      paymentSteps,
      account,
      isConnected,
      supportedTokens,
      paymentData,
      error,
      hasSufficientBalance,
      isPaymentButtonDisabled,
      paymentButtonText,
    },
    // Loading state
    loading: loadingState,
    // Actions
    actions,
    // Full state (for advanced usage)
    fullState: paymentState,
  };
};

// =============================================================================
// SELECTIVE HOOKS FOR PERFORMANCE OPTIMIZATION
// =============================================================================

export const useSelectedToken = () => useAppSelector(selectSelectedToken);
export const useCryptoAmount = () => useAppSelector(selectCryptoAmount);
export const useTokenBalance = () => useAppSelector(selectTokenBalance);
export const usePaymentSteps = () => useAppSelector(selectPaymentSteps);
export const useAccount = () => useAppSelector(selectAccount);
export const useIsConnected = () => useAppSelector(selectIsConnected);
export const useSupportedTokens = () => useAppSelector(selectSupportedTokens);
export const usePaymentData = () => useAppSelector(selectPaymentData);
export const useUsdPrice = () => useAppSelector(selectUsdPrice);
export const usePaymentError = () => useAppSelector(selectError);

// Loading state hooks
export const useIsPaymentLoading = () => useAppSelector(selectIsPaymentLoading);
export const useIsConnecting = () => useAppSelector(selectIsConnecting);
export const useIsDisconnecting = () => useAppSelector(selectIsDisconnecting);
export const useIsCheckingBalance = () => useAppSelector(selectIsCheckingBalance);
export const usePriceLoading = () => useAppSelector(selectPriceLoading);
export const useSubscriptionLoading = () => useAppSelector(selectSubscriptionLoading);

// Computed state hooks
export const useHasSufficientBalance = () => useAppSelector(selectHasSufficientBalance);
export const useIsPaymentButtonDisabled = () => useAppSelector(selectIsPaymentButtonDisabled);
export const usePaymentButtonText = () => useAppSelector(selectPaymentButtonText);

// =============================================================================
// SPECIALIZED HOOKS FOR SPECIFIC USE CASES
// =============================================================================

export const usePaymentActions = () => {
  const dispatch = useAppDispatch();

  return {
    updateSelectedToken: useCallback((token: string) => {
      dispatch(updateSelectedToken(token));
    }, [dispatch]),

    updateCryptoAmount: useCallback((amount: string) => {
      dispatch(updateCryptoAmount(amount));
    }, [dispatch]),

    resetPaymentSteps: useCallback(() => {
      dispatch(resetPaymentSteps());
    }, [dispatch]),

    updateStepStatus: useCallback((stepId: PaymentStepId, status: PaymentStepStatus) => {
      dispatch(updateStepStatus({ stepId, status }));
    }, [dispatch]),

    setWalletConnection: useCallback((account: string | null, isConnected: boolean) => {
      dispatch(setWalletConnection({ account, isConnected }));
    }, [dispatch]),

    clearError: useCallback(() => {
      dispatch(clearError());
    }, [dispatch]),

    connectWallet: useCallback((args: ConnectWalletArgs) => {
      return dispatch(connectWallet(args));
    }, [dispatch]),

    disconnectWallet: useCallback((args: DisconnectWalletArgs) => {
      return dispatch(disconnectWallet(args));
    }, [dispatch]),

    checkTokenBalance: useCallback((args: CheckBalanceArgs) => {
      return dispatch(checkTokenBalance(args));
    }, [dispatch]),

    processPayment: useCallback((args: ProcessPaymentArgs) => {
      return dispatch(processPayment(args));
    }, [dispatch]),
  };
};

export const useWalletState = () => {
  const account = useAppSelector(selectAccount);
  const isConnected = useAppSelector(selectIsConnected);
  const isConnecting = useAppSelector(selectIsConnecting);
  const isDisconnecting = useAppSelector(selectIsDisconnecting);

  return {
    account,
    isConnected,
    isConnecting,
    isDisconnecting,
  };
};

export const usePaymentFlow = () => {
  const paymentData = useAppSelector(selectPaymentData);
  const paymentSteps = useAppSelector(selectPaymentSteps);
  const isPaymentLoading = useAppSelector(selectIsPaymentLoading);
  const isPaymentButtonDisabled = useAppSelector(selectIsPaymentButtonDisabled);
  const paymentButtonText = useAppSelector(selectPaymentButtonText);
  const error = useAppSelector(selectError);

  return {
    paymentData,
    paymentSteps,
    isPaymentLoading,
    isPaymentButtonDisabled,
    paymentButtonText,
    error,
  };
};

export const useTokenSelection = () => {
  const selectedToken = useAppSelector(selectSelectedToken);
  const supportedTokens = useAppSelector(selectSupportedTokens);
  const tokenBalance = useAppSelector(selectTokenBalance);
  const isCheckingBalance = useAppSelector(selectIsCheckingBalance);
  const hasSufficientBalance = useAppSelector(selectHasSufficientBalance);

  return {
    selectedToken,
    supportedTokens,
    tokenBalance,
    isCheckingBalance,
    hasSufficientBalance,
  };
}; 