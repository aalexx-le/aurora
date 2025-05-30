---
description: Next.js frontend development patterns and conventions
globs: frontend/src/**/*.ts*
alwaysApply: true
---

# Next.js Frontend Guidelines

- Use yarn as package manager
- Always follow guidelines in @typescript-guidelines.md
- Refer to @project_structure.md to know the current project structure and update the files according to your modifications

## Rule 1: Type Definitions and Props

**Pattern:** Define prop interfaces separately from components.

```typescript
// types/button.ts
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// components/Button.tsx
export const Button = ({ label, onClick, variant = 'primary' }: ButtonProps) => (
  <button onClick={onClick} className={`btn btn-${variant}`}>
    {label}
  </button>
);
```

**Guidelines:**
- Define interfaces in separate files or at the top of component files
- Use optional properties with default values in destructuring
- Prefer `interface` over `type` for component props
- Use union types for controlled prop values (`'primary' | 'secondary'`)
- Import types with `type` keyword: `import { type ButtonProps }`
- Group related interfaces in domain-specific type files

**❌ Avoid:** Inline prop types in component definitions.

## Rule 2: Object Props Over Multiple Parameters

**Pattern:** Pass entire objects as props instead of destructuring into multiple parameters.

```typescript
// Good: Pass entire objects
interface UserCardProps {
  user: User;
  settings: Setting[];
}

export const UserCard = ({ user, settings }: UserCardProps) => (
  <div className={`card ${settings.theme}`}>
    <img src={user.avatar} alt={user.name} />
    <h3>{user.name}</h3>
    {settings.showEmail && <p>{user.email}</p>}
  </div>
);

// Usage
<UserCard user={userData} settings={userSettings} />
```

**Guidelines:**
- Group related parameters into logical objects
- Use TypeScript interfaces to define object structures
- Pass entire domain objects when multiple properties are needed
- Prefer object props for better maintainability and refactoring
- Use destructuring within the component, not at the prop level
- Consider object props when you have 3+ related parameters
- Maintain clear object boundaries (user data, settings, actions, etc.)
- Use object spreading for partial updates: `{...user, name: newName}`

**❌ Avoid:** Destructuring objects into individual props at component boundaries.

## Rule 3: Empty Arrays Over Undefined

**Pattern:** Pass empty arrays instead of undefined for array props to avoid conditional rendering complexity.

```typescript
// Good: Use empty arrays as defaults
interface DataListProps {
  items: Item[];
  categories: Category[];
}

export const DataList = ({ items, categories  }: DataListProps) => (
  <div>
    <h3>Items ({items.length})</h3>
    {items.map(item => <ItemCard key={item.id} item={item} />)}
    
    <h3>Categories ({categories.length})</h3>
    {categories.map(cat => <CategoryTag key={cat.id} category={cat} />)}
  </div>
);

// Usage - no need for conditional checks
<DataList items={data?.items || []} categories={data?.categories || []} />
```

**Guidelines:**
- Use empty arrays `[]` as default values for array props
- Avoid making array props optional with `?` unless truly optional
- Use `|| []` when passing potentially undefined data
- Simplifies component logic by eliminating null/undefined checks
- Makes `.map()`, `.filter()`, `.length` operations safe by default
- Prefer `items.length === 0` over `!items` for empty state checks
- Use consistent empty array defaults across similar components

**❌ Avoid:** Optional array props that require conditional rendering checks.

## Rule 4: File Structure and Organization

**Pattern:** Domain-specific organization within app directory.

```typescript
src/
├── components/ui/       // Shared UI primitives
├── hooks/              // Global hooks
└── app/
    ├── auth/components/      // Domain-specific
    ├── setting/
    │   └── subscription/
    │       ├── components/
    │       └── hooks/        // Domain hooks
    └── (dashboard)/finance/  // Route groups + nested domains

// Import patterns:
import { Button } from "@/components/ui/button";        // Global
import { useAuth } from "../hooks/useAuth";             // Domain
```

**Guidelines:**
- Keep domain-specific components within their app directories
- Use route groups `(name)` for organizing related domains without affecting URLs
- Place shared UI components in `/components/ui/`
- Create domain-specific `hooks/`, `utils/`, and `types.tsx` files as needed
- Use absolute imports (`@/`) for shared components and global utilities
- Use relative imports (`../`) for same-domain components and hooks
- Follow Next.js app directory conventions for routing
- Co-locate related functionality within the same domain

**❌ Avoid:** Domain-specific components in shared folders.

## Rule 5: Container vs Presentation Components

**Pattern:** Separate logic (container) from UI (presentation).

```typescript
// Container (handles logic)
export default function ExpenseForm() {
  const { submitExpense, loading } = useExpenseSubmit();
  const handleSubmit = async (data) => { /* logic */ };
  
  return <ExpenseFormPresentation onSubmit={handleSubmit} loading={loading} />;
}

// Presentation (handles UI)
export const ExpenseFormPresentation = ({ onSubmit, loading }) => (
  <form onSubmit={onSubmit}>
    <Button disabled={loading}>Submit</Button>
  </form>
);
```

**Guidelines:**
- **Container components:** Handle state, API calls, business logic, and event handlers
- **Presentation components:** Focus only on rendering UI based on props
- Pass down callbacks and computed values from container to presentation
- Keep presentation components pure and testable
- Use custom hooks to extract complex logic from containers
- Name presentation components with `Presentation` suffix or separate files
- Avoid direct API calls in presentation components
- Make presentation components reusable across different containers

## Rule 6: GraphQL Integration

**Pattern:** Domain-specific GraphQL operations in API folders.

```typescript
// api/auth/auth.ts
import gql from "@/gql";

export const LOGIN_MUTATION = gql`
  mutation Login($data: LoginReqDto!) {
    login(data: $data) {
      accessToken
      refreshToken
    }
  }
`;
// api/user/user.ts
export const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

// domain/hooks/useUserQuery.ts
import { GET_USER } from "@/api/user/user";

export const useUserQuery = (userId: string) => {
  return useQuery<GetUserQuery, GetUserQueryVariables>(GET_USER, {
    variables: { id: userId },
  });
};
```

**Guidelines:**
- Organize GraphQL operations in domain-specific folders under `/api/` (auth, user, bank, etc.)
- Export operations from TypeScript files using `gql` template literals
- Use descriptive query/mutation names that match the operation purpose
- Group related operations in the same domain file (e.g., all auth operations in `api/auth/auth.ts`)
- Import operations using absolute paths: `import { GET_USER } from "@/api/user/user"`
- Follow consistent naming: `GET_USER`, `CREATE_USER`, `UPDATE_USER`
- Export custom hooks alongside operations for domain-specific logic
- Use fragments for reusable field selections across operations
- CodeGen automatically scans all `.ts` files in `/api/` for GraphQL operations

**❌ Avoid:** Separating GraphQL documents into `.gql` files - keep everything in TypeScript for better IDE support.

## Rule 7: Apollo Client Type Safety

**Pattern:** Always use generated types with Apollo hooks.

```typescript
import type { GetUserQuery, GetUserQueryVariables } from '@/gql/graphql';

export const useUserQuery = (userId: string) =>
  useQuery<GetUserQuery, GetUserQueryVariables>(GET_USER, {
    variables: { id: userId }
  });
```

**Guidelines:**
- Always provide type parameters to Apollo hooks: `useQuery<QueryType, VariablesType>`
- Import generated types from `@/gql/graphql`
- Run `npx graphql-codegen --watch` during development
- Use proper error handling with Apollo's error types
- Implement loading states with proper TypeScript types
- Configure `fetchPolicy` based on data freshness needs
- Use `useSuspenseQuery` for automatic loading states
- Handle optional variables with proper TypeScript checks

**Setup:** Run `npx graphql-codegen --watch` to generate types.

## Rule 8: Extract Query Entities to Types Files

**Pattern:** Extract necessary entity types from GraphQL queries into domain-specific types files.

```typescript
// types.tsx in domain folder
import { GetMembershipPlansQuery, GetMyMembershipSubscriptionsQuery } from "@/gql/graphql";

export type MembershipPlan = GetMembershipPlansQuery['getMembershipPlans'][number];
export type MembershipSubscription = GetMyMembershipSubscriptionsQuery['myMembershipSubscriptions'][number];
export type PaymentTransaction = MembershipSubscription['paymentTransactions'][number];

// Usage in components
import { type MembershipPlan, type MembershipSubscription } from "./types";

interface PlanCardProps {
  plan: MembershipPlan;
  subscription?: MembershipSubscription;
}
```

**Guidelines:**
- Create `types.tsx` files in domain folders
- Extract entity types using array indexing: `QueryType['fieldName'][number]`
- Extract nested entity types from parent entities when needed
- Use descriptive names that match the domain context
- Import with `type` keyword for better tree-shaking
- Co-locate types with their related components and hooks
- Prefer domain-specific type names over generic GraphQL names
- Re-export commonly used types for easier imports

**❌ Avoid:** Using complex GraphQL query types directly in component props.

## Rule 9: useSuspenseQuery with Suspense

**Pattern:** Proper Suspense boundaries with optimized fetch policies.

```typescript
// Page wrapper
export default function DataPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <DataFetcher />
    </Suspense>
  );
}

// Data fetcher
const DataFetcher = () => {
  const { data } = useSuspenseQuery<QueryType>(QUERY, {
    fetchPolicy: 'cache-and-network',  // Prevents flickering
  });
  
  const processedData = useMemo(() => processData(data), [data]);
  return <DataDisplay data={processedData} />;
};
```

**Guidelines:**
- Use `cache-and-network` to show cached data while refreshing
- Place Suspense boundaries at appropriate component levels
- Process data with `useMemo` to prevent re-renders
- Create skeleton components that match the loaded content layout
- Don't place Suspense too high (causes large loading areas) or too low (multiple spinners)
- Use `skip` parameter to conditionally prevent queries
- Handle errors with Error Boundaries alongside Suspense
- Consider using `startTransition` for non-urgent updates

## Rule 10: Server vs Client Components

**Pattern:** Server Components by default, explicit client components.

```typescript
// Server Component (default)
export const Stats = async () => {
  const data = await fetchData();
  return (
    <Suspense fallback={<Loading />}>
      <ClientChart initialData={data} />
    </Suspense>
  );
};

// Client Component (explicit)
'use client';
export const ClientChart = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  // Client-side logic
};
```

**Guidelines:**
- Default to Server Components for better performance
- Use `'use client'` only when needed (interactivity, hooks, browser APIs)
- Pass initial data from server to client components
- Keep the client boundary as low as possible in the component tree
- Use Server Components for data fetching when possible
- Wrap client components with Suspense for loading states
- Avoid making entire pages client-side unless necessary
- Consider RSC for SEO-critical content

## Rule 11: Form Handling

**Pattern:** React Hook Form + Zod with separated schemas.

```typescript
// lib/schemas/user.ts
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// components/UserForm.tsx
export const UserForm = () => {
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { email: '', password: '' },
  });
};
```

**Guidelines:**
- Define Zod schemas in `/lib/schemas/` directory
- Use `zodResolver` for form validation
- Create reusable form components with consistent APIs
- Handle form submission errors with proper user feedback
- Use `FormProvider` for nested form components
- Implement proper loading states during submission
- Reset forms after successful submission
- Use controlled components for complex form logic
- Validate on blur for better UX

## Rule 12: State Management

**Pattern:** Different tools for different state types.

```typescript
// Global state: Redux Toolkit
const authSlice = createSlice({
  name: "auth",
  reducers: {
    login: (state, action) => { state.user = action.payload; },
  },
});

// Server state: Apollo Client
const { data } = useQuery(GET_DATA, { fetchPolicy: 'cache-and-network' });

// Local state: React hooks
const [open, setOpen] = useState(false);
```

**Guidelines:**
- **Global state:** Use Redux Toolkit for app-wide state (auth, theme, settings)
- **Server state:** Use Apollo Client for all server data with proper caching
- **Local state:** Use React hooks for component-specific UI state
- **URL state:** Use Next.js router for shareable application state
- Avoid putting server data in Redux (leads to cache duplication)
- Use typed Redux hooks: `useAppSelector`, `useAppDispatch`
- Implement proper Redux state normalization for complex data
- Consider `useReducer` for complex local state logic

## Rule 13: Error Handling

**Pattern:** Error boundaries for component errors.

```typescript
export class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<ErrorPage />}>
  <Component />
</ErrorBoundary>
```

**Guidelines:**
- Implement Error Boundaries for component error catching
- Use Apollo's error handling for GraphQL errors
- Create user-friendly error messages, not technical details
- Log errors to monitoring services (Sentry, etc.)
- Provide fallback UI that doesn't break the entire page
- Handle network errors gracefully with retry mechanisms
- Use proper TypeScript error types for type safety
- Implement global error handlers for unhandled promises

## Rule 14: Testing

**Pattern:** Component testing with React Testing Library.

```typescript
describe('Button', () => {
  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button label="Click" onClick={onClick} />);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

**Guidelines:**
- Test user interactions, not implementation details
- Use `data-testid` for elements hard to query by text/role
- Mock external dependencies (APIs, modules) properly
- Test error states and edge cases
- Use `@testing-library/user-event` for realistic user interactions
- Write integration tests for complex user flows
- Test accessibility with proper ARIA queries
- Mock Apollo Client with `MockedProvider` for GraphQL tests
- Keep tests focused on single responsibilities 