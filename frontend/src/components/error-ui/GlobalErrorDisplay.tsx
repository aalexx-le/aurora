"use client";

import { useErrorContext } from '@/lib/context/error-context';
import { ErrorDisplay } from './ErrorDisplay';

export function GlobalErrorDisplay() {
  const { hasError, message, title, severity, clearError } = useErrorContext();
  
  if (!hasError) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <ErrorDisplay
        title={title}
        message={message}
        severity={severity}
        onDismiss={clearError}
      />
    </div>
  );
}

export default GlobalErrorDisplay; 