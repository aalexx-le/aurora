import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

/**
 * Props for the EmptyState component
 */
export interface EmptyStateProps {
  /**
   * The title to display
   */
  title: string;
  
  /**
   * The description to display
   */
  description?: string;
  
  /**
   * The icon to display
   */
  icon?: LucideIcon;
  
  /**
   * The action button text
   */
  actionText?: string;
  
  /**
   * The action button handler
   */
  onAction?: () => void;
  
  /**
   * Additional CSS classes to apply to the component
   */
  className?: string;
  
  /**
   * Whether this is an error state
   */
  isError?: boolean;
}

/**
 * A component for displaying empty states with optional error handling
 * 
 * @param props - The component props
 * @returns An empty state component
 */
export function EmptyState({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
  className,
  isError = false,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 rounded-lg border",
      isError ? "border-destructive/20 bg-destructive/5" : "border-border/30 bg-muted/20",
      className
    )}>
      {Icon && (
        <div className={cn(
          "rounded-full p-3 mb-4",
          isError ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        )}>
          <Icon className="h-6 w-6" />
        </div>
      )}
      
      <h3 className={cn(
        "text-lg font-medium",
        isError ? "text-destructive" : "text-foreground"
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          "mt-2 text-sm",
          isError ? "text-destructive/80" : "text-muted-foreground"
        )}>
          {description}
        </p>
      )}
      
      {actionText && onAction && (
        <Button
          onClick={onAction}
          className="mt-4"
          variant={isError ? "destructive" : "default"}
          size="sm"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState; 