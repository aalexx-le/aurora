# Bank Skeleton Components

This directory contains skeleton loading components for the Finance/Bank section of the dashboard.

## Purpose

These skeleton components provide a visual representation of the UI structure while data is being loaded. They improve the user experience by:

1. Reducing perceived loading time
2. Preventing layout shifts when content loads
3. Providing visual feedback that content is loading
4. Maintaining a consistent UI structure during loading states

## Available Components

- **BankManagerListSkeleton**: Skeleton for the bank manager list, showing a placeholder for the manager table with headers and rows
- **BankAccountListSkeleton**: Skeleton for the bank account list, showing a placeholder for the account table with headers and rows
- **BankSelectSkeleton**: Skeleton for the bank selection component, showing placeholder buttons for bank options
- **BankPageSkeleton**: Composite skeleton that combines all bank-related skeletons for a complete page loading state

## Usage

Import the skeleton components from this directory:

```tsx
import { 
  BankManagerListSkeleton,
  BankAccountListSkeleton,
  BankSelectSkeleton,
  BankPageSkeleton
} from "@/app/(dashboard)/finance/bank/components/skeletons";
```

Use them in loading states or as Suspense fallbacks:

```tsx
{isLoading ? (
  <BankManagerListSkeleton />
) : (
  <BankManagerList data={data} />
)}
```

Or with Suspense:

```tsx
<Suspense fallback={<BankPageSkeleton />}>
  <BankPage />
</Suspense>
```

## Design Principles

1. Each skeleton mimics the structure of the actual component it represents
2. Skeletons use a consistent visual style with the rest of the application
3. Table skeletons include headers and multiple rows to represent data tables
4. The page skeleton maintains the overall layout structure of the bank page 