'use client'

import { MetaMaskSDKOptions, MetaMaskProvider as MetaMaskSDKProvider, useSDK } from '@metamask/sdk-react';
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';
import { createContext, ReactNode, useCallback, useContext, useMemo } from 'react';

// Constants
const ETH_DECIMALS = 18;
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const DEFAULT_GAS_LIMIT = '0x5208'; // 21000 in hex

// ERC-20 ABI for token operations
const ERC20_ABI = [
  "function transfer(address to, uint256 value) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)"
] as const;

// Types
export interface TransactionParams {
  to: string;
  value: string;
  gas?: string;
}

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

export interface MetaMaskContextType {
  account: string | null;
  isConnected: boolean;
  provider: any;
  connect: () => Promise<string[] | null>;
  disconnect: () => void;
  signMessage: (message: string) => Promise<string | null>;
  sendTransaction: (params: TransactionParams) => Promise<TransactionResult>;
  transferToken: (params: TokenTransferParams) => Promise<TransactionResult>;
  getTokenBalance: (tokenAddress: string, address?: string) => Promise<TokenBalance>;
  sdk: any;
}

// Utility functions
const isZeroAddress = (address: string): boolean => {
  if (!address) return false;
  
  // Normalize the address to lowercase and remove any whitespace
  const normalizedAddress = address.toLowerCase().trim();
  
  // Check for zero address patterns
  const zeroAddressPatterns = [
    ZERO_ADDRESS.toLowerCase(),
    '0x',
    '',
    'eth'
  ];
  
  return zeroAddressPatterns.includes(normalizedAddress) || 
         normalizedAddress === '0x' + '0'.repeat(40);
};

const validateAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

const formatError = (error: unknown, defaultMessage: string): Error => {
  if (error instanceof Error) {
    return error;
  }
  return new Error(defaultMessage);
};

// Context
const MetaMaskContext = createContext<MetaMaskContextType | null>(null);

// Hook to use MetaMask context
export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (!context) {
    throw new Error('useMetaMask must be used within a MetaMaskProvider');
  }
  return context;
};

// Inner provider that uses the SDK
const MetaMaskProviderInner = ({ children }: { children: ReactNode }) => {
  const { sdk, connected, connecting, account, provider } = useSDK();

  // Memoized connection state
  const isConnected = useMemo(() => connected && !!account, [connected, account]);

  // Connect to MetaMask
  const connect = useCallback(async (): Promise<string[] | null> => {
    try {
      if (!sdk) {
        throw new Error('MetaMask SDK not initialized');
      }
      
      const accounts = await sdk.connect();
      return accounts as string[];
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
      throw formatError(error, 'Failed to connect to MetaMask');
    }
  }, [sdk]);

  // Disconnect from MetaMask
  const disconnect = useCallback(() => {
    try {
      if (sdk) {
        sdk.disconnect();
      }
    } catch (error) {
      console.error('Failed to disconnect from MetaMask:', error);
    }
  }, [sdk]);

  // Sign a message
  const signMessage = useCallback(async (message: string): Promise<string | null> => {
    try {
      if (!provider || !account) {
        throw new Error('MetaMask not connected');
      }

      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, account],
      });

      return signature as string;
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw formatError(error, 'Failed to sign message');
    }
  }, [provider, account]);

  // Send basic ETH transaction
  const sendTransaction = useCallback(async (params: TransactionParams): Promise<TransactionResult> => {
    try {
      if (!provider || !account) {
        throw new Error('MetaMask not connected');
      }

      if (!validateAddress(params.to)) {
        throw new Error('Invalid recipient address');
      }

      const transactionParams = {
        from: account,
        to: params.to,
        value: params.value,
        gas: params.gas || DEFAULT_GAS_LIMIT,
      };

      const hash = await provider.request({
        method: 'eth_sendTransaction',
        params: [transactionParams],
      });

      return {
        hash: hash as string,
      };
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw formatError(error, 'Failed to send transaction');
    }
  }, [provider, account]);

  // Send token transfer (universal for ETH and ERC-20)
  const transferToken = useCallback(async (params: TokenTransferParams): Promise<TransactionResult> => {
    try {
      if (!provider || !account) {
        throw new Error('MetaMask not connected');
      }

      if (!validateAddress(params.recipientAddress)) {
        throw new Error('Invalid recipient address');
      }

      const amount = parseFloat(params.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid amount');
      }

      // Handle native ETH transfers (detect by zero address)
      if (isZeroAddress(params.tokenAddress)) {
        const decimals = params.decimals || ETH_DECIMALS;
        const valueInWei = parseFloat(params.amount) * Math.pow(10, decimals);
        const valueHex = '0x' + Math.floor(valueInWei).toString(16);

        const transactionParams = {
          from: account,
          to: params.recipientAddress,
          value: valueHex,
          gas: DEFAULT_GAS_LIMIT,
        };

        const hash = await provider.request({
          method: 'eth_sendTransaction',
          params: [transactionParams],
        });

        return {
          hash: hash as string,
        };
      }

      // Handle ERC-20 token transfers
      if (!validateAddress(params.tokenAddress)) {
        throw new Error('Invalid token contract address');
      }

      const ethersProvider = new BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();

      // Validate contract exists
      const code = await ethersProvider.getCode(params.tokenAddress);
      if (code === '0x') {
        throw new Error(`No contract found at address ${params.tokenAddress}`);
      }

      // Create contract instance
      const tokenContract = new Contract(params.tokenAddress, ERC20_ABI, signer);

      // Format amount with proper decimals
      const decimals = params.decimals || ETH_DECIMALS;
      const formattedAmount = parseUnits(params.amount, decimals);

      // Send the transaction
      const tx = await tokenContract.transfer(params.recipientAddress, formattedAmount);

      // Wait for transaction to be mined
      const receipt = await tx.wait();

      return {
        hash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString(),
        gasPrice: receipt.gasPrice?.toString(),
      };

    } catch (error) {
      console.error('Failed to send token transfer:', error);
      throw formatError(error, 'Failed to send token transfer');
    }
  }, [provider, account]);

  // Get ETH balance
  const getEthBalance = useCallback(async (address: string): Promise<TokenBalance> => {
    try {
      if (!provider) {
        throw new Error('MetaMask not connected');
      }

      if (!validateAddress(address)) {
        throw new Error('Invalid address');
      }

      const balance = await provider.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });

      return {
        balance: balance as string,
        formatted: formatUnits(balance as string, ETH_DECIMALS),
        decimals: ETH_DECIMALS,
        symbol: 'ETH',
      };
    } catch (error) {
      console.error('Failed to get ETH balance:', error);
      throw formatError(error, 'Failed to get ETH balance');
    }
  }, [provider]);

  // Get token balance (universal for ETH and ERC-20)
  const getTokenBalance = useCallback(async (tokenAddress: string, address?: string): Promise<TokenBalance> => {
    try {
      const targetAddress = address || account;
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      if (!validateAddress(targetAddress)) {
        throw new Error('Invalid target address');
      }

      // Handle native ETH balance (detect by zero address)
      if (isZeroAddress(tokenAddress)) {
        return await getEthBalance(targetAddress);
      }

      // Handle ERC-20 token balance
      if (!validateAddress(tokenAddress)) {
        throw new Error('Invalid token contract address');
      }

      if (!provider) {
        throw new Error('MetaMask not connected');
      }

      const ethersProvider = new BrowserProvider(provider);

      // Validate contract exists
      const code = await ethersProvider.getCode(tokenAddress);
      if (code === '0x') {
        throw new Error(`No contract found at address ${tokenAddress}. This might be a native token address.`);
      }

      // Create contract instance
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, ethersProvider);

      // Get token information in parallel
      const [balance, decimals, symbol] = await Promise.all([
        tokenContract.balanceOf(targetAddress),
        tokenContract.decimals(),
        tokenContract.symbol(),
      ]);

      return {
        balance: balance.toString(),
        formatted: formatUnits(balance, decimals),
        decimals: Number(decimals),
        symbol,
      };

    } catch (error) {
      console.error('Failed to get token balance:', error);
      throw formatError(error, 'Failed to get token balance');
    }
  }, [provider, account, getEthBalance]);

  // Memoized context value
  const contextValue = useMemo((): MetaMaskContextType => ({
    account: account || null,
    isConnected,
    provider,
    connect,
    disconnect,
    signMessage,
    sendTransaction,
    transferToken,
    getTokenBalance,
    sdk,
  }), [
    account,
    isConnected,
    provider,
    connect,
    disconnect,
    signMessage,
    sendTransaction,
    transferToken,
    getTokenBalance,
    sdk,
  ]);

  return (
    <MetaMaskContext.Provider value={contextValue}>
      {children}
    </MetaMaskContext.Provider>
  );
};

// SDK configuration
const createSDKOptions = (): MetaMaskSDKOptions => {
  const host = typeof window !== 'undefined' ? window.location.host : 'localhost';
  
  const baseOptions: MetaMaskSDKOptions = {
    logging: { 
      developerMode: process.env.NODE_ENV === 'development' 
    },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: 'Aurora',
      url: host,
    },
    infuraAPIKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
  };

  return baseOptions;
};

// Main provider that wraps the SDK provider
export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const sdkOptions = useMemo(() => createSDKOptions(), []);

  return (
    <MetaMaskSDKProvider debug={false} sdkOptions={sdkOptions}>
      <MetaMaskProviderInner>{children}</MetaMaskProviderInner>
    </MetaMaskSDKProvider>
  );
}; 