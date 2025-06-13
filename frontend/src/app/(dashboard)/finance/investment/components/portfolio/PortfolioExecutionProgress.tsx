import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  getMilestoneIcon
} from '@/lib/icons/portfolio-progress-icons';
import { cn } from '@/lib/utils';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import moment from 'moment';
import React from 'react';

interface ExecutionStep {
  step: string;
  milestone: string;
  progressPercent: number;
  label: string;
  description: string;
}

interface PortfolioExecutionProgressProps {
  execution: {
    id: number;
    currentStep?: string | null;
    currentMilestone?: string | null;
    progressPercent?: number | null;
    errorMessage?: string | null;
    recoveryAction?: string | null;
    retryCount?: number | null;
    maxRetries?: number | null;
    exchangeType?: string | null;
    createdAt: string;
    updatedAt: string;
    completedAt?: string | null;
  };
  className?: string;
}

// Optimized portfolio creation workflow with streamlined 5-step flow
const EXECUTION_STEPS: ExecutionStep[] = [
  {
    step: 'VALIDATION',
    milestone: 'INITIALIZED',
    progressPercent: 20,
    label: 'Exchange Validation',
    description: 'Validating exchange support and API configuration'
  },
  {
    step: 'AUTHENTICATION',
    milestone: 'CREDENTIALS_VERIFIED',
    progressPercent: 40,
    label: 'Credential Verification',
    description: 'Decrypting API credentials and testing exchange connection'
  },
  {
    step: 'BALANCE_RETRIEVAL',
    milestone: 'BALANCES_FETCHED',
    progressPercent: 70,
    label: 'Balance Processing',
    description: 'Retrieving and processing account balances'
  },
  {
    step: 'DATABASE_STORAGE',
    milestone: 'PORTFOLIO_STORED',
    progressPercent: 90,
    label: 'Data Storage',
    description: 'Storing portfolio and balance information'
  },
  {
    step: 'COMPLETION',
    milestone: 'COMPLETED',
    progressPercent: 100,
    label: 'Completion',
    description: 'Portfolio creation completed successfully'
  }
];

export const PortfolioExecutionProgress: React.FC<PortfolioExecutionProgressProps> = ({
  execution,
  className
}) => {
  const currentStepIndex = execution.currentStep
    ? EXECUTION_STEPS.findIndex(step => step.step === execution.currentStep)
    : -1;

  const hasError = Boolean(execution.errorMessage);
  const isCompleted = execution.currentMilestone === 'COMPLETED';
  const isProcessing = currentStepIndex >= 0 && !hasError && !isCompleted;

  // Get the status of each step
  const getStepStatus = (stepIndex: number) => {
    if (hasError && stepIndex === currentStepIndex) return 'error';
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return isCompleted ? 'completed' : 'active';
    return 'pending';
  };

  // Get step icon with appropriate styling
  const getStepIcon = (step: ExecutionStep, status: string) => {
    const IconComponent = getMilestoneIcon(step.milestone);

    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <XCircle size={20} className="text-destructive" />;
      case 'active':
        return <IconComponent size={20} className="text-primary animate-pulse" />;
      default:
        return <Clock size={20} className="text-muted-foreground" />;
    }
  };

  // Calculate overall progress
  const overallProgress = execution.progressPercent ||
    (currentStepIndex >= 0 ? EXECUTION_STEPS[currentStepIndex].progressPercent : 0);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle size={20} className="text-green-500" />
            ) : hasError ? (
              <XCircle size={20} className="text-destructive" />
            ) : (
              <Clock size={20} className="text-primary" />
            )}
            Portfolio Creation Progress
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            #{execution.id}
          </Badge>
        </div>

        {execution.exchangeType && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Exchange:</span>
            <Badge variant="secondary" className="text-xs">
              {execution.exchangeType}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress
            value={overallProgress}
            className={cn(
              "h-2",
              hasError ? "progress-error" : isCompleted ? "progress-success" : ""
            )}
          />
        </div>

        {/* Error Message */}
        {hasError && execution.errorMessage && (
          <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Error:</p>
            <p className="text-sm text-destructive/80 mt-1">{execution.errorMessage}</p>
          </div>
        )}

        <Separator />

        {/* Step-by-step Progress */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">Execution Steps</h4>
          <div className="relative space-y-1">
            {EXECUTION_STEPS.map((step, index) => {
              const status = getStepStatus(index);
              const isCurrentStep = index === currentStepIndex;

              return (
                <div key={step.step} className="relative">
                  <div
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-colors relative",
                      isCurrentStep && !hasError ? "bg-primary/5 border border-primary/20" : "",
                      status === 'completed' ? "bg-green-50 dark:bg-green-950/20" : "",
                      status === 'error' ? "bg-destructive/5 border border-destructive/20" : ""
                    )}
                  >
                    <div className="flex flex-col mt-0.5 relative z-10 items-center justify-between gap-2">
                      {/* Step Icon */}
                      <div>
                        {getStepIcon(step, status)}
                      </div>
                      {/* Connection Line to Next Step */}
                      {index < EXECUTION_STEPS.length - 1 && (
                        <div className={cn(
                          "w-[2px] h-4 transition-colors",
                          status === 'completed' ? "bg-green-500 h-2" :
                            status === 'active' ? "bg-primary" : "bg-border"
                        )} />
                      )}
                    </div>


                    {/* Step Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className={cn(
                          "text-sm font-medium",
                          status === 'completed' ? "text-green-700 dark:text-green-300" : "",
                          status === 'error' ? "text-destructive" : "",
                          status === 'active' ? "text-primary" : "",
                          status === 'pending' ? "text-muted-foreground" : ""
                        )}>
                          {step.label}
                        </h5>
                        <span className="text-xs text-muted-foreground">
                          {step.progressPercent}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>

                      {/* Current step progress indicator */}
                      {isCurrentStep && !hasError && !isCompleted && (
                        <div className="mt-2">
                          <Progress
                            value={75} // Indicates step is in progress
                            className="h-1"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Retry Information */}
        {execution.retryCount !== null && execution.retryCount !== undefined && execution.retryCount > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Retry Attempts:</span>
              <span className="font-medium">
                {execution.retryCount} / {execution.maxRetries || 3}
              </span>
            </div>
          </>
        )}

        {/* Timestamps */}
        <Separator />
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex gap-4">
            <span>Started:</span>
            <span>{moment(execution.createdAt).format('DD/MM/YYYY, H:mm:ss')}</span>
          </div>
          <div className="flex gap-4">
            <span>Last Updated:</span>
            <span>{moment(execution.updatedAt).format('DD/MM/YYYY, H:mm:ss')}</span>
          </div>
          {execution.completedAt && (
            <div className="flex gap-4">
              <span>Completed:</span>
              <span>{moment(execution.completedAt).format('DD/MM/YYYY, H:mm:ss')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 