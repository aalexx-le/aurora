import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton loader for the event calendar component
 * Displays a placeholder UI while calendar data is loading
 */
export const EventCalendarSkeleton = () => (
  <div className="col-span-5 space-y-4">
    <div className="flex justify-between items-center mb-4">
      <Skeleton className="h-10 w-48" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-7 gap-1">
      {/* Calendar header - days of week */}
      {Array(7).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
      {/* Calendar days - using a fixed pattern instead of random */}
      {Array(35).fill(0).map((_, i) => {
        // Use a deterministic pattern based on the index
        // This ensures server and client render the same content
        const eventCount = (i % 4 === 0) ? 2 : (i % 3 === 0) ? 1 : 0;
        
        return (
          <div key={i} className="border rounded-md p-2 h-32">
            <Skeleton className="h-5 w-5 mb-2" />
            {/* Fixed number of events per day based on position */}
            {Array(eventCount).fill(0).map((_, j) => (
              <div key={j} className="mb-1">
                <Skeleton className="h-6 w-full rounded-sm" />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  </div>
);

/**
 * Skeleton loader for the event category list component
 * Displays a placeholder UI while event categories are loading
 */
export const EventCategoryListSkeleton = () => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-9 w-9 rounded-md" />
    </div>
    
    {/* Category items */}
    {Array(5).fill(0).map((_, i) => (
      <div className="grid gap-2" key={i}>
        <div className="flex gap-4 items-center justify-between rounded-lg">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton loader for the event detail component
 * Displays a placeholder UI while event details are loading
 */
export const EventDetailSkeleton = () => (
  <div className="rounded-md border p-4 space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
    <Skeleton className="h-24 w-full" />
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

/**
 * Skeleton loader for the event form component
 * Displays a placeholder UI while event form is loading
 */
export const EventFormSkeleton = () => (
  <div className="space-y-4 p-4 border rounded-md">
    <Skeleton className="h-8 w-48" />
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
    <div className="flex justify-end space-x-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-24" />
    </div>
  </div>
);

/**
 * Skeleton loader for the entire schedule page
 * Combines multiple skeleton components for a complete loading state
 */
export const SchedulePageSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <EventCategoryListSkeleton />
      </div>
      <div className="lg:col-span-3">
        <EventCalendarSkeleton />
      </div>
    </div>
  </div>
); 