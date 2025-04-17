import { Skeleton } from "@/components/ui/skeleton";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy loaded component to improve performance
const LazyExpenseCalendar = lazy(() => import("@/app/(dashboard)/finance/expense/components/expense-calendar/expense-calendar"));

// Full screen skeleton component for calendar
const CalendarSkeleton = () => (
  <Skeleton className="h-[calc(100vh-10rem)] w-full rounded-md" />
);

function ExpenseCalendarTab() {

  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <LazyExpenseCalendar />
    </Suspense>
  );
}

// Export the component
export default ExpenseCalendarTab; 