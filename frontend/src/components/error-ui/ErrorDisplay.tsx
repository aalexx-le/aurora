import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, Info as InfoIcon, RefreshCw, XCircle } from 'lucide-react';

export type ErrorSeverity = 'error' | 'warning' | 'info' | 'critical';

export interface ErrorDisplayProps {
  title?: string;
  message: string;
  details?: string;
  severity?: ErrorSeverity;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  compact?: boolean;
}

/**
 * A reusable component for displaying errors with different severity levels
 * using shadcn UI's Alert component
 */
export function ErrorDisplay({
  title,
  message,
  details,
  severity = 'error',
  onRetry,
  onDismiss,
  className,
  compact = false,
}: ErrorDisplayProps) {
  // Map severity to Alert variant
  const variantMap = {
    error: 'destructive',
    critical: 'destructive',
    warning: 'default',
    info: 'default',
  } as const;
  
  // Map severity to icon
  const iconMap = {
    error: <AlertTriangle className="h-4 w-4" />,
    critical: <XCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <InfoIcon className="h-4 w-4" />,
  };

  const variant = variantMap[severity];
  const icon = iconMap[severity];
  
  // For compact display
  if (compact) {
    return (
      <Alert variant={variant} className={cn('flex items-center', className)}>
        {icon}
        <AlertDescription className="ml-3 flex-1">{message}</AlertDescription>
        {onDismiss && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onDismiss} 
            className="ml-auto h-8 px-2"
            aria-label="Dismiss"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        )}
      </Alert>
    );
  }

  return (
    <Alert variant={variant} className={className}>
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>
        <p>{message}</p>
        {details && <p className="text-xs mt-1 opacity-80">{details}</p>}
        {(onRetry || onDismiss) && (
          <div className="mt-4 flex gap-3">
            {onRetry && (
              <Button
                size="sm"
                onClick={onRetry}
                variant="outline"
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Try Again
              </Button>
            )}
            {onDismiss && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
              >
                Dismiss
              </Button>
            )}
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

/**
 * A critical error display component
 */
export function CriticalError(props: Omit<ErrorDisplayProps, 'severity'>) {
  return <ErrorDisplay {...props} severity="critical" />;
}

/**
 * A warning display component
 */
export function Warning(props: Omit<ErrorDisplayProps, 'severity'>) {
  return <ErrorDisplay {...props} severity="warning" />;
}

/**
 * An info display component
 */
export function Info(props: Omit<ErrorDisplayProps, 'severity'>) {
  return <ErrorDisplay {...props} severity="info" />;
}

export default ErrorDisplay; 