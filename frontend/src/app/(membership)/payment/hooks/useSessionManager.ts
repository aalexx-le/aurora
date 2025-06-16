'use client';

import MEMBERSHIP_ROUTE from '@/lib/routes/membership-plan.route';
import { useAppDispatch, useAppSelector } from '@/state/hooks';
import {
    resetSessionState,
    selectIsExpired,
    selectIsExpiringSoon,
    selectSessionExpiresAt,
    validateSession,
} from '@/state/slices/payment.slice';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export interface SessionManagerOptions {
  onSessionExpired?: () => void;
  redirectPath?: string;
}

export interface SessionManagerReturn {
  isExpired: boolean;
  isExpiringSoon: boolean;
  sessionExpiresAt: string | null;
  resetSession: () => void;
  validateCurrentSession: () => void;
  handleSessionExpired: () => void;
}

export const useSessionManager = (options: SessionManagerOptions = {}): SessionManagerReturn => {
  const {
    onSessionExpired,
    redirectPath = MEMBERSHIP_ROUTE.plan.value,
  } = options;

  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const isExpired = useAppSelector(selectIsExpired);
  const isExpiringSoon = useAppSelector(selectIsExpiringSoon);
  const sessionExpiresAt = useAppSelector(selectSessionExpiresAt);

  const resetSession = useCallback(() => {
    dispatch(resetSessionState());
  }, [dispatch]);

  const validateCurrentSession = useCallback(() => {
    dispatch(validateSession());
  }, [dispatch]);

  const handleSessionExpired = useCallback(() => {
    if (onSessionExpired) {
      onSessionExpired();
    } else {
      resetSession();
      router.push(redirectPath);
    }
  }, [onSessionExpired, resetSession, router, redirectPath]);

  // Handle session expiration
  useEffect(() => {
    if (isExpired) {
      handleSessionExpired();
    }
  }, [isExpired, handleSessionExpired]);

  // Periodic session validation
  useEffect(() => {
    if (sessionExpiresAt) {
      const interval = setInterval(validateCurrentSession, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [sessionExpiresAt, validateCurrentSession]);

  return {
    isExpired,
    isExpiringSoon,
    sessionExpiresAt,
    resetSession,
    validateCurrentSession,
    handleSessionExpired,
  };
}; 