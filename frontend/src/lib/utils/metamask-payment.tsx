import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

// Helper to get address from environment or fallback to default
const getTokenAddress = (symbol: string): string => {
  const envKey = `NEXT_PUBLIC_${symbol}_ADDRESS`;
  return process.env[envKey] as string
};

export enum PaymentStepStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ERROR = 'error',
}

export enum PaymentStepId {
  CONNECT = 'connect',
  APPROVE = 'approve',
  TRANSACTION = 'transaction',
  VERIFY = 'verify',
}

export interface PaymentStep {
  id: PaymentStepId;
  label: string;
  status: PaymentStepStatus;
  description: string;
}

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  icon: string;
}

// Token configurations with contract addresses, decimals, and icons
export const TOKEN_CONFIGS: Record<string, TokenInfo> = {
  'USDT': {
    symbol: 'USDT',
    name: 'Tether USD',
    address: process.env.NEXT_PUBLIC_USDT_ADDRESS as string,
    decimals: 6,
    icon: '/crypto-logo/usdt.svg',
  },
  'ETH': {
    symbol: 'ETH',
    name: 'Ethereum',
    address: process.env.NEXT_PUBLIC_ETH_ADDRESS as string,
    decimals: 18,
    icon: '/crypto-logo/eth.svg',
  },
  'BTC': {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: process.env.NEXT_PUBLIC_BTC_ADDRESS as string,
    decimals: 8,
    icon: '/crypto-logo/btc.svg',
  },
};

// Legacy token display mapping for backward compatibility
export const TOKEN_DISPLAY_MAP: Record<string, string> = Object.fromEntries(
  Object.values(TOKEN_CONFIGS).map(token => [token.symbol, token.name])
);

// Default payment steps configuration
export const DEFAULT_PAYMENT_STEPS = [
    { id: PaymentStepId.CONNECT, label: 'Connect Wallet', status: PaymentStepStatus.PENDING, description: 'Connect your MetaMask wallet' },
    { id: PaymentStepId.APPROVE, label: 'Approve Payment', status: PaymentStepStatus.PENDING, description: 'Sign payment authorization' },
    { id: PaymentStepId.TRANSACTION, label: 'Send Transaction', status: PaymentStepStatus.PENDING, description: 'Send cryptocurrency payment' },
    { id: PaymentStepId.VERIFY, label: 'Verify Payment', status: PaymentStepStatus.PENDING, description: 'Confirm transaction on blockchain' },
] as const;

// Transaction constants
export const TRANSACTION_CONSTANTS = {
    ETH_DECIMALS: 18,
    DEFAULT_GAS_LIMIT: '0x5208', // 21000 in hex
    ADDRESS_VALIDATION_REGEX: /^0x[a-fA-F0-9]{40}$/,
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
} as const;

// Error messages
export const ERROR_MESSAGES = {
    WALLET_NOT_CONNECTED: 'Wallet not connected',
    FAILED_TO_CONNECT: 'Failed to connect to MetaMask',
    FAILED_TO_SWITCH_ACCOUNT: 'Failed to switch account',
    PAYMENT_AUTHORIZATION_FAILED: 'Payment authorization failed',
    PAYMENT_FAILED: 'Payment failed',
    MISSING_TRANSACTION_PARAMETERS: 'Missing transaction parameters',
    PAYMENT_RECEIVER_NOT_CONFIGURED: 'Payment receiver address not configured',
    INVALID_PAYMENT_RECEIVER_FORMAT: 'Invalid payment receiver address format',
    FAILED_TO_SEND_TRANSACTION: 'Failed to send transaction',
    INVALID_CONTRACT_ADDRESS_FORMAT: 'Invalid payment contract address format',
    UNSUPPORTED_TOKEN: 'Unsupported token selected',
    INSUFFICIENT_TOKEN_BALANCE: 'Insufficient token balance',
    TOKEN_TRANSFER_FAILED: 'Token transfer failed',
} as const;

// Payment step icon utility
export const getStepIcon = (step: PaymentStep) => {
  switch (step.status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'active':
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    default:
      return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
  }
};

// Address validation utility
export const isValidEthereumAddress = (address: string): boolean => {
  return TRANSACTION_CONSTANTS.ADDRESS_VALIDATION_REGEX.test(address);
};

// Check if address is the zero address (native ETH)
export const isZeroAddress = (address: string): boolean => {
  if (!address) return false;
  
  // Normalize the address to lowercase and remove any whitespace
  const normalizedAddress = address.toLowerCase().trim();
  
  // Check for zero address patterns
  const zeroAddressPatterns = [
    '0x0000000000000000000000000000000000000000',
    '0x',
    '',
    'eth'
  ];
  
  return zeroAddressPatterns.includes(normalizedAddress) || 
         normalizedAddress === '0x' + '0'.repeat(40);
};

// Wei conversion utility (for ETH)
export const convertToWei = (amount: string, decimals: number = TRANSACTION_CONSTANTS.ETH_DECIMALS): string => {
  const valueInWei = parseFloat(amount) * Math.pow(10, decimals);
  return '0x' + valueInWei.toString(16);
};

// Get token configuration by symbol
export const getTokenConfig = (symbol: string): TokenInfo | null => {
  return TOKEN_CONFIGS[symbol] || null;
};

// Check if token is native (ETH) by checking if address is zero address
export const isNativeToken = (symbol: string): boolean => {
  const config = getTokenConfig(symbol);
  return config ? isZeroAddress(config.address) : false;
};

// Check if token address represents native token
export const isNativeTokenByAddress = (address: string): boolean => {
  return isZeroAddress(address);
};

// Token amount formatting utility
export const formatTokenAmount = (amount: string, decimals: number): string => {
  try {
    const value = parseFloat(amount);
    if (isNaN(value)) return '0';
    
    // Show appropriate decimal places based on value
    if (value >= 1) {
      return value.toFixed(Math.min(4, decimals));
    } else {
      return value.toFixed(Math.min(8, decimals));
    }
  } catch {
    return '0';
  }
};

// Payment metadata encoding utility
export const encodePaymentMetadata = (data: {
  signature: string;
  message: string;
  timestamp: number;
  amount: number;
  currency: string;
  planId: string;
  tokenSymbol: string;
  tokenAddress: string;
}): string => {
  const paymentMetadata = JSON.stringify(data);
  return '0x' + Buffer.from(paymentMetadata, 'utf8').toString('hex');
};

// Payment message generator
export const generatePaymentMessage = (
  amount: number, 
  currency: string, 
  timestamp: number,
  tokenSymbol?: string
): string => {
  const tokenInfo = tokenSymbol ? ` (${tokenSymbol})` : '';
  return `Payment authorization: $${amount.toFixed(2)} ${currency}${tokenInfo} for subscription at ${timestamp}`;
};

// Validate token transfer parameters
export const validateTokenTransferParams = (
  tokenSymbol: string,
  amount: string,
  recipientAddress: string
): { isValid: boolean; error?: string } => {
  // Check if token is supported
  const tokenConfig = getTokenConfig(tokenSymbol);
  if (!tokenConfig) {
    return { isValid: false, error: ERROR_MESSAGES.UNSUPPORTED_TOKEN };
  }

  // Validate amount
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return { isValid: false, error: 'Invalid amount specified' };
  }

  // Validate recipient address
  if (!isValidEthereumAddress(recipientAddress)) {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_PAYMENT_RECEIVER_FORMAT };
  }

  return { isValid: true };
}; 