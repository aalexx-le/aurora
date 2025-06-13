import { MetaMaskPaymentData } from '@/app/(membership)/types';
import { CreateMetaMaskPaymentMethodDto } from '@/gql/graphql';
import {
  DEFAULT_PAYMENT_STEPS,
  ERROR_MESSAGES,
  formatTokenAmount,
  generatePaymentMessage,
  getTokenConfig,
  isValidEthereumAddress,
  PaymentStep,
  PaymentStepId,
  PaymentStepStatus,
  TOKEN_CONFIGS,
  TokenInfo,
  validateTokenTransferParams,
} from '@/lib/utils/metamask-payment';
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

// MetaMask provider types
export interface TokenTransferParams {
  tokenAddress: string;
  recipientAddress: string;
  amount: string;
  decimals?: number;
}

export interface TransactionResult {
  hash: string;
  blockNumber?: number;
  gasUsed?: string;
  gasPrice?: string;
}

export interface TokenBalance {
  balance: string;
  formatted: string;
  decimals: number;
  symbol: string;
}

export interface CreateMetaMaskSubscriptionFromSessionDto {
  sessionId: string;
  transactionHash: string;
  tokenSymbol: string;
  tokenAddress: string;
  blockNumber: number;
  gasUsed?: string;
  gasPrice?: string;
}

export interface PaymentState {
  // Payment data
  selectedToken: string;
  cryptoAmount: string;
  usdPrice: number;
  tokenBalance: string;
  paymentSteps: PaymentStep[];
  
  // Session state
  sessionExpiresAt: string | null;
  timeRemaining: string;
  isExpired: boolean;
  isExpiringSoon: boolean;
  
  // Loading states
  isPaymentLoading: boolean;
  isConnecting: boolean;
  isDisconnecting: boolean;
  isCheckingBalance: boolean;
  priceLoading: boolean;
  subscriptionLoading: boolean;
  
  // Wallet state
  account: string | null;
  isConnected: boolean;
  supportedTokens: TokenInfo[];
  
  // Payment flow
  paymentData: MetaMaskPaymentData | null;
  
  // Error handling
  error: string | null;
  lastError: string | null;
}

// Async thunk argument types
export interface ConnectWalletArgs {
  connect: () => Promise<string[] | null>;
}

export interface DisconnectWalletArgs {
  disconnect: () => void;
}

export interface CheckBalanceArgs {
  account: string;
  tokenSymbol: string;
  getTokenBalance: (tokenAddress: string, account: string) => Promise<TokenBalance>;
}

export interface ProcessPaymentArgs {
  account: string;
  paymentData: MetaMaskPaymentData;
  selectedToken: string;
  cryptoAmount: string;
  signMessage: (message: string) => Promise<string | null>;
  transferToken: (params: TokenTransferParams) => Promise<TransactionResult>;
  createPaymentMethod: (data: CreateMetaMaskPaymentMethodDto) => Promise<boolean | undefined>;
  createSubscriptionFromSession: (data: CreateMetaMaskSubscriptionFromSessionDto) => Promise<boolean | undefined>;
}

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: PaymentState = {
  // Payment data
  selectedToken: 'ETH',
  cryptoAmount: '0',
  usdPrice: 0,
  tokenBalance: '0',
  paymentSteps: [...DEFAULT_PAYMENT_STEPS],
  
  // Session state
  sessionExpiresAt: null,
  timeRemaining: '',
  isExpired: false,
  isExpiringSoon: false,
  
  // Loading states
  isPaymentLoading: false,
  isConnecting: false,
  isDisconnecting: false,
  isCheckingBalance: false,
  priceLoading: false,
  subscriptionLoading: false,
  
  // Wallet state
  account: null,
  isConnected: false,
  supportedTokens: Object.values(TOKEN_CONFIGS),
  
  // Payment flow
  paymentData: null,
  
  // Error handling
  error: null,
  lastError: null,
};

// =============================================================================
// ASYNC THUNKS
// =============================================================================

export const connectWallet = createAsyncThunk(
  'payment/connectWallet',
  async ({ connect }: ConnectWalletArgs, { rejectWithValue }) => {
    try {
      await connect();
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : ERROR_MESSAGES.FAILED_TO_CONNECT
      );
    }
  }
);

export const disconnectWallet = createAsyncThunk(
  'payment/disconnectWallet',
  async ({ disconnect }: DisconnectWalletArgs) => {
    disconnect();
    return true;
  }
);

export const checkTokenBalance = createAsyncThunk(
  'payment/checkTokenBalance',
  async ({ account, tokenSymbol, getTokenBalance }: CheckBalanceArgs, { rejectWithValue }) => {
    try {
      const tokenConfig = getTokenConfig(tokenSymbol);
      if (!tokenConfig) {
        return rejectWithValue(ERROR_MESSAGES.UNSUPPORTED_TOKEN);
      }

      const balanceResult = await getTokenBalance(tokenConfig.address, account);
      return {
        tokenSymbol,
        balance: balanceResult.formatted,
      };
    } catch (error) {
      console.error('Failed to check token balance:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to check balance'
      );
    }
  }
);

export const processPayment = createAsyncThunk(
  'payment/processPayment',
  async (args: ProcessPaymentArgs, { dispatch, getState, rejectWithValue }) => {
    const {
      account,
      paymentData,
      selectedToken,
      cryptoAmount,
      signMessage,
      transferToken,
      createPaymentMethod,
      createSubscriptionFromSession,
    } = args;

    const PAYMENT_RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_RECEIVER_ADDRESS;

    try {
      // Session validation
      const state = getState() as { payment: PaymentState };
      if (state.payment.isExpired) {
        throw new Error('Payment session has expired. Please return to plans page to start a new session.');
      }

      // Validation
      if (!account || !cryptoAmount || !selectedToken) {
        throw new Error(ERROR_MESSAGES.MISSING_TRANSACTION_PARAMETERS);
      }

      if (!PAYMENT_RECEIVER_ADDRESS) {
        throw new Error(ERROR_MESSAGES.PAYMENT_RECEIVER_NOT_CONFIGURED);
      }

      if (!isValidEthereumAddress(PAYMENT_RECEIVER_ADDRESS)) {
        throw new Error(ERROR_MESSAGES.INVALID_PAYMENT_RECEIVER_FORMAT);
      }

      const validation = validateTokenTransferParams(selectedToken, cryptoAmount, PAYMENT_RECEIVER_ADDRESS);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const tokenConfig = getTokenConfig(selectedToken);
      if (!tokenConfig) {
        throw new Error(ERROR_MESSAGES.UNSUPPORTED_TOKEN);
      }

      // Step 1: Update step to approve
      dispatch(updateStepStatus({ stepId: PaymentStepId.APPROVE, status: PaymentStepStatus.ACTIVE }));

      // Create payment method (might already exist)
      try {
        await createPaymentMethod({ walletAddress: account });
      } catch (error) {
        // Payment method might already exist, continue
        console.warn('Payment method creation failed, continuing:', error);
      }

      // Step 2: Sign payment authorization
      const timestamp = Date.now();
      const message = generatePaymentMessage(
        paymentData.amount,
        paymentData.currency,
        timestamp,
        selectedToken
      );

      const signature = await signMessage(message);
      if (!signature) {
        throw new Error(ERROR_MESSAGES.PAYMENT_AUTHORIZATION_FAILED);
      }

      dispatch(updateStepStatus({ stepId: PaymentStepId.APPROVE, status: PaymentStepStatus.COMPLETED }));
      dispatch(updateStepStatus({ stepId: PaymentStepId.TRANSACTION, status: PaymentStepStatus.ACTIVE }));

      // Step 3: Send token transfer
      const transactionResult = await transferToken({
        tokenAddress: tokenConfig.address,
        recipientAddress: PAYMENT_RECEIVER_ADDRESS,
        amount: cryptoAmount,
        decimals: tokenConfig.decimals,
      });

      dispatch(updateStepStatus({ stepId: PaymentStepId.TRANSACTION, status: PaymentStepStatus.COMPLETED }));
      dispatch(updateStepStatus({ stepId: PaymentStepId.VERIFY, status: PaymentStepStatus.ACTIVE }));

      // Step 4: Create subscription
      await createSubscriptionFromSession({
        sessionId: paymentData.sessionId,
        transactionHash: transactionResult.hash,
        tokenSymbol: selectedToken,
        tokenAddress: tokenConfig.address,
        blockNumber: transactionResult.blockNumber || 0,
        gasUsed: transactionResult.gasUsed?.toString(),
        gasPrice: transactionResult.gasPrice?.toString(),
      });

      dispatch(updateStepStatus({ stepId: PaymentStepId.VERIFY, status: PaymentStepStatus.COMPLETED }));

    } catch (error) {
      // Update appropriate step to error state
      dispatch(updateStepStatus({ stepId: PaymentStepId.APPROVE, status: PaymentStepStatus.ERROR }));
      
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.PAYMENT_FAILED;
      console.error('Payment processing failed:', error);
      return rejectWithValue(errorMessage);
    }
  }
);

// =============================================================================
// SLICE DEFINITION
// =============================================================================

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Payment state updates
    updateSelectedToken: (state, action: PayloadAction<string>) => {
      state.selectedToken = action.payload;
      state.tokenBalance = '0'; // Reset balance when token changes
      state.error = null;
    },

    updateCryptoAmount: (state, action: PayloadAction<string>) => {
      state.cryptoAmount = action.payload;
    },

    updateUsdPrice: (state, action: PayloadAction<number>) => {
      state.usdPrice = action.payload;
    },

    updateTokenBalance: (state, action: PayloadAction<string>) => {
      state.tokenBalance = action.payload;
    },

    // Payment steps management
    resetPaymentSteps: (state) => {
      state.paymentSteps = [...DEFAULT_PAYMENT_STEPS];
      state.error = null;
    },

    updateStepStatus: (state, action: PayloadAction<{ stepId: PaymentStepId; status: PaymentStepStatus }>) => {
      const { stepId, status } = action.payload;
      state.paymentSteps = state.paymentSteps.map(step =>
        step.id === stepId ? { ...step, status } : step
      );
    },

    // Wallet state updates
    setWalletConnection: (state, action: PayloadAction<{ account: string | null; isConnected: boolean }>) => {
      const { account, isConnected } = action.payload;
      state.account = account;
      state.isConnected = isConnected;
      
      if (isConnected) {
        state.paymentSteps = state.paymentSteps.map(step =>
          step.id === PaymentStepId.CONNECT 
            ? { ...step, status: PaymentStepStatus.COMPLETED }
            : step.id === PaymentStepId.APPROVE
            ? { ...step, status: PaymentStepStatus.ACTIVE }
            : step
        );
      } else {
        state.paymentSteps = [...DEFAULT_PAYMENT_STEPS];
        state.tokenBalance = '0';
      }
      
      state.error = null;
    },

    // Payment flow management
    setPaymentData: (state, action: PayloadAction<MetaMaskPaymentData>) => {
      state.paymentData = action.payload;
    },

    clearPaymentData: (state) => {
      state.paymentData = null;
      state.paymentSteps = [...DEFAULT_PAYMENT_STEPS];
    },

    // Loading state updates
    setPriceLoading: (state, action: PayloadAction<boolean>) => {
      state.priceLoading = action.payload;
    },

    setSubscriptionLoading: (state, action: PayloadAction<boolean>) => {
      state.subscriptionLoading = action.payload;
    },

    // Session management
    setSessionExpiresAt: (state, action: PayloadAction<string | null>) => {
      state.sessionExpiresAt = action.payload;
    },

    updateSessionTimer: (state, action: PayloadAction<{ timeRemaining: string; isExpired: boolean; isExpiringSoon: boolean }>) => {
      const { timeRemaining, isExpired, isExpiringSoon } = action.payload;
      state.timeRemaining = timeRemaining;
      state.isExpired = isExpired;
      state.isExpiringSoon = isExpiringSoon;
    },

    resetSessionState: (state) => {
      state.sessionExpiresAt = null;
      state.timeRemaining = '';
      state.isExpired = false;
      state.isExpiringSoon = false;
    },

    validateSession: (state) => {
      if (state.sessionExpiresAt) {
        const now = new Date();
        const expiry = new Date(state.sessionExpiresAt);
        const isExpired = expiry.getTime() <= now.getTime();
        
        if (isExpired !== state.isExpired) {
          state.isExpired = isExpired;
        }
      }
    },

    // Error handling
    clearError: (state) => {
      state.error = null;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.lastError = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Connect wallet
    builder
      .addCase(connectWallet.pending, (state) => {
        state.isConnecting = true;
        state.error = null;
      })
      .addCase(connectWallet.fulfilled, (state) => {
        state.isConnecting = false;
      })
      .addCase(connectWallet.rejected, (state, action) => {
        state.isConnecting = false;
        state.error = action.payload as string;
      });

    // Disconnect wallet
    builder
      .addCase(disconnectWallet.pending, (state) => {
        state.isDisconnecting = true;
      })
      .addCase(disconnectWallet.fulfilled, (state) => {
        state.isDisconnecting = false;
        state.account = null;
        state.isConnected = false;
        state.tokenBalance = '0';
        state.paymentSteps = [...DEFAULT_PAYMENT_STEPS];
        state.error = null;
      });

    // Check token balance
    builder
      .addCase(checkTokenBalance.pending, (state) => {
        state.isCheckingBalance = true;
        state.error = null;
      })
      .addCase(checkTokenBalance.fulfilled, (state, action) => {
        state.isCheckingBalance = false;
        if (action.payload.tokenSymbol === state.selectedToken) {
          state.tokenBalance = action.payload.balance;
        }
      })
      .addCase(checkTokenBalance.rejected, (state, action) => {
        state.isCheckingBalance = false;
        state.error = action.payload as string;
        state.tokenBalance = '0';
      });

    // Process payment
    builder
      .addCase(processPayment.pending, (state) => {
        state.isPaymentLoading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state) => {
        state.isPaymentLoading = false;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isPaymentLoading = false;
        state.error = action.payload as string;
      });
  },
});

// =============================================================================
// ACTIONS & SELECTORS EXPORT
// =============================================================================

export const {
  updateSelectedToken,
  updateCryptoAmount,
  updateUsdPrice,
  updateTokenBalance,
  resetPaymentSteps,
  updateStepStatus,
  setWalletConnection,
  setPaymentData,
  clearPaymentData,
  setPriceLoading,
  setSubscriptionLoading,
  setSessionExpiresAt,
  updateSessionTimer,
  resetSessionState,
  validateSession,
  clearError,
  setError,
} = paymentSlice.actions;

export default paymentSlice.reducer;

// =============================================================================
// SELECTORS
// =============================================================================


// Basic selectors
export const selectPaymentState = (state: RootState) => state.payment;
export const selectSelectedToken = (state: RootState) => state.payment.selectedToken;
export const selectCryptoAmount = (state: RootState) => state.payment.cryptoAmount;
export const selectUsdPrice = (state: RootState) => state.payment.usdPrice;
export const selectTokenBalance = (state: RootState) => state.payment.tokenBalance;
export const selectPaymentSteps = (state: RootState) => state.payment.paymentSteps;
export const selectAccount = (state: RootState) => state.payment.account;
export const selectIsConnected = (state: RootState) => state.payment.isConnected;
export const selectSupportedTokens = (state: RootState) => state.payment.supportedTokens;
export const selectPaymentData = (state: RootState) => state.payment.paymentData;
export const selectError = (state: RootState) => state.payment.error;

// Session selectors
export const selectSessionExpiresAt = (state: RootState) => state.payment.sessionExpiresAt;
export const selectTimeRemaining = (state: RootState) => state.payment.timeRemaining;
export const selectIsExpired = (state: RootState) => state.payment.isExpired;
export const selectIsExpiringSoon = (state: RootState) => state.payment.isExpiringSoon;

// Loading selectors
export const selectIsPaymentLoading = (state: RootState) => state.payment.isPaymentLoading;
export const selectIsConnecting = (state: RootState) => state.payment.isConnecting;
export const selectIsDisconnecting = (state: RootState) => state.payment.isDisconnecting;
export const selectIsCheckingBalance = (state: RootState) => state.payment.isCheckingBalance;
export const selectPriceLoading = (state: RootState) => state.payment.priceLoading;
export const selectSubscriptionLoading = (state: RootState) => state.payment.subscriptionLoading;

// Computed selectors
export const selectHasSufficientBalance = createSelector(
  [selectTokenBalance, selectCryptoAmount],
  (tokenBalance, cryptoAmount) => {
    if (!tokenBalance || !cryptoAmount) return false;
    const balance = parseFloat(tokenBalance);
    const required = parseFloat(cryptoAmount);
    return balance >= required;
  }
);

export const selectIsPaymentButtonDisabled = createSelector(
  [
    selectIsPaymentLoading,
    selectSubscriptionLoading,
    selectIsConnected,
    selectPriceLoading,
    selectIsConnecting,
    selectIsDisconnecting,
    selectHasSufficientBalance,
    selectCryptoAmount,
    selectIsExpired,
  ],
  (
    isPaymentLoading,
    subscriptionLoading,
    isConnected,
    priceLoading,
    isConnecting,
    isDisconnecting,
    hasSufficientBalance,
    cryptoAmount,
    isExpired
  ) => {
    return (
      isPaymentLoading ||
      subscriptionLoading ||
      !isConnected ||
      priceLoading ||
      isConnecting ||
      isDisconnecting ||
      !hasSufficientBalance ||
      cryptoAmount === '0' ||
      isExpired
    );
  }
);

export const selectPaymentButtonText = createSelector(
  [
    selectIsPaymentLoading,
    selectSubscriptionLoading,
    selectPriceLoading,
    selectHasSufficientBalance,
    selectCryptoAmount,
    selectSelectedToken,
  ],
  (
    isPaymentLoading,
    subscriptionLoading,
    priceLoading,
    hasSufficientBalance,
    cryptoAmount,
    selectedToken
  ) => {
    if (isPaymentLoading || subscriptionLoading) {
      return subscriptionLoading ? 'Creating Subscription...' : 'Processing Payment...';
    }
    if (priceLoading) {
      return 'Loading Price...';
    }
    if (!hasSufficientBalance && cryptoAmount !== '0') {
      return `Insufficient ${selectedToken} Balance`;
    }
    const tokenConfig = getTokenConfig(selectedToken);
    const decimals = tokenConfig?.decimals || 18;
    return `Pay ${formatTokenAmount(cryptoAmount, decimals)} ${selectedToken}`;
  }
);

// Loading state selector
export const selectLoadingState = createSelector(
  [
    selectIsPaymentLoading,
    selectIsConnecting,
    selectIsDisconnecting,
    selectIsCheckingBalance,
    selectPriceLoading,
    selectSubscriptionLoading,
  ],
  (
    isPaymentLoading,
    isConnecting,
    isDisconnecting,
    isCheckingBalance,
    priceLoading,
    subscriptionLoading
  ) => ({
    isPaymentLoading,
    isConnecting,
    isDisconnecting,
    isCheckingBalance,
    priceLoading,
    subscriptionLoading,
  })
); 