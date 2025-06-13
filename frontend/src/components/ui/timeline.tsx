import CategoryAvatar from "@/app/(dashboard)/finance/expense/components/category-list/CategoryAvatar";
import { Progress } from '@/components/ui/progress';
import {
    getIconStyle,
    getMilestoneIcon,
    getStatusIcon,
    getStepIcon
} from '@/lib/icons/portfolio-progress-icons';
import { cn } from '@/lib/utils';
import moment from "moment/moment";
import * as React from 'react';

interface BaseTimelineProps {
  time: string;
  className?: string;
}

// Legacy timeline props for backward compatibility
interface LegacyTimelineProps extends BaseTimelineProps {
  statuses: string[];
  currentStatus: string;
  // Enhanced props are optional for backward compatibility
  progressPercent?: never;
  currentStep?: never;
  currentMilestone?: never;
  errorMessage?: never;
  showProgress?: never;
  showIcons?: never;
}

// Enhanced timeline props for new functionality
interface TimelineProps extends BaseTimelineProps {
  // Enhanced fields
  progressPercent?: number;
  currentStep?: string | null;
  currentMilestone?: string | null;
  errorMessage?: string | null;
  status?: string;
  
  // Display options
  showProgress?: boolean;
  showIcons?: boolean;
  
  // Legacy props are optional for enhanced mode
  statuses?: string[];
  currentStatus?: string;
}

type AllTimelineProps = LegacyTimelineProps | TimelineProps;

const Timeline: React.FC<AllTimelineProps> = (props) => {
  // Determine if this is legacy or enhanced mode
  const isLegacyMode = 'statuses' in props && props.statuses !== undefined;
  
  if (isLegacyMode) {
    return <LegacyTimeline {...props as LegacyTimelineProps} />;
  }
  
  return <TimelineComponent {...props as TimelineProps} />;
};

// Legacy timeline component (unchanged for backward compatibility)
const LegacyTimeline: React.FC<LegacyTimelineProps> = ({statuses, currentStatus, time}) => {
    const currentIndex = statuses.indexOf(currentStatus);

    const Circle = ({index}: { index: number }) => {
        if (index < currentIndex) {
            return (
                <div className="relative size-2">
                    <div
                        className={cn("absolute rounded-full inset-0 w-full h-full flex items-center justify-center bg-chart-2")}
                    >
                    </div>
                </div>
            );
        }
        else if (index === currentIndex) {
            return (
                <CategoryAvatar avatar="#499D81" className="size-3"/>
            );
        }
        else {
            return (
                <div className="relative size-2">
                    <div
                        className={cn("absolute rounded-full inset-0 w-full h-full flex items-center justify-center bg-muted-foreground")}
                    >
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="relative w-full">
            <div className="flex items-center">
                <p className="text-muted-foreground text-xs mr-6">{moment(time).format("DD/MM/YYYY, H:mm a")}</p>
                {statuses.map((status, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div
                            className={cn(
                                "relative flex items-center gap-1",
                            )}
                        >
                            <Circle index={index}/>
                            <div className="text-center">
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        index <= currentIndex ? "text-chart-2" : "text-muted-foreground"
                                    )}
                                >
                                  {status}
                                </span>
                            </div>
                        </div>
                        {index < statuses.length - 1 && (
                            <div
                                className={cn(
                                    "h-[2px] w-20 mr-3",
                                    index < currentIndex ? "bg-chart-2" : "bg-muted-foreground"
                                )}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Enhanced timeline component with new features
const TimelineComponent: React.FC<TimelineProps> = ({
  time,
  progressPercent = 0,
  currentStep,
  currentMilestone,
  errorMessage,
  status = 'QUEUE',
  showProgress = true,
  showIcons = true,
  className
}) => {
  const hasError = errorMessage !== null || status === 'FAILED';
  const isCompleted = status === 'SUCCESS' || currentMilestone === 'COMPLETED';
  const isProcessing = status === 'PROCESSING';

  // Get appropriate icon
  const getDisplayIcon = () => {
    if (showIcons) {
      if (currentStep) {
        return getStepIcon(currentStep);
      }
      if (currentMilestone) {
        return getMilestoneIcon(currentMilestone);
      }
    }
    return getStatusIcon(status);
  };

  const IconComponent = getDisplayIcon();
  const iconStyle = getIconStyle(status, currentMilestone, hasError);

  // Get display text
  const getDisplayText = () => {
    if (hasError && errorMessage) {
      return errorMessage;
    }
    if (currentMilestone) {
      return currentMilestone.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());
    }
    if (currentStep) {
      return currentStep.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase());
    }
    return status.toLowerCase().replace(/^\w/, c => c.toUpperCase());
  };

  return (
    <div className={cn("relative w-full space-y-3", className)}>
      {/* Header with time and main status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <IconComponent size={16} className={iconStyle} />
            <span className={cn(
              "text-sm font-medium",
              hasError ? "text-red-600" : 
              isCompleted ? "text-green-600" : 
              isProcessing ? "text-blue-600" : "text-gray-600"
            )}>
              {getDisplayText()}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground text-xs">
          {moment(time).format("DD/MM/YYYY, H:mm a")}
        </p>
      </div>

      {/* Progress bar (if enabled and not completed) */}
      {showProgress && !isCompleted && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress 
            value={progressPercent} 
            className={cn(
              "h-2",
              hasError ? "progress-error" : ""
            )}
          />
        </div>
      )}

      {/* Current step indicator (if step is different from milestone) */}
      {currentStep && currentMilestone && currentStep !== currentMilestone && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Step:</span>
          <div className="flex items-center gap-1">
            {React.createElement(getStepIcon(currentStep), { size: 12 })}
            <span>{currentStep.replace(/_/g, ' ').toLowerCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;