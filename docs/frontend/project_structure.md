# Frontend Project Structure

This document outlines the structure of the frontend project built with Next.js.

## Root Structure

```
frontend/
├── .next/                  # Next.js build output
├── node_modules/           # Dependencies
├── public/                 # Static assets
├── src/                    # Source code
├── .env                    # Environment variables
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier configuration
├── codegen.ts              # GraphQL code generation config
├── components.json         # UI components configuration
├── Dockerfile              # Docker configuration
├── next-env.d.ts           # Next.js TypeScript declarations
├── next.config.mjs         # Next.js configuration
├── package.json            # Project dependencies and scripts
├── postcss.config.mjs      # PostCSS configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── yarn.lock               # Yarn lock file
```

## Source Code Structure

```
src/
├── api/                    # API related code
│   ├── auth/               # Authentication GraphQL operations
│   ├── bank/               # Bank-related GraphQL operations
│   ├── crypto/             # Crypto/investment GraphQL operations
│   ├── expense/            # Expense GraphQL operations
│   ├── membership/         # Membership GraphQL operations
│   ├── payment/            # Payment GraphQL operations
│   ├── schedule/           # Schedule/event GraphQL operations
│   └── index.ts            # Apollo Client configuration
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/        # Dashboard routes (grouped)
│   ├── api/                # API routes
│   ├── auth/               # Authentication routes
│   ├── fonts/              # Font definitions
│   ├── home/               # Home page
│   ├── setting/            # Settings pages
│   ├── AuthGuard.tsx       # Authentication guard component
│   ├── error.tsx           # Error handling component
│   ├── global-error.tsx    # Global error handling
│   ├── globals.css         # Global CSS
│   ├── layout.tsx          # Root layout
│   └── not-found.tsx       # 404 page
├── components/             # UI components
│   ├── bank/               # Bank-related components
│   ├── data-table/         # Data table components
│   ├── error-boundary/     # Error boundary components
│   ├── error-ui/           # Error UI components
│   ├── list/               # List components
│   ├── money/              # Money-related components
│   ├── providers/          # Component providers
│   ├── sidebar/            # Sidebar components
│   ├── timeline/           # Timeline components
│   ├── ui/                 # Reusable UI components
│   └── create-or-update-dialog.tsx # Dialog component
├── gql/                    # GraphQL related code
│   ├── fragment-masking.ts # Fragment masking utilities
│   ├── gql.ts              # GraphQL tag
│   ├── graphql.ts          # Generated GraphQL types
│   └── index.ts            # GraphQL exports
├── hooks/                  # Custom React hooks
│   ├── use-auto-scroll.ts  # Auto-scroll hook
│   ├── use-autosize-textarea.ts # Autosize textarea hook
│   ├── use-copy-to-clipboard.ts # Copy to clipboard hook
│   ├── use-mobile.tsx      # Mobile detection hook
│   ├── use-toast.ts        # Toast notification hook
│   ├── useError.ts         # Error handling hook
│   └── useErrorHandler.ts  # Error handler hook
├── lib/                    # Utility libraries
│   ├── apollo/             # Apollo client configuration
│   ├── constants/          # Constant definitions
│   ├── context/            # React context definitions
│   ├── error/              # Error handling utilities
│   ├── hooks/              # Library-specific hooks
│   ├── routes/             # Route definitions
│   ├── schema/             # Schema definitions
│   ├── utils/              # Utility functions
│   └── utils.ts            # General utilities
├── providers/              # Application providers
│   └── ErrorProvider.tsx   # Error provider
├── state/                  # State management
│   ├── slices/             # Redux slices
│   ├── hooks.ts            # State hooks
│   └── store.ts            # Redux store
└── types/                  # TypeScript type definitions
```

## Key Technologies

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: 
  - Radix UI
  - Shadcn UI (customized components based on Radix)
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form with Zod validation
- **Data Fetching**: Apollo Client for GraphQL
- **Charts**: ApexCharts, Recharts, Lightweight Charts
- **Date Handling**: date-fns, luxon, moment
- **Other Notable Libraries**:
  - Framer Motion (animations)
  - DND Kit (drag and drop)
  - FullCalendar (calendar component)
  - Sonner (toasts)

## Directory Patterns and Responsibilities

1. **app/**: Contains all Next.js App Router pages and layouts, organized by route.
   
2. **components/**: Reusable UI components organized by functionality.
   - Components that are used across multiple pages should be placed here
   - Domain-specific components are grouped in their own directories

3. **api/**: GraphQL API integration code.
   - Domain-specific GraphQL operations organized by feature area (auth, bank, crypto, etc.)
   - Each domain folder contains TypeScript files with `gql` template literals
   - Apollo Client configuration and authentication handling

4. **gql/**: Generated GraphQL types and utilities.
   - Contains auto-generated code from GraphQL schema

5. **hooks/**: Custom React hooks.
   - Encapsulates reusable stateful logic

6. **lib/**: Shared utilities and constants.
   - Contains helper functions, constants, and configuration

7. **providers/**: Context providers.
   - Manages global state through React Context API

8. **state/**: Redux state management.
   - Organized using Redux Toolkit's slice pattern

9. **types/**: TypeScript type definitions.
   - Contains shared types and interfaces 