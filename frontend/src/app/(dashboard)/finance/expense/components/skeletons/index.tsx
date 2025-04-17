import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the transaction tab
 * Displays a placeholder UI while transaction data is loading
 */
export const TransactionTabSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="rounded-md border">
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="grid grid-cols-6 p-4 border-b">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-4 w-[90%]" />
          ))}
        </div>
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="grid grid-cols-6 p-4 border-b">
            {Array(6).fill(0).map((_, j) => (
              <Skeleton key={j} className="h-4 w-[80%]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Skeleton loader for the expense tab
 * Displays a placeholder UI while expense data is loading
 */
export const ExpenseTabSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="rounded-md border">
      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-1/4" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-24" />
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
        {Array(5).fill(0).map((_, i) => (
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
 * Skeleton loader for the calendar tab
 * Displays a placeholder UI while calendar data is loading
 */
export const CalendarTabSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="h-10 w-48" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-7 gap-1">
      {/* Calendar header */}
      {Array(7).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
      {/* Calendar days */}
      {Array(35).fill(0).map((_, i) => (
        <div key={i} className="border rounded-md p-2 h-24">
          <Skeleton className="h-5 w-5 mb-2" />
          {Math.random() > 0.6 && (
            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
); 