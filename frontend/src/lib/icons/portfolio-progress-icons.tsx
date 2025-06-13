import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Clock,
    Database,
    FileText,
    HelpCircle,
    Key,
    Loader2,
    Phone,
    RefreshCw,
    RotateCcw,
    Settings,
    Shield,
    Timer,
    UserCheck,
    Wifi,
    XCircle,
    type LucideIcon,
} from "lucide-react";

// Portfolio Creation Steps Icons
export const PortfolioCreationStepIcons: Record<string, LucideIcon> = {
  VALIDATION: Shield,
  AUTHENTICATION: Key,
  CONNECTION: Wifi,
  ACCOUNT_INFO: UserCheck,
  BALANCE_FETCH: Database,
  DATA_PROCESSING: Settings,
  DATABASE_STORAGE: FileText,
  FINALIZATION: CheckCircle,
};

// Portfolio Creation Milestone Icons
export const PortfolioCreationMilestoneIcons: Record<string, LucideIcon> = {
  // Success milestones
  INITIALIZED: Clock,
  CREDENTIALS_VERIFIED: Key,
  EXCHANGE_CONNECTED: Wifi,
  ACCOUNT_FETCHED: UserCheck,
  BALANCES_FETCHED: Database,
  PORTFOLIO_STORED: FileText,
  COMPLETED: CheckCircle,
  
  // Error milestones
  VALIDATION_FAILED: XCircle,
  CREDENTIALS_FAILED: AlertCircle,
  CONNECTION_FAILED: AlertTriangle,
  FETCH_FAILED: XCircle,
  STORAGE_FAILED: AlertCircle,
  TIMEOUT_FAILED: Timer,
  RATE_LIMITED: Clock,
  INSUFFICIENT_PERMISSIONS: Shield,
  FAILED: XCircle,
};

// Error Recovery Action Icons
export const ErrorRecoveryActionIcons: Record<string, LucideIcon> = {
  RETRY_AUTOMATIC: RotateCcw,
  RETRY_MANUAL: RefreshCw,
  UPDATE_CREDENTIALS: Key,
  WAIT_RATE_LIMIT: Timer,
  CHECK_PERMISSIONS: Shield,
  CONTACT_SUPPORT: Phone,
  ABORT: XCircle,
};

// Legacy Status Icons (for current implementation)
export const CreateExecutionStatusIcons: Record<string, LucideIcon> = {
  QUEUE: Clock,
  PROCESSING: Loader2,
  SUCCESS: CheckCircle,
  FAILED: XCircle,
};

// Helper function to get step icon
export const getStepIcon = (step: string | null): LucideIcon => {
  if (!step) return HelpCircle;
  return PortfolioCreationStepIcons[step] || HelpCircle;
};

// Helper function to get milestone icon
export const getMilestoneIcon = (milestone: string | null): LucideIcon => {
  if (!milestone) return Clock;
  return PortfolioCreationMilestoneIcons[milestone] || Clock;
};

// Helper function to get recovery action icon
export const getRecoveryActionIcon = (action: string | null): LucideIcon => {
  if (!action) return HelpCircle;
  return ErrorRecoveryActionIcons[action] || HelpCircle;
};

// Helper function to get status icon (current implementation)
export const getStatusIcon = (status: string): LucideIcon => {
  return CreateExecutionStatusIcons[status] || Clock;
};

// Icon styling variants
export const IconStyles = {
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
  processing: "text-blue-500 animate-spin",
  pending: "text-gray-500",
} as const;

// Helper function to get icon style based on state
export const getIconStyle = (
  status?: string,
  milestone?: string | null,
  hasError?: boolean
): string => {
  if (hasError || status === "FAILED") return IconStyles.error;
  if (status === "SUCCESS" || milestone === "COMPLETED") return IconStyles.success;
  if (status === "PROCESSING") return IconStyles.processing;
  if (milestone?.includes("_FAILED")) return IconStyles.error;
  if (milestone === "RATE_LIMITED") return IconStyles.warning;
  return IconStyles.pending;
};

// Type definitions for better TypeScript support
export type PortfolioProgressIconProps = {
  size?: number;
  className?: string;
  style?: keyof typeof IconStyles;
};

// Wrapper component for consistent icon rendering
export const PortfolioProgressIcon = ({
  icon: Icon,
  size = 16,
  className = "",
  style = "pending",
}: PortfolioProgressIconProps & { icon: LucideIcon }) => (
  <Icon size={size} className={`${IconStyles[style]} ${className}`} />
); 