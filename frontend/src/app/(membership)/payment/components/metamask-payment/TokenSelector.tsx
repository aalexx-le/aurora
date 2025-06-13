'use client'

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatTokenAmount, getTokenConfig, type TokenInfo } from '@/lib/utils/metamask-payment';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
    selectCryptoAmount,
    selectHasSufficientBalance,
    selectIsCheckingBalance,
    selectSelectedToken,
    selectSupportedTokens,
    selectTokenBalance,
    updateSelectedToken
} from '@/state/slices/payment.slice';
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { PaymentAmountDisplay } from './PaymentAmountDisplay';

// Types following frontend conventions
interface TokenSelectorProps {
    className?: string;
    disabled?: boolean;
}

// Token option display component for select items
const TokenOption: React.FC<{ option: TokenInfo; }> = ({
    option,
}) => (
    <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3 flex-1">
            <Avatar className="size-4">
                <AvatarImage
                    src={option.icon}
                    alt={`${option.symbol} logo`}
                    className="object-contain"
                />
                <AvatarFallback className="text-xs font-medium">
                    {option.symbol.slice(0, 2)}
                </AvatarFallback>
            </Avatar>

            <div className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="text-primary font-medium text-sm">{option.symbol}</span>
            </div>
        </div>
    </div>
);

// Main token selector component
export const TokenSelector: React.FC<TokenSelectorProps> = ({
    className,
    disabled = false,
}) => {
    const dispatch = useAppDispatch();

    // Redux selectors
    const selectedToken = useAppSelector(selectSelectedToken);
    const supportedTokens = useAppSelector(selectSupportedTokens);

    // Handle token change with validation
    const handleTokenChange = useCallback((newToken: string) => {
        if (disabled) return;
        dispatch(updateSelectedToken(newToken));
    }, [dispatch, disabled]);

    // Get selected token option
    const selectedTokenOption = useMemo(() =>
        supportedTokens.find(option => option.symbol === selectedToken),
        [supportedTokens]
    );

    return (
        <div className={cn("space-y-4", className)}>
            {/* Label */}
            <div>
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="token-selector"
                >
                    Select Payment Token
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                    Choose your preferred cryptocurrency for payment
                </p>
            </div>

            {/* Token Selection Dropdown */}
            <Select
                value={selectedToken}
                onValueChange={handleTokenChange}
                disabled={disabled}
            >
                <SelectTrigger className="w-full" id="token-selector">
                    <SelectValue>
                        {selectedTokenOption ? (
                            <TokenOption option={selectedTokenOption} />
                        ) : (
                            <span className="text-muted-foreground">Select a token...</span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {supportedTokens.map((option) => (
                        <SelectItem
                            key={option.symbol}
                            value={option.symbol}
                            className="py-3"
                        >
                            <TokenOption option={option} />
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

TokenSelector.displayName = 'TokenSelector'; 