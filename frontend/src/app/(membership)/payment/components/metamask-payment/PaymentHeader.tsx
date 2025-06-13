'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
  selectIsExpired,
  selectIsExpiringSoon,
  selectSessionExpiresAt,
  selectTimeRemaining,
  setSessionExpiresAt,
  updateSessionTimer
} from '@/state/slices/payment.slice';
import { ArrowLeft, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { useSessionManager } from '../../hooks/useSessionManager';

interface PaymentHeaderProps {
  onBack: () => void;
  sessionExpiresAt?: string;
  title?: string;
  className?: string;
}

export function PaymentHeader({ 
  onBack, 
  sessionExpiresAt, 
  title = "Complete Payment",
  className 
}: PaymentHeaderProps) {
  const dispatch = useAppDispatch();
  const timeRemaining = useAppSelector(selectTimeRemaining);
  const isExpiringSoon = useAppSelector(selectIsExpiringSoon);
  const isExpired = useAppSelector(selectIsExpired);
  const storedSessionExpiresAt = useAppSelector(selectSessionExpiresAt);

  // Use session manager for validation and handling
  const { validateCurrentSession } = useSessionManager();

  // Update session expiration time when prop changes
  useEffect(() => {
    if (sessionExpiresAt !== storedSessionExpiresAt) {
      dispatch(setSessionExpiresAt(sessionExpiresAt || null));
    }
  }, [sessionExpiresAt, storedSessionExpiresAt, dispatch]);

  useEffect(() => {
    if (!sessionExpiresAt) return;

    const updateTimer = () => {
      // Validate session first
      validateCurrentSession();
      
      const now = new Date();
      const expiry = new Date(sessionExpiresAt);
      const diffMs = expiry.getTime() - now.getTime();

      if (diffMs <= 0) {
        dispatch(updateSessionTimer({
          timeRemaining: 'Expired',
          isExpired: true,
          isExpiringSoon: false,
        }));
        return;
      }

      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      if (diffMinutes < 2) {
        dispatch(updateSessionTimer({
          timeRemaining: `${diffMinutes}:${diffSeconds.toString().padStart(2, '0')}`,
          isExpired: false,
          isExpiringSoon: true,
        }));
      } else {
        dispatch(updateSessionTimer({
          timeRemaining: `${diffMinutes} min`,
          isExpired: false,
          isExpiringSoon: false,
        }));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [sessionExpiresAt, dispatch, validateCurrentSession]);

  const getTimerVariant = () => {
    if (isExpired) return 'destructive';
    if (isExpiringSoon) return 'secondary'; // Will show amber/warning color
    return 'outline';
  };

  return (
    <div className={cn("mb-6 space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Button 
          variant="secondary" 
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
        
        {sessionExpiresAt && (
          <Badge 
            variant={getTimerVariant()}
            className={cn(
              "flex items-center space-x-1",
              isExpiringSoon && "bg-amber-500/10 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800"
            )}
          >
            <Clock className="h-3 w-3" />
            <span className="text-xs font-medium">
              {isExpired ? 'Session Expired' : `${timeRemaining} remaining`}
            </span>
          </Badge>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">
          Secure payment processing with MetaMask
        </p>
      </div>
    </div>
  );
} 