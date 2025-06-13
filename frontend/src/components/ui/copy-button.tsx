"use client"

import { Button, ButtonProps } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';
import React from 'react';

interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  textToCopy: string;
  successMessage?: string;
  errorMessage?: string;
  resetDelay?: number;
  showIcon?: boolean;
  iconSize?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  textToCopy,
  successMessage = "Copied to clipboard!",
  errorMessage = "Failed to copy to clipboard",
  resetDelay = 2000,
  showIcon = true,
  iconSize = "h-4 w-4",
  className,
  children,
  disabled,
  ...props
}) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({
    successMessage,
    errorMessage,
    resetDelay,
  });

  const handleCopy = async () => {
    if (disabled || !textToCopy) return;
    await copyToClipboard(textToCopy);
  };

  return (
    <Button
      {...props}
      onClick={handleCopy}
      disabled={disabled || !textToCopy}
      className={cn(
        "transition-all duration-200",
        isCopied && [
          "bg-primary/10 border-primary/20 text-primary",
          "hover:bg-primary/15",
          "dark:bg-primary/10 dark:border-primary/20 dark:text-primary",
          "dark:hover:bg-primary/15"
        ],
        className
      )}
      aria-label={isCopied ? "Copied!" : `Copy ${textToCopy}`}
    >
      {showIcon && (
        <>
          {isCopied ? (
            <Check className={cn(iconSize, children && "mr-2")} />
          ) : (
            <Copy className={cn(iconSize, children && "mr-2")} />
          )}
        </>
      )}
      {children}
    </Button>
  );
};
