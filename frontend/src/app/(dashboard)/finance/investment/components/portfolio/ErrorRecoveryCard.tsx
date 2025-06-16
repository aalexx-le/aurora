import {
  getMilestoneIcon,
  getRecoveryActionIcon
} from '@/app/(dashboard)/finance/investment/components/portfolio/PortfolioProgressIcon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

interface ErrorRecoveryCardProps {
  executionId: number;
  errorMessage: string;
  recoveryAction: string | null;
  currentMilestone?: string | null;
  retryCount?: number;
  maxRetries?: number;
  exchangeType?: string | null;
  onRetry?: () => void;
  onUpdateCredentials?: () => void;
  onContactSupport?: () => void;
  onAbort?: () => void;
  className?: string;
}

export const ErrorRecoveryCard: React.FC<ErrorRecoveryCardProps> = ({
  executionId,
  errorMessage,
  recoveryAction,
  currentMilestone,
  retryCount = 0,
  maxRetries = 3,
  exchangeType,
  onRetry,
  onUpdateCredentials,
  onContactSupport,
  onAbort,
  className
}) => {
  const RecoveryActionIcon = recoveryAction ? getRecoveryActionIcon(recoveryAction) : null;
  const MilestoneIcon = currentMilestone ? getMilestoneIcon(currentMilestone) : null;
  
  const canRetry = retryCount < maxRetries;
  const isRateLimited = recoveryAction === 'WAIT_RATE_LIMIT';
  const needsCredentials = recoveryAction === 'UPDATE_CREDENTIALS';
  const needsSupport = recoveryAction === 'CONTACT_SUPPORT';

  // Get recovery action display text
  const getRecoveryActionText = (action: string | null): string => {
    if (!action) return 'Manual intervention required';
    
    const actionTexts: Record<string, string> = {
      RETRY_AUTOMATIC: 'Automatic retry in progress',
      RETRY_MANUAL: 'Manual retry available',
      UPDATE_CREDENTIALS: 'Update API credentials',
      WAIT_RATE_LIMIT: 'Wait for rate limit reset',
      CHECK_PERMISSIONS: 'Check API permissions',
      CONTACT_SUPPORT: 'Contact support team',
      ABORT: 'Task aborted'
    };
    
    return actionTexts[action] || action.replace(/_/g, ' ').toLowerCase();
  };

  // Get recovery action color
  const getRecoveryActionColor = (action: string | null): string => {
    if (!action) return 'destructive';
    
    const actionColors: Record<string, string> = {
      RETRY_AUTOMATIC: 'secondary',
      RETRY_MANUAL: 'default',
      UPDATE_CREDENTIALS: 'default',
      WAIT_RATE_LIMIT: 'secondary',
      CHECK_PERMISSIONS: 'secondary',
      CONTACT_SUPPORT: 'destructive',
      ABORT: 'destructive'
    };
    
    return actionColors[action] || 'secondary';
  };

  const handleRecoveryAction = () => {
    switch (recoveryAction) {
      case 'RETRY_MANUAL':
        onRetry?.();
        break;
      case 'UPDATE_CREDENTIALS':
        onUpdateCredentials?.();
        break;
      case 'CONTACT_SUPPORT':
        onContactSupport?.();
        break;
      case 'ABORT':
        onAbort?.();
        break;
      default:
        // For other actions, show appropriate handler
        break;
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            {MilestoneIcon && <MilestoneIcon size={18} className="text-destructive" />}
            Portfolio Creation Failed
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Error Message */}
        <Alert variant="destructive">
          <AlertDescription className="text-sm">
            {errorMessage}
          </AlertDescription>
        </Alert>

        {/* Recovery Action Information */}
        {recoveryAction && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-medium text-foreground">Recovery Action:</h4>
              <Badge variant={getRecoveryActionColor(recoveryAction) as any} className="flex items-center gap-1.5">
                {RecoveryActionIcon && <RecoveryActionIcon size={12} />}
                {getRecoveryActionText(recoveryAction)}
              </Badge>
            </div>

            {/* Action-specific guidance */}
            {needsCredentials && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Your API credentials appear to be invalid or expired. Please update them to continue.
                </p>
              </div>
            )}

            {isRateLimited && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  The exchange API rate limit has been exceeded. Please wait before retrying.
                </p>
              </div>
            )}

            {needsSupport && (
              <div className="p-3 bg-purple-50 dark:bg-purple-950/50 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  This error requires assistance from our support team. Please contact us with execution ID #{executionId}.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Retry Information */}
        {canRetry && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Retry attempts: {retryCount} / {maxRetries}</span>
            {exchangeType && (
              <span>Exchange: {exchangeType}</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {recoveryAction === 'RETRY_MANUAL' && canRetry && (
            <Button 
              size="sm" 
              onClick={handleRecoveryAction}
              className="flex items-center gap-1.5"
            >
              {RecoveryActionIcon && <RecoveryActionIcon size={14} />}
              Retry Now
            </Button>
          )}
          
          {needsCredentials && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleRecoveryAction}
              className="flex items-center gap-1.5"
            >
              {RecoveryActionIcon && <RecoveryActionIcon size={14} />}
              Update Credentials
            </Button>
          )}
          
          {needsSupport && (
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={handleRecoveryAction}
              className="flex items-center gap-1.5"
            >
              {RecoveryActionIcon && <RecoveryActionIcon size={14} />}
              Contact Support
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => onAbort?.()}
            className="text-muted-foreground hover:text-destructive"
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 