import { Spinner } from "@/components/ui/spinning";

/**
 * A shared loading component that displays a centered spinner
 * 
 * @returns React component
 */
export function LoadingSpinner(): JSX.Element {
  return (
    <div className="flex flex-1 justify-center items-center">
      <Spinner className="text-secondary"/>
    </div>
  );
} 