import { useCallback, useEffect, useState } from 'react';
import { useToast } from './use-toast';

interface UseCopyToClipboardOptions {
  successMessage?: string;
  errorMessage?: string;
  resetDelay?: number;
}

interface UseCopyToClipboardReturn {
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
}

export const useCopyToClipboard = (
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn => {
  const {
    successMessage = "Copied",
    errorMessage = "Failed to copy",
    resetDelay = 2000,
  } = options;

  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  // Auto-reset copy state with cleanup
  useEffect(() => {
    if (!isCopied) return;

    const timeoutId = setTimeout(() => {
      setIsCopied(false);
    }, resetDelay);

    return () => clearTimeout(timeoutId);
  }, [isCopied, resetDelay]);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) return;

    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast({
        title: successMessage,
      });
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.setAttribute('readonly', '');
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setIsCopied(true);
          toast({
            title: successMessage,
          });
        } else {
          throw new Error('Copy command failed');
        }
      } catch (fallbackError) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  }, [successMessage, errorMessage, toast]);

  return { isCopied, copyToClipboard };
}; 