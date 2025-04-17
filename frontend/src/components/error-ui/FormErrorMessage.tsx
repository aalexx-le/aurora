import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

/**
 * Props for the FormErrorMessage component
 */
export interface FormErrorMessageProps {
  /**
   * The error message to display
   */
  message?: string;
  
  /**
   * Additional CSS classes to apply to the component
   */
  className?: string;
}

/**
 * A component for displaying form validation errors
 * 
 * @param props - The component props
 * @returns A form error message component
 */
export function FormErrorMessage({ message, className }: FormErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className={cn("flex items-center gap-2 text-destructive text-sm mt-1", className)}>
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}

export default FormErrorMessage; 