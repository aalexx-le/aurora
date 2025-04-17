import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the bank manager list component
 * Displays a placeholder UI while bank manager data is loading
 */
export const BankManagerListSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="rounded-md border">
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="grid grid-cols-4 p-4 border-b">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[90%]" />
          ))}
        </div>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="grid grid-cols-4 p-4 border-b">
            {Array(4).fill(0).map((_, j) => (
              <Skeleton key={j} className="h-4 w-[80%]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton loader for the bank account list component
 * Displays a placeholder UI while bank account data is loading
 */
export const BankAccountListSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-8 w-24" />
    </div>
    <div className="rounded-md border">
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="grid grid-cols-5 p-4 border-b">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[90%]" />
          ))}
        </div>
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="grid grid-cols-5 p-4 border-b">
            {Array(5).fill(0).map((_, j) => (
              <Skeleton key={j} className="h-4 w-[80%]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton loader for the bank select component
 * Displays a placeholder UI while bank selection options are loading
 */
export const BankSelectSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-6 w-24" />
    <div className="flex space-x-2">
      {Array(4).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-10 w-20 rounded-md" />
      ))}
    </div>
  </div>
);

/**
 * Skeleton loader for the entire bank page
 * Combines multiple skeleton components for a complete loading state
 */
export const BankPageSkeleton = () => (
  <div className="space-y-8">
    <BankSelectSkeleton />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <BankManagerListSkeleton />
      <BankAccountListSkeleton />
    </div>
  </div>
); 