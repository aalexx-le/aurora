import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PortfolioCreationMilestone, PortfolioCreationStep } from '@/gql/graphql';
import {
  PORTFOLIO_STEPS,
  getCompletedStorageStepsCount,
  getStepIndex,
  type ExecutionStep
} from '@/lib/constants/portfolio-steps';
import { cn } from '@/lib/utils';
import { ChartBarIcon, CheckCircle, Clock, Database, FolderPlusIcon, Shield, XCircle } from 'lucide-react';
import moment from 'moment';
import React from 'react';
import {
  getMilestoneIcon
} from './PortfolioProgressIcon';

interface PortfolioExecutionProgressProps {
  execution: {
    id: number;
    currentStep?: PortfolioCreationStep | null;
    currentMilestone?: PortfolioCreationMilestone | null;
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
  showStorageStatus?: boolean;
  enableFaultToleranceMessaging?: boolean;
}

export const PortfolioExecutionProgress: React.FC<PortfolioExecutionProgressProps> = ({
  execution,
  className,
  showStorageStatus = true,
  enableFaultToleranceMessaging = true
}) => {
  // Find current step index using the helper function
  const currentStepIndex = execution.currentStep 
    ? getStepIndex(execution.currentStep)
    : -1;

  const hasError = Boolean(execution.errorMessage);
  const isCompleted = execution.currentMilestone === PortfolioCreationMilestone.Completed;
  const isProcessing = currentStepIndex >= 0 && !hasError && !isCompleted;

  // Get the status of each step
  const getStepStatus = (stepIndex: number) => {
    if (hasError && stepIndex === currentStepIndex) return 'error';
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return isCompleted ? 'completed' : 'active';
    return 'pending';
  };

  // Get storage status for steps with incremental storage
  const getStorageStatus = (step: ExecutionStep, status: string) => {
    if (!step.hasIncrementalStorage) return null;
    if (status === 'completed') return 'stored';
    if (status === 'active') return 'storing';
    return 'pending';
  };

  // Get step icon with appropriate styling
  const getStepIcon = (step: ExecutionStep, status: string) => {
    const IconComponent = getMilestoneIcon(step.milestone);

    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400" />;
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
    (currentStepIndex >= 0 ? PORTFOLIO_STEPS[currentStepIndex].progressPercent : 0);

  // Determine if we're in the analytics phase (steps 3-7 in 9-step workflow)
  const isAnalyticsPhase = currentStepIndex >= 3 && currentStepIndex <= 7;

  // Count completed storage steps for fault tolerance messaging
  const completedStorageSteps = getCompletedStorageStepsCount(currentStepIndex);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {isAnalyticsPhase ? (
              <ChartBarIcon size={20} className="text-blue-600 dark:text-blue-400" />
            ) : (
              <FolderPlusIcon size={20} className="text-primary" />
            )}
            {isAnalyticsPhase ? 'Computing Advanced Analytics' : 'Creating Portfolio'}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            #{execution.id}
          </Badge>
        </div>

        {/* Description */}
        <div className="text-sm text-muted-foreground">
          {isAnalyticsPhase ? (
            "Computing advanced analytics and performance insights for your portfolio"
          ) : (
            "Setting up your portfolio with current exchange data and comprehensive analytics"
          )}
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
            <span className="text-sm font-medium">
              Portfolio Creation Progress
            </span>
            <span className="text-sm text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress
            value={overallProgress}
            className={cn(
              "h-2",
              hasError ? "[&>div]:bg-destructive" : isCompleted ? "[&>div]:bg-emerald-600" : ""
            )}
          />
        </div>

        {/* Enhanced Error Message with Recovery Context */}
        {hasError && execution.errorMessage && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive font-medium">Error:</p>
            <p className="text-sm text-destructive/80 mt-1">{execution.errorMessage}</p>
            {enableFaultToleranceMessaging && completedStorageSteps > 0 && (
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Resuming from last saved step - no data loss
              </p>
            )}
          </div>
        )}

        <Separator />

        {/* Step-by-step Progress */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-foreground">
            Creation Steps {enableFaultToleranceMessaging && <span className="text-xs text-muted-foreground">(9 steps with incremental storage)</span>}
          </h4>
          <div className="relative space-y-1">
            {PORTFOLIO_STEPS.map((step, index) => {
              const status = getStepStatus(index);
              const storageStatus = getStorageStatus(step, status);
              const isCurrentStep = index === currentStepIndex;

              return (
                <div key={step.step} className="relative">
                  <div
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-colors relative",
                      isCurrentStep && !hasError ? "bg-primary/5 border border-primary/20" : "",
                      status === 'completed' ? "bg-emerald-50 dark:bg-emerald-950/20" : "",
                      status === 'error' ? "bg-destructive/5 border border-destructive/20" : ""
                    )}
                  >
                    <div className="flex flex-col mt-0.5 relative z-10 items-center justify-between gap-2">
                      {/* Step Icon */}
                      <div className="relative">
                        {getStepIcon(step, status)}
                        {/* Storage Indicator */}
                        {showStorageStatus && step.hasIncrementalStorage && (
                          <div className={cn(
                            "absolute -top-1 -right-1 w-3 h-3 rounded-full border border-background flex items-center justify-center",
                            storageStatus === 'stored' ? "bg-emerald-600" : 
                            storageStatus === 'storing' ? "bg-blue-600 animate-pulse" : 
                            "bg-muted"
                          )}>
                            {storageStatus === 'stored' && <Database className="w-2 h-2 text-white" />}
                          </div>
                        )}
                      </div>
                      {/* Connection Line to Next Step */}
                      {index < PORTFOLIO_STEPS.length - 1 && (
                        <div className={cn(
                          "w-[2px] h-4 transition-colors",
                          status === 'completed' ? "bg-emerald-600 h-2" :
                            status === 'active' ? "bg-primary" : "bg-border"
                        )} />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className={cn(
                          "text-sm font-medium",
                          status === 'completed' ? "text-emerald-700 dark:text-emerald-300" : "",
                          status === 'error' ? "text-destructive" : "",
                          status === 'active' ? "text-primary" : "",
                          status === 'pending' ? "text-muted-foreground" : ""
                        )}>
                          {step.label}
                        </h5>
                        {step.estimatedTime && !status.includes('completed') && (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            {step.estimatedTime}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>

                      {/* Storage Status Message */}
                      {showStorageStatus && step.hasIncrementalStorage && storageStatus && (
                        <div className="text-xs mt-1">
                          {storageStatus === 'storing' && (
                            <span className="text-blue-700 dark:text-blue-300 flex items-center gap-1">
                              <Database className="w-3 h-3" />
                              Securing data...
                            </span>
                          )}
                          {storageStatus === 'stored' && (
                            <span className="text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                              <Database className="w-3 h-3" />
                              Data secured
                            </span>
                          )}
                        </div>
                      )}

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