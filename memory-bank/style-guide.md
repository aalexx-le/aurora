# STYLE GUIDE - XELA Finance Management System

## 🎨 OVERVIEW

This style guide establishes comprehensive development standards, coding conventions, and best practices for the Xela Finance Management System. All contributors must follow these guidelines to ensure code consistency, maintainability, and quality across the entire project.

The project uses a modern stack with **Next.js frontend** and **NestJS backend**, integrated through **GraphQL** and **Apollo Client**.

## 💻 FRONTEND STANDARDS (Next.js)

### Package Management & Dependencies
- Use **yarn** as package manager
- Follow TypeScript guidelines strictly
- Reference project structure documentation for consistency

### Type Definitions and Props

**Pattern:** Define prop interfaces separately from components.

```typescript
// types/portfolio.ts
interface PortfolioCardProps {
  portfolio: Portfolio;
  settings: UserSettings;
  onSelect?: (id: string) => void;
}

// components/PortfolioCard.tsx
export const PortfolioCard = ({ 
  portfolio, 
  settings, 
  onSelect 
}: PortfolioCardProps) => (
  <div className={`card ${settings.theme}`}>
    <h3>{portfolio.name}</h3>
    <p>{formatCurrency(portfolio.totalValue)}</p>
  </div>
);
```

**Guidelines:**
- Define interfaces in separate files or at the top of component files
- Use optional properties with default values in destructuring
- Prefer `interface` over `type` for component props
- Use union types for controlled prop values (`'primary' | 'secondary'`)
- Import types with `type` keyword: `import { type PortfolioCardProps }`
- Group related interfaces in domain-specific type files

### Object Props Over Multiple Parameters

**Pattern:** Pass entire objects as props instead of destructuring into multiple parameters.

```typescript
// ✅ Good: Pass entire objects
interface UserDashboardProps {
  user: User;
  portfolio: Portfolio;
  settings: UserSettings;
  preferences: UserPreferences;
}

export const UserDashboard = ({ user, portfolio, settings, preferences }: UserDashboardProps) => (
  <div className={`dashboard ${settings.theme}`}>
    <UserProfile user={user} />
    <PortfolioSummary portfolio={portfolio} preferences={preferences} />
  </div>
);

// ❌ Avoid: Multiple individual props
interface BadUserDashboardProps {
  userName: string;
  userEmail: string;
  portfolioName: string;
  portfolioValue: number;
  theme: string;
  currency: string;
}
```

**Guidelines:**
- Group related parameters into logical objects
- Use TypeScript interfaces to define object structures
- Pass entire domain objects when multiple properties are needed
- Maintain clear object boundaries (user data, settings, actions, etc.)
- Use object spreading for partial updates: `{...user, name: newName}`

### Empty Arrays Over Undefined

**Pattern:** Pass empty arrays instead of undefined for array props.

```typescript
// ✅ Good: Use empty arrays as defaults
interface AssetListProps {
  assets: Asset[];
  transactions: Transaction[];
}

export const AssetList = ({ assets, transactions }: AssetListProps) => (
  <div>
    <h3>Assets ({assets.length})</h3>
    {assets.map(asset => <AssetCard key={asset.id} asset={asset} />)}
    
    <h3>Recent Transactions ({transactions.length})</h3>
    {transactions.map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
  </div>
);

// Usage - no need for conditional checks
<AssetList assets={data?.assets || []} transactions={data?.transactions || []} />
```

### File Structure and Organization

**Pattern:** Domain-specific organization within app directory.

```typescript
src/
├── components/ui/              // Shared UI primitives
├── hooks/                     // Global hooks
├── lib/schemas/              // Zod validation schemas
└── app/
    ├── auth/components/              // Domain-specific
    │   ├── finance/
    │   │   ├── components/
    │   │   ├── hooks/               // Domain hooks
    │   │   └── types.tsx           // Domain types
    │   └── investment/
    │       ├── components/
    │       └── hooks/
    └── (membership)/
        ├── plan/components/
        └── payment/components/

// Import patterns:
import { Button } from "@/components/ui/button";        // Global
import { usePortfolio } from "../hooks/usePortfolio";   // Domain
```

### Container vs Presentation Components

**Pattern:** Separate logic (container) from UI (presentation).

```typescript
// Container (handles logic)
export default function PortfolioManager() {
  const { portfolio, loading, updatePortfolio } = usePortfolio();
  const { user } = useAuth();
  
  const handlePortfolioUpdate = async (data: UpdatePortfolioInput) => {
    await updatePortfolio(data);
  };
  
  return (
    <PortfolioManagerPresentation 
      portfolio={portfolio}
      user={user}
      loading={loading}
      onUpdate={handlePortfolioUpdate}
    />
  );
}

// Presentation (handles UI)
export const PortfolioManagerPresentation = ({ 
  portfolio, 
  user, 
  loading, 
  onUpdate 
}: PortfolioManagerPresentationProps) => (
  <div className="portfolio-manager">
    <PortfolioHeader portfolio={portfolio} user={user} />
    <PortfolioForm onSubmit={onUpdate} loading={loading} />
  </div>
);
```

### GraphQL Integration

**Pattern:** Domain-specific GraphQL operations in API folders.

```typescript
// api/portfolio/portfolio.ts
import { graphql } from "@/gql";

export const GET_PORTFOLIO = graphql(`
  query GetPortfolio($id: ID!) {
    portfolio(id: $id) {
      id
      name
      totalValue
      assets {
        id
        symbol
        quantity
        currentPrice
      }
    }
  }
`);

export const UPDATE_PORTFOLIO = graphql(`
  mutation UpdatePortfolio($data: UpdatePortfolioArgs!) {
    updatePortfolio(data: $data) {
      id
      name
      totalValue
    }
  }
`);

// hooks/usePortfolio.ts
import { useQuery, useMutation } from '@apollo/client';
import type { GetPortfolioQuery, UpdatePortfolioMutation } from '@/gql/graphql';

export const usePortfolio = (portfolioId: string) => {
  const { data, loading, error } = useQuery<GetPortfolioQuery>(GET_PORTFOLIO, {
    variables: { id: portfolioId },
    fetchPolicy: 'cache-and-network',
  });

  const [updatePortfolioMutation] = useMutation<UpdatePortfolioMutation>(UPDATE_PORTFOLIO);

  return {
    portfolio: data?.portfolio,
    loading,
    error,
    updatePortfolio: updatePortfolioMutation,
  };
};
```

### Type Safety with Apollo Client

**Pattern:** Always use generated types with Apollo hooks.

```typescript
import type { 
  GetPortfolioQuery, 
  GetPortfolioQueryVariables,
  UpdatePortfolioMutation,
  UpdatePortfolioMutationVariables
} from '@/gql/graphql';

export const usePortfolio = (portfolioId: string) => {
  const { data, loading } = useQuery<GetPortfolioQuery, GetPortfolioQueryVariables>(
    GET_PORTFOLIO, 
    { variables: { id: portfolioId } }
  );

  const [updatePortfolio] = useMutation<UpdatePortfolioMutation, UpdatePortfolioMutationVariables>(
    UPDATE_PORTFOLIO
  );

  return { portfolio: data?.portfolio, loading, updatePortfolio };
};
```

### Extract Query Entities to Types Files

**Pattern:** Extract necessary entity types from GraphQL queries into domain-specific types files.

```typescript
// types.tsx in domain folder
import { 
  GetPortfolioQuery, 
  GetUserPortfoliosQuery,
  GetAssetPricesQuery 
} from "@/gql/graphql";

export type Portfolio = GetPortfolioQuery['portfolio'];
export type PortfolioAsset = Portfolio['assets'][number];
export type AssetPrice = GetAssetPricesQuery['assetPrices'][number];

// Usage in components
import { type Portfolio, type PortfolioAsset } from "./types";

interface PortfolioCardProps {
  portfolio: Portfolio;
  selectedAsset?: PortfolioAsset;
}
```

### Form Handling

**Pattern:** React Hook Form + Zod with separated schemas.

```typescript
// lib/schemas/portfolio.ts
export const createPortfolioSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
  baseCurrency: z.string().length(3, 'Invalid currency code').default('USD'),
});

// components/PortfolioForm.tsx
export const PortfolioForm = ({ onSubmit }: PortfolioFormProps) => {
  const form = useForm({
    resolver: zodResolver(createPortfolioSchema),
    defaultValues: { 
      name: '', 
      description: '', 
      baseCurrency: 'USD' 
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      <textarea {...form.register('description')} />
      <Button type="submit" loading={form.formState.isSubmitting}>
        Create Portfolio
      </Button>
    </form>
  );
};
```

### State Management

**Pattern:** Different tools for different state types.

```typescript
// Global state: Redux Toolkit
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    login: (state, action) => { 
      state.user = action.payload; 
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

// Server state: Apollo Client
const { data, loading } = useQuery(GET_PORTFOLIOS, { 
  fetchPolicy: 'cache-and-network' 
});

// Local state: React hooks
const [selectedPortfolio, setSelectedPortfolio] = useState<string | null>(null);
const [isModalOpen, setIsModalOpen] = useState(false);
```

### Error Handling

**Pattern:** Error boundaries for component errors.

```typescript
export class PortfolioErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  
  static getDerivedStateFromError() { 
    return { hasError: true }; 
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portfolio error:', error, errorInfo);
    // Log to monitoring service
  }
  
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

// Usage
<PortfolioErrorBoundary fallback={<PortfolioErrorPage />}>
  <PortfolioManager />
</PortfolioErrorBoundary>
```

### Testing Standards

**Pattern:** Component testing with React Testing Library.

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { PortfolioCard } from './PortfolioCard';

describe('PortfolioCard', () => {
  const mockPortfolio = {
    id: '1',
    name: 'My Portfolio',
    totalValue: 10000,
    assets: [],
  };

  it('displays portfolio information correctly', () => {
    render(
      <MockedProvider mocks={[]}>
        <PortfolioCard portfolio={mockPortfolio} />
      </MockedProvider>
    );
    
    expect(screen.getByText('My Portfolio')).toBeInTheDocument();
    expect(screen.getByText('$10,000')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = jest.fn();
    render(
      <MockedProvider mocks={[]}>
        <PortfolioCard portfolio={mockPortfolio} onSelect={onSelect} />
      </MockedProvider>
    );
    
    fireEvent.click(screen.getByText('My Portfolio'));
    expect(onSelect).toHaveBeenCalledWith('1');
  });
});
```

## 🔧 BACKEND STANDARDS (NestJS)

### Package Management & Dependencies
- Use **yarn** as package manager
- Follow TypeScript guidelines strictly
- Reference project structure documentation for consistency

### GraphQL Query and Mutation Naming

**Pattern:** Each GraphQL query or mutation should have an explicit name that clearly describes its purpose.

```typescript
// ✅ Good: Explicit descriptive names
@Query(() => Portfolio, { name: 'getPortfolio' })
async portfolio(@Args('id') id: string): Promise<Portfolio> {
  return this.portfolioService.findById(id);
}

@Mutation(() => Portfolio, { name: 'createPortfolio' })
async createPortfolio(@Args() args: CreatePortfolioArgs): Promise<Portfolio> {
  return this.portfolioService.create(args.data);
}

// ❌ Bad: Generic or function-based names
@Query(() => Portfolio, { name: 'portfolio' })
@Mutation(() => Portfolio, { name: 'portfolio' })
```

### DTOs and Input Types Structure

**Pattern:** Arguments passed through queries or mutations must be defined in dedicated DTO files within the same-level `dtos` folder.

```typescript
// portfolio/dtos/create-portfolio.dto.ts
@InputType()
export class CreatePortfolioDto {
  @Field(() => String)
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @Field(() => String)
  @IsString()
  @Length(3, 3)
  baseCurrency: string = 'USD';
}

@ArgsType()
export class CreatePortfolioArgs {
  @Field(() => CreatePortfolioDto)
  @Type(() => CreatePortfolioDto)
  @ValidateNested()
  data: CreatePortfolioDto;
}

// portfolio/portfolio.resolver.ts
@Mutation(() => Portfolio, { name: 'createPortfolio' })
async createPortfolio(
  @Args() args: CreatePortfolioArgs,
  @AuthUser() user: User
): Promise<Portfolio> {
  return this.portfolioService.create(args.data, user.id);
}
```

### Authentication and User Context

**Pattern:** Utilize the @AuthUser() decorator to access user context.

```typescript
// ✅ Good: Use @AuthUser() decorator
@Query(() => [Portfolio], { name: 'getUserPortfolios' })
async getUserPortfolios(@AuthUser() user: User): Promise<Portfolio[]> {
  return this.portfolioService.findByUserId(user.id);
}

@Mutation(() => Portfolio, { name: 'createPortfolio' })
async createPortfolio(
  @Args() args: CreatePortfolioArgs,
  @AuthUser() user: User
): Promise<Portfolio> {
  return this.portfolioService.create(args.data, user.id);
}

// ❌ Bad: Requiring user information in arguments
@Query(() => [Portfolio])
async portfolios(@Args('userId') userId: string): Promise<Portfolio[]> {
  return this.portfolioService.findByUserId(userId);
}
```

### Service Layer Pattern

**Pattern:** Implement business logic in services, keeping resolvers thin.

```typescript
// portfolio/portfolio.service.ts
@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly eventBus: EventBus
  ) {}

  async create(data: CreatePortfolioDto, userId: string): Promise<Portfolio> {
    this.logger.log(`Creating portfolio for user ${userId}`);

    try {
      const portfolio = await this.portfolioRepository.create({
        ...data,
        userId,
        totalValue: 0,
        isActive: true,
      });

      await this.eventBus.publish(
        new PortfolioCreatedEvent(portfolio.id, userId)
      );

      this.logger.log(`Portfolio created successfully: ${portfolio.id}`);
      return portfolio;
    } catch (error) {
      this.logger.error(`Failed to create portfolio: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Portfolio creation failed');
    }
  }
}

// portfolio/portfolio.resolver.ts
@Resolver(() => Portfolio)
export class PortfolioResolver {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Mutation(() => Portfolio, { name: 'createPortfolio' })
  async createPortfolio(
    @Args() args: CreatePortfolioArgs,
    @AuthUser() user: User
  ): Promise<Portfolio> {
    return this.portfolioService.create(args.data, user.id);
  }
}
```

### Prisma Repository Pattern

**Pattern:** Use repository pattern with Prisma to encapsulate database operations.

```typescript
// portfolio/portfolio.repository.ts
@Injectable()
export class PortfolioRepository {
  private readonly logger = new Logger(PortfolioRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Portfolio | null> {
    this.logger.debug(`Finding portfolio by id: ${id}`);
    
    return this.prisma.portfolio.findUnique({
      where: { id },
      include: {
        assets: true,
        user: true,
      },
    });
  }

  async findByUserId(userId: string): Promise<Portfolio[]> {
    this.logger.debug(`Finding portfolios for user: ${userId}`);
    
    return this.prisma.portfolio.findMany({
      where: { 
        userId,
        isActive: true,
      },
      include: {
        assets: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreatePortfolioData): Promise<Portfolio> {
    this.logger.debug(`Creating portfolio: ${data.name}`);
    
    return this.prisma.portfolio.create({
      data,
      include: {
        assets: true,
        user: true,
      },
    });
  }
}
```

### Redis Caching Strategy

**Pattern:** Implement caching with proper TTL and cache invalidation strategies.

```typescript
// shared/constants/cache-keys.ts
export enum CACHE_KEY {
  USER_PORTFOLIOS = 'user:portfolios',
  PORTFOLIO_DETAILS = 'portfolio:details',
  ASSET_PRICES = 'asset:prices',
}

// portfolio/portfolio.service.ts
@Injectable()
export class PortfolioService {
  @CacheKey(CACHE_KEY.USER_PORTFOLIOS)
  @CacheTTL(300) // 5 minutes
  async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    return this.portfolioRepository.findByUserId(userId);
  }

  @CacheKey(CACHE_KEY.PORTFOLIO_DETAILS)
  @CacheTTL(60) // 1 minute
  async getPortfolioById(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findById(id);
    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }
    return portfolio;
  }
}
```

### Error Handling

**Pattern:** Use custom exception filters and proper error types.

```typescript
// shared/filters/graphql-exception.filter.ts
@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements GqlExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    
    switch (exception.code) {
      case 'P2002':
        return new GraphQLError('Duplicate entry', {
          extensions: { code: 'DUPLICATE_ENTRY' },
        });
      case 'P2025':
        return new GraphQLError('Record not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      default:
        return new GraphQLError('Database error', {
          extensions: { code: 'DATABASE_ERROR' },
        });
    }
  }
}

// Usage in service
async create(data: CreatePortfolioDto, userId: string): Promise<Portfolio> {
  try {
    return await this.portfolioRepository.create({ ...data, userId });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw error; // Let the filter handle it
    }
    throw new InternalServerErrorException('Portfolio creation failed');
  }
}
```

### Constants Management

**Pattern:** String literals and constant values should be defined in dedicated constant files.

```typescript
// shared/constants/subscription-events.ts
export enum SubscriptionEvent {
  PORTFOLIO_UPDATED = 'portfolioUpdated',
  ASSET_PRICE_UPDATED = 'assetPriceUpdated',
  PORTFOLIO_VALUE_CHANGED = 'portfolioValueChanged',
}

// shared/constants/cache-keys.ts
export enum CACHE_KEY {
  USER_PORTFOLIOS = 'user:portfolios',
  PORTFOLIO_DETAILS = 'portfolio:details',
  ASSET_PRICES = 'asset:prices',
}

// Usage
@Subscription(() => Portfolio, { name: SubscriptionEvent.PORTFOLIO_UPDATED })
portfolioUpdated(@Args('portfolioId') portfolioId: string) {
  return this.pubSub.asyncIterator(SubscriptionEvent.PORTFOLIO_UPDATED);
}
```

### Logging Standards

**Pattern:** Every service class must implement a logger instance.

```typescript
@Injectable()
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  async create(data: CreatePortfolioDto, userId: string): Promise<Portfolio> {
    this.logger.log(`Creating portfolio for user: ${userId}`);
    
    try {
      const portfolio = await this.portfolioRepository.create({
        ...data,
        userId,
      });
      
      this.logger.log(`Portfolio created successfully: ${portfolio.id}`);
      return portfolio;
    } catch (error) {
      this.logger.error(
        `Failed to create portfolio for user ${userId}: ${error.message}`,
        error.stack
      );
      throw new InternalServerErrorException('Portfolio creation failed');
    }
  }

  async findByUserId(userId: string): Promise<Portfolio[]> {
    this.logger.debug(`Fetching portfolios for user: ${userId}`);
    
    const portfolios = await this.portfolioRepository.findByUserId(userId);
    
    this.logger.debug(`Found ${portfolios.length} portfolios for user: ${userId}`);
    return portfolios;
  }
}
```

### Prisma Model Definition and Entity Generation

**Pattern:** Create or update schema files in the prisma/schema directory.

```prisma
// prisma/schema/portfolio.prisma
model Portfolio {
  id           String    @id @default(cuid())
  userId       String    @map("user_id")
  name         String
  description  String?
  totalValue   Decimal   @default(0) @map("total_value") @db.Decimal(20, 8)
  baseCurrency String    @default("USD") @map("base_currency")
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  // Relations
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  assets       Asset[]

  // Indexes
  @@index([userId])
  @@index([userId, isActive])
  @@map("portfolios")
}

model Asset {
  id           String    @id @default(cuid())
  portfolioId  String    @map("portfolio_id")
  symbol       String
  quantity     Decimal   @db.Decimal(20, 8)
  averagePrice Decimal   @map("average_price") @db.Decimal(20, 8)
  currentPrice Decimal   @map("current_price") @db.Decimal(20, 8)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  // Relations
  portfolio Portfolio @relation(fields: [portfolioId], references: [id], onDelete: Cascade)

  // Indexes
  @@index([portfolioId])
  @@index([symbol])
  @@map("assets")
}
```

### DTO Organization and Scope

**Pattern:** Organize DTOs in separate files by operation type within each module.

```typescript
// portfolio/dtos/create-portfolio.dto.ts
@InputType()
export class CreatePortfolioDto {
  @Field(() => String)
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @Field(() => String)
  @IsString()
  @Length(3, 3)
  baseCurrency: string = 'USD';
}

// portfolio/dtos/update-portfolio.dto.ts
@InputType()
export class UpdatePortfolioDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

### Testing Standards

**Pattern:** Comprehensive testing with unit, integration, and e2e tests.

```typescript
// portfolio/portfolio.service.spec.ts
describe('PortfolioService', () => {
  let service: PortfolioService;
  let repository: jest.Mocked<PortfolioRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: PortfolioRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    repository = module.get(PortfolioRepository);
    eventBus = module.get(EventBus);
  });

  describe('create', () => {
    it('should create a portfolio successfully', async () => {
      const createDto: CreatePortfolioDto = {
        name: 'Test Portfolio',
        description: 'Test description',
        baseCurrency: 'USD',
      };
      const userId = 'user-123';
      const expectedPortfolio = {
        id: 'portfolio-123',
        ...createDto,
        userId,
        totalValue: 0,
        isActive: true,
      };

      repository.create.mockResolvedValue(expectedPortfolio as Portfolio);

      const result = await service.create(createDto, userId);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        userId,
        totalValue: 0,
        isActive: true,
      });
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.any(PortfolioCreatedEvent)
      );
      expect(result).toEqual(expectedPortfolio);
    });
  });
});
```

## 🗃️ DATABASE STANDARDS

### Migration Standards

```sql
/*
  Migration: Add portfolio and asset tables
  
  Purpose: Store user portfolios and their cryptocurrency assets
  
  Changes:
  - Create portfolios table with user relationship
  - Create assets table with portfolio relationship
  - Add indexes for performance optimization
  
  Dependencies: users table must exist
*/

-- CreateTable
CREATE TABLE "portfolios" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "total_value" DECIMAL(20,8) NOT NULL DEFAULT 0,
    "base_currency" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "portfolio_id" TEXT NOT NULL,
    "symbol" VARCHAR(20) NOT NULL,
    "quantity" DECIMAL(20,8) NOT NULL,
    "average_price" DECIMAL(20,8) NOT NULL,
    "current_price" DECIMAL(20,8) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "portfolios_user_id_idx" ON "portfolios"("user_id");
CREATE INDEX "portfolios_user_id_is_active_idx" ON "portfolios"("user_id", "is_active");
CREATE INDEX "assets_portfolio_id_idx" ON "assets"("portfolio_id");
CREATE INDEX "assets_symbol_idx" ON "assets"("symbol");

-- AddForeignKey
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_fkey" 
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_portfolio_id_fkey" 
    FOREIGN KEY ("portfolio_id") REFERENCES "portfolios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

## 🎨 UI/UX STANDARDS

### Component Design System

```typescript
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  children,
  className,
  disabled,
  ...props 
}: ButtonProps) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    destructive: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <Spinner size={size} />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
};
```

### Color System

```css
:root {
  /* Primary Colors - Financial Blue */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-900: #1e3a8a;

  /* Success Colors - Profit Green */
  --color-success-50: #ecfdf5;
  --color-success-100: #d1fae5;
  --color-success-500: #10b981;
  --color-success-600: #059669;
  --color-success-700: #047857;

  /* Error Colors - Loss Red */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  /* Warning Colors - Alert Orange */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
}
```

## 🔧 GIT WORKFLOW STANDARDS

### Commit Message Format

```bash
# Conventional commit format
feat(portfolio): add real-time portfolio value updates

Implement WebSocket connection for live portfolio valuation.
- Add WebSocket service for real-time price feeds
- Update portfolio component to handle live updates  
- Add error handling for connection failures

Fixes #123
Breaking Change: Portfolio API now requires WebSocket support

# Other commit types
fix(auth): resolve JWT token expiration issue
docs(api): update GraphQL schema documentation
style(ui): improve portfolio card component consistency
refactor(service): optimize portfolio query performance
test(portfolio): add integration tests for portfolio creation
chore(deps): update Apollo Client to latest version
```

### Branch Naming Conventions

```bash
# Feature branches
feature/portfolio-real-time-updates
feature/XELA-123-add-crypto-exchange-integration

# Bug fixes
fix/portfolio-calculation-error
fix/BUG-456-authentication-token-refresh

# Hotfixes
hotfix/v1.1.1-critical-security-patch

# Chores
chore/update-dependencies
chore/refactor-portfolio-service

# Documentation
docs/api-documentation-update
docs/add-frontend-guidelines
```

## 📊 PERFORMANCE STANDARDS

### Performance Targets

```typescript
export const PERFORMANCE_TARGETS = {
  // API Response Times (ms)
  API_RESPONSE_TIME: {
    FAST: 100,    // Simple queries (user profile, single portfolio)
    MEDIUM: 300,  // Complex queries (portfolio with assets)
    SLOW: 1000,   // Heavy operations (portfolio analytics)
  },

  // Database Query Times (ms)
  DATABASE_QUERY_TIME: {
    SIMPLE: 50,   // Indexed single table queries
    COMPLEX: 200, // Multi-table joins
    ANALYTICS: 500, // Aggregation queries
  },

  // Frontend Performance
  FRONTEND_PERFORMANCE: {
    FIRST_PAINT: 1500,     // Time to first paint
    INTERACTIVE: 3000,     // Time to interactive
    BUNDLE_SIZE: 500,      // KB compressed
  },
} as const;

// Performance monitoring decorator
export function MonitorPerformance(target: string, threshold: number) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      
      try {
        const result = await method.apply(this, args);
        const duration = Date.now() - startTime;
        
        if (duration > threshold) {
          console.warn(
            `Performance warning: ${target}.${propertyName} took ${duration}ms (threshold: ${threshold}ms)`
          );
        }
        
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(
          `Error in ${target}.${propertyName} after ${duration}ms:`,
          error
        );
        throw error;
      }
    };
  };
}
```

## 🔒 SECURITY STANDARDS

### Data Validation

```typescript
// Portfolio validation
@InputType()
export class CreatePortfolioDto {
  @Field(() => String)
  @IsString()
  @Length(1, 100, { message: 'Portfolio name must be 1-100 characters' })
  @Matches(/^[a-zA-Z0-9\s\-_]+$/, { message: 'Invalid characters in portfolio name' })
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'Description must be less than 500 characters' })
  description?: string;

  @Field(() => String)
  @IsString()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  @IsUppercase({ message: 'Currency code must be uppercase' })
  baseCurrency: string = 'USD';
}

// Asset validation
@InputType()
export class CreateAssetDto {
  @Field(() => String)
  @IsString()
  @Length(1, 20, { message: 'Symbol must be 1-20 characters' })
  @IsUppercase({ message: 'Symbol must be uppercase' })
  symbol: string;

  @Field(() => Number)
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(0.00000001, { message: 'Quantity must be greater than 0' })
  @Max(999999999, { message: 'Quantity too large' })
  quantity: number;

  @Field(() => String)
  @IsUUID(4, { message: 'Invalid portfolio ID format' })
  portfolioId: string;
}
```

### Sensitive Data Handling

```typescript
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

  encrypt(text: string): EncryptedData {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.secretKey);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
    };
  }

  decrypt(encryptedData: EncryptedData): string {
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Never log sensitive data
export class ExchangeApiService {
  private readonly logger = new Logger(ExchangeApiService.name);

  async storeApiCredentials(userId: string, exchange: string, apiKey: string, secret: string) {
    // ✅ Good: Log operation without exposing sensitive data
    this.logger.log(`Storing API credentials for user ${userId} on exchange ${exchange}`);
    
    // ❌ Never do this
    // this.logger.log(`Storing API key ${apiKey} for user ${userId}`);
    
    const encryptedKey = this.encryptionService.encrypt(apiKey);
    const encryptedSecret = this.encryptionService.encrypt(secret);
    
    // Store encrypted values
  }
}
```

---

*This style guide ensures consistent, maintainable, and high-quality code across the entire Xela Finance Management System. All developers must adhere to these standards for successful project collaboration and delivery.* 