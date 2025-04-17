# Skeleton Components

This directory contains skeleton loading components for the Finance/Expense section of the dashboard.

## Purpose

These skeleton components provide a visual representation of the UI structure while data is being loaded. They improve the user experience by:

1. Reducing perceived loading time
2. Preventing layout shifts when content loads
3. Providing visual feedback that content is loading
4. Maintaining a consistent UI structure during loading states

## Available Components

- **TransactionTabSkeleton**: Skeleton for the Transaction tab, showing a placeholder for the transaction table with headers and rows
- **ExpenseTabSkeleton**: Skeleton for the Expense tab, showing a placeholder for the expense table with headers and rows
- **CalendarTabSkeleton**: Skeleton for the Calendar tab, showing a placeholder for the calendar view with days and potential events

## Usage

Import the skeleton components from this directory:

```tsx
import { 
  TransactionTabSkeleton,
  ExpenseTabSkeleton,
  CalendarTabSkeleton 
} from "@/app/(dashboard)/finance/expense/components/skeletons";
```

Use them in loading states or as Suspense fallbacks:

```tsx
{isLoading ? (
  <TransactionTabSkeleton />
) : (
  <TransactionTab data={data} />
)}
```

Or with Suspense:

```tsx
<Suspense fallback={<TransactionTabSkeleton />}>
  <TransactionTab data={data} />
</Suspense>
```

## Design Principles

1. Each skeleton mimics the structure of the actual component it represents
2. Skeletons use a consistent visual style with the rest of the application
3. Random elements (like calendar events) use randomization to appear more natural
4. Table skeletons include headers and multiple rows to represent data tables 