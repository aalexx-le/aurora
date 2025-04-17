# Schedule Skeleton Components

This directory contains skeleton loading components for the Schedule section of the dashboard.

## Purpose

These skeleton components provide a visual representation of the UI structure while data is being loaded. They improve the user experience by:

1. Reducing perceived loading time
2. Preventing layout shifts when content loads
3. Providing visual feedback that content is loading
4. Maintaining a consistent UI structure during loading states

## Available Components

- **EventCalendarSkeleton**: Skeleton for the event calendar, showing a placeholder for the calendar grid with days and potential events
- **EventCategoryListSkeleton**: Skeleton for the event category list, showing a placeholder for the category table
- **EventDetailSkeleton**: Skeleton for the event detail view, showing placeholders for event information
- **EventFormSkeleton**: Skeleton for the event creation/editing form
- **SchedulePageSkeleton**: Composite skeleton that combines all schedule-related skeletons for a complete page loading state

## Usage

Import the skeleton components from this directory:

```tsx
import { 
  EventCalendarSkeleton,
  EventCategoryListSkeleton,
  EventDetailSkeleton,
  EventFormSkeleton,
  SchedulePageSkeleton
} from "@/app/(dashboard)/schedule/components/skeletons";
```

Use them in loading states or as Suspense fallbacks:

```tsx
{isLoading ? (
  <EventCalendarSkeleton />
) : (
  <EventCalendar events={events} />
)}
```

Or with Suspense:

```tsx
<Suspense fallback={<SchedulePageSkeleton />}>
  <SchedulePage />
</Suspense>
```

## Design Principles

1. Each skeleton mimics the structure of the actual component it represents
2. The calendar skeleton uses a grid layout matching the actual calendar
3. Random elements (like events per day) use randomization to appear more natural
4. Form skeletons include placeholders for all input fields and buttons
5. The page skeleton maintains the overall layout structure of the schedule page with proper responsive behavior 