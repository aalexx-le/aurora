# STYLE GUIDE - XELA Finance Management System

## 🎨 OVERVIEW

This style guide establishes comprehensive development standards, coding conventions, and best practices for the Xela Finance Management System. All contributors must follow these guidelines to ensure code consistency, maintainability, and quality across the entire project.

## 💻 CODE FORMATTING & STANDARDS

### TypeScript/JavaScript Standards

#### File Naming Conventions
```typescript
// Use PascalCase for React components and classes
UserProfile.tsx
PortfolioManager.ts
ExchangeApiService.ts

// Use camelCase for functions, variables, and non-component files
userService.ts
portfolioUtils.ts
exchangeConnector.ts

// Use kebab-case for directories and non-code files
user-management/
portfolio-analytics/
exchange-integration/

// Use UPPER_SNAKE_CASE for constants
export const API_ENDPOINTS = {
  BINANCE_BASE_URL: 'https://api.binance.com',
  DEFAULT_TIMEOUT: 30000,
  MAX_RETRY_ATTEMPTS: 3
};
```

#### Code Formatting Rules
```typescript
// ✅ Good: Proper spacing and formatting
export class PortfolioService {
  private readonly logger = new Logger(PortfolioService.name);

  constructor(
    private readonly portfolioRepo: IPortfolioRepository,
    private readonly eventBus: EventBus,
  ) {}

  async createPortfolio(
    data: CreatePortfolioDto,
    userId: string,
  ): Promise<Portfolio> {
    this.logger.debug('Creating portfolio', { userId, portfolioName: data.name });

    try {
      const portfolio = await this.portfolioRepo.create({
        ...data,
        userId,
        createdAt: new Date(),
      });

      await this.eventBus.publish(
        new PortfolioCreatedEvent(portfolio.id, userId)
      );

      return portfolio;
    } catch (error) {
      this.logger.error('Failed to create portfolio', error);
      throw new InternalServerErrorException('Portfolio creation failed');
    }
  }
}

// ❌ Bad: Poor formatting and spacing
export class PortfolioService{
private readonly logger=new Logger(PortfolioService.name);
constructor(private readonly portfolioRepo:IPortfolioRepository,private readonly eventBus:EventBus){}
async createPortfolio(data:CreatePortfolioDto,userId:string):Promise<Portfolio>{
try{
const portfolio=await this.portfolioRepo.create({...data,userId,createdAt:new Date()});
await this.eventBus.publish(new PortfolioCreatedEvent(portfolio.id,userId));
return portfolio;
}catch(error){
throw new InternalServerErrorException('Portfolio creation failed');
}}}
```

#### Import Organization
```typescript
// ✅ Good: Organized imports with proper grouping
// 1. Node.js built-in modules
import { readFileSync } from 'fs';
import { join } from 'path';

// 2. External libraries
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 3. Internal modules (absolute paths)
import { Portfolio } from '@/entities/Portfolio';
import { CreatePortfolioDto } from '@/dto/CreatePortfolioDto';
import { IPortfolioRepository } from '@/interfaces/IPortfolioRepository';

// 4. Relative imports
import { PortfolioValidator } from './PortfolioValidator';
import { PortfolioEvents } from './events';

// ❌ Bad: Mixed import organization
import { PortfolioValidator } from './PortfolioValidator';
import { Injectable, Logger } from '@nestjs/common';
import { Portfolio } from '@/entities/Portfolio';
import { readFileSync } from 'fs';
import { CreatePortfolioDto } from '@/dto/CreatePortfolioDto';
```

### React/Next.js Component Standards

#### Component Structure
```typescript
// ✅ Good: Well-structured React component
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { usePortfolio } from '@/hooks/usePortfolio';
import { formatCurrency } from '@/utils/formatting';

interface PortfolioCardProps {
  portfolioId: string;
  onPortfolioSelect?: (id: string) => void;
  className?: string;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  portfolioId,
  onPortfolioSelect,
  className,
}) => {
  const router = useRouter();
  const { portfolio, loading, error } = usePortfolio(portfolioId);
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePortfolioClick = useCallback(() => {
    if (onPortfolioSelect) {
      onPortfolioSelect(portfolioId);
    } else {
      router.push(`/portfolios/${portfolioId}`);
    }
  }, [portfolioId, onPortfolioSelect, router]);

  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  if (loading) {
    return <PortfolioCardSkeleton />;
  }

  if (error) {
    return <PortfolioCardError error={error} />;
  }

  return (
    <Card className={className} onClick={handlePortfolioClick}>
      <Card.Header>
        <Card.Title>{portfolio.name}</Card.Title>
        <Card.Actions>
          <Button variant="ghost" size="sm" onClick={toggleExpanded}>
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </Card.Actions>
      </Card.Header>
      
      <Card.Content>
        <div className="portfolio-summary">
          <div className="total-value">
            {formatCurrency(portfolio.totalValue)}
          </div>
          <div className="daily-change">
            <span className={portfolio.dailyChange >= 0 ? 'positive' : 'negative'}>
              {portfolio.dailyChange > 0 ? '+' : ''}
              {portfolio.dailyChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {isExpanded && (
          <div className="portfolio-details">
            <AssetList assets={portfolio.assets} />
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

// Component sub-components for organization
const PortfolioCardSkeleton: React.FC = () => (
  <Card className="animate-pulse">
    <Card.Header>
      <div className="h-6 bg-gray-200 rounded w-1/3" />
    </Card.Header>
    <Card.Content>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </Card.Content>
  </Card>
);

const PortfolioCardError: React.FC<{ error: Error }> = ({ error }) => (
  <Card className="border-red-200">
    <Card.Content>
      <div className="text-red-600">Error loading portfolio: {error.message}</div>
    </Card.Content>
  </Card>
);
```

#### Hook Conventions
```typescript
// ✅ Good: Custom hook implementation
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import { GET_PORTFOLIO, UPDATE_PORTFOLIO } from '@/graphql/portfolio';
import { Portfolio, UpdatePortfolioInput } from '@/types/portfolio';

interface UsePortfolioReturn {
  portfolio: Portfolio | null;
  loading: boolean;
  error: Error | null;
  updatePortfolio: (updates: UpdatePortfolioInput) => Promise<void>;
  refreshPortfolio: () => Promise<void>;
}

export const usePortfolio = (portfolioId: string): UsePortfolioReturn => {
  const [error, setError] = useState<Error | null>(null);

  const { data, loading, error: queryError, refetch } = useQuery(GET_PORTFOLIO, {
    variables: { id: portfolioId },
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  const [updatePortfolioMutation] = useMutation(UPDATE_PORTFOLIO, {
    onError: (mutationError) => {
      setError(mutationError);
    },
    onCompleted: () => {
      setError(null);
    },
  });

  const updatePortfolio = useCallback(async (updates: UpdatePortfolioInput) => {
    try {
      await updatePortfolioMutation({
        variables: {
          id: portfolioId,
          input: updates,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Update failed'));
      throw err;
    }
  }, [portfolioId, updatePortfolioMutation]);

  const refreshPortfolio = useCallback(async () => {
    try {
      await refetch();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Refresh failed'));
    }
  }, [refetch]);

  return {
    portfolio: data?.portfolio || null,
    loading,
    error: error || queryError,
    updatePortfolio,
    refreshPortfolio,
  };
};
```

### GraphQL Schema Standards

#### Schema Definition
```graphql
# ✅ Good: Well-documented GraphQL schema
"""
Portfolio represents a collection of cryptocurrency assets for a user
"""
type Portfolio {
  "Unique identifier for the portfolio"
  id: ID!
  
  "User who owns this portfolio"
  userId: ID!
  
  "Display name for the portfolio"
  name: String!
  
  "Optional description of the portfolio"
  description: String
  
  "Total value of all assets in the portfolio (in base currency)"
  totalValue: Float!
  
  "Base currency for portfolio calculations (default: USD)"
  baseCurrency: String!
  
  "List of assets in this portfolio"
  assets: [Asset!]!
  
  "Recent transactions for this portfolio"
  transactions(limit: Int = 10, offset: Int = 0): [Transaction!]!
  
  "Whether this portfolio is currently active"
  isActive: Boolean!
  
  "When this portfolio was created"
  createdAt: DateTime!
  
  "When this portfolio was last updated"
  updatedAt: DateTime!
}

"""
Input for creating a new portfolio
"""
input CreatePortfolioInput {
  "Display name for the portfolio"
  name: String!
  
  "Optional description"
  description: String
  
  "Base currency for calculations (default: USD)"
  baseCurrency: String = "USD"
}

"""
Input for updating an existing portfolio
"""
input UpdatePortfolioInput {
  "New display name"
  name: String
  
  "New description"
  description: String
  
  "New base currency"
  baseCurrency: String
  
  "Whether portfolio is active"
  isActive: Boolean
}

type Query {
  """
  Get a specific portfolio by ID
  """
  portfolio(id: ID!): Portfolio
  
  """
  Get all portfolios for the current user
  """
  portfolios(
    "Filter by active status"
    isActive: Boolean
    
    "Pagination limit"
    limit: Int = 20
    
    "Pagination offset"
    offset: Int = 0
  ): [Portfolio!]!
}

type Mutation {
  """
  Create a new portfolio
  """
  createPortfolio(input: CreatePortfolioInput!): Portfolio!
  
  """
  Update an existing portfolio
  """
  updatePortfolio(id: ID!, input: UpdatePortfolioInput!): Portfolio!
  
  """
  Delete a portfolio (soft delete)
  """
  deletePortfolio(id: ID!): Boolean!
}

type Subscription {
  """
  Subscribe to portfolio value updates
  """
  portfolioUpdated(portfolioId: ID!): Portfolio!
}
```

## 🗃️ DATABASE STANDARDS

### Prisma Schema Conventions
```prisma
// ✅ Good: Well-structured Prisma schema
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

/// User account information
model User {
  /// Primary key
  id        String   @id @default(cuid())
  /// Unique email address
  email     String   @unique
  /// Hashed password
  password  String
  /// User's first name
  firstName String?  @map("first_name")
  /// User's last name
  lastName  String?  @map("last_name")
  /// User's timezone
  timezone  String   @default("UTC")
  /// Account creation timestamp
  createdAt DateTime @default(now()) @map("created_at")
  /// Last update timestamp
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  portfolios          Portfolio[]
  exchangeConnections ExchangeConnection[]

  @@map("users")
}

/// Portfolio containing cryptocurrency assets
model Portfolio {
  /// Primary key
  id           String    @id @default(cuid())
  /// Reference to owner user
  userId       String    @map("user_id")
  /// Portfolio display name
  name         String
  /// Optional description
  description  String?
  /// Total portfolio value in base currency
  totalValue   Decimal   @default(0) @map("total_value") @db.Decimal(20, 8)
  /// Base currency for calculations
  baseCurrency String    @default("USD") @map("base_currency")
  /// Whether portfolio is active
  isActive     Boolean   @default(true) @map("is_active")
  /// Creation timestamp
  createdAt    DateTime  @default(now()) @map("created_at")
  /// Last update timestamp
  updatedAt    DateTime  @updatedAt @map("updated_at")

  // Relations
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  assets       Asset[]
  transactions Transaction[]

  // Indexes
  @@index([userId])
  @@index([userId, isActive])
  @@map("portfolios")
}
```

### Migration Standards
```typescript
// ✅ Good: Well-documented migration
/*
  Migration: Add exchange connections table
  
  Purpose: Store encrypted API credentials for cryptocurrency exchanges
  
  Changes:
  - Create exchange_connections table
  - Add foreign key to users table
  - Add indexes for performance
  
  Dependencies: users table must exist
*/

-- CreateTable
CREATE TABLE "exchange_connections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "exchange_name" VARCHAR(50) NOT NULL,
    "api_key_encrypted" TEXT NOT NULL,
    "api_secret_encrypted" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_sync_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exchange_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exchange_connections_user_id_idx" ON "exchange_connections"("user_id");

-- CreateIndex
CREATE INDEX "exchange_connections_user_id_is_active_idx" ON "exchange_connections"("user_id", "is_active");

-- AddForeignKey
ALTER TABLE "exchange_connections" ADD CONSTRAINT "exchange_connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

## 🎨 UI/UX STANDARDS

### Component Design Principles
```typescript
// ✅ Good: Consistent component design
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className,
}) => {
  const baseClasses = 'font-medium rounded-md transition-colors focus:outline-none focus:ring-2';
  
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
        disabled && 'opacity-50 cursor-not-allowed',
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner size={size} /> : children}
    </button>
  );
};
```

### Color Palette
```css
/* Primary Colors */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-900: #1e3a8a;

  /* Success Colors */
  --color-success-50: #ecfdf5;
  --color-success-100: #d1fae5;
  --color-success-500: #10b981;
  --color-success-600: #059669;
  --color-success-700: #047857;

  /* Error Colors */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  /* Warning Colors */
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

### Typography Scale
```css
/* Typography System */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }

/* Font Weights */
.font-light { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
```

## 🧪 TESTING STANDARDS

### Unit Test Structure
```typescript
// ✅ Good: Comprehensive unit test
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PortfolioService } from './PortfolioService';
import { Portfolio } from '@/entities/Portfolio';
import { CreatePortfolioDto } from '@/dto/CreatePortfolioDto';
import { NotFoundException } from '@nestjs/common';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let repository: jest.Mocked<Repository<Portfolio>>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: getRepositoryToken(Portfolio),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    repository = module.get(getRepositoryToken(Portfolio));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPortfolio', () => {
    it('should create a portfolio successfully', async () => {
      // Arrange
      const createDto: CreatePortfolioDto = {
        name: 'Test Portfolio',
        description: 'A test portfolio',
        baseCurrency: 'USD',
      };
      const userId = 'user-123';
      const expectedPortfolio = {
        id: 'portfolio-123',
        ...createDto,
        userId,
        totalValue: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      repository.create.mockReturnValue(expectedPortfolio as Portfolio);
      repository.save.mockResolvedValue(expectedPortfolio as Portfolio);

      // Act
      const result = await service.createPortfolio(createDto, userId);

      // Assert
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        userId,
        totalValue: 0,
        isActive: true,
      });
      expect(repository.save).toHaveBeenCalledWith(expectedPortfolio);
      expect(result).toEqual(expectedPortfolio);
    });

    it('should throw an error if portfolio creation fails', async () => {
      // Arrange
      const createDto: CreatePortfolioDto = {
        name: 'Test Portfolio',
        baseCurrency: 'USD',
      };
      const userId = 'user-123';
      const error = new Error('Database connection failed');

      repository.create.mockReturnValue({} as Portfolio);
      repository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(service.createPortfolio(createDto, userId))
        .rejects
        .toThrow('Database connection failed');
    });
  });

  describe('getPortfolioById', () => {
    it('should return a portfolio when found', async () => {
      // Arrange
      const portfolioId = 'portfolio-123';
      const expectedPortfolio = {
        id: portfolioId,
        name: 'Test Portfolio',
        userId: 'user-123',
      };

      repository.findOne.mockResolvedValue(expectedPortfolio as Portfolio);

      // Act
      const result = await service.getPortfolioById(portfolioId);

      // Assert
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: portfolioId },
        relations: ['assets', 'transactions'],
      });
      expect(result).toEqual(expectedPortfolio);
    });

    it('should throw NotFoundException when portfolio not found', async () => {
      // Arrange
      const portfolioId = 'nonexistent-portfolio';
      repository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getPortfolioById(portfolioId))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
```

### Integration Test Structure
```typescript
// ✅ Good: Integration test for API endpoints
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '@/app.module';
import { Portfolio } from '@/entities/Portfolio';
import { User } from '@/entities/User';
import { AuthService } from '@/auth/AuthService';

describe('Portfolio API (e2e)', () => {
  let app: INestApplication;
  let portfolioRepository: Repository<Portfolio>;
  let userRepository: Repository<User>;
  let authService: AuthService;
  
  let testUser: User;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    portfolioRepository = moduleFixture.get(getRepositoryToken(Portfolio));
    userRepository = moduleFixture.get(getRepositoryToken(User));
    authService = moduleFixture.get(AuthService);

    await app.init();

    // Create test user and get auth token
    testUser = await userRepository.save({
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'Test',
      lastName: 'User',
    });

    authToken = await authService.generateToken(testUser);
  });

  afterAll(async () => {
    await userRepository.delete({});
    await portfolioRepository.delete({});
    await app.close();
  });

  beforeEach(async () => {
    await portfolioRepository.delete({});
  });

  describe('POST /portfolios', () => {
    it('should create a new portfolio', async () => {
      const createPortfolioDto = {
        name: 'Test Portfolio',
        description: 'A test portfolio for integration testing',
        baseCurrency: 'USD',
      };

      const response = await request(app.getHttpServer())
        .post('/portfolios')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createPortfolioDto)
        .expect(201);

      expect(response.body).toMatchObject({
        name: createPortfolioDto.name,
        description: createPortfolioDto.description,
        baseCurrency: createPortfolioDto.baseCurrency,
        userId: testUser.id,
        totalValue: '0',
        isActive: true,
      });

      // Verify portfolio was saved to database
      const savedPortfolio = await portfolioRepository.findOne({
        where: { id: response.body.id },
      });
      expect(savedPortfolio).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      await request(app.getHttpServer())
        .post('/portfolios')
        .send({ name: 'Test Portfolio' })
        .expect(401);
    });
  });
});
```

## 📝 DOCUMENTATION STANDARDS

### API Documentation
```typescript
// ✅ Good: Well-documented API endpoint
/**
 * @fileoverview Portfolio management API endpoints
 * @module PortfolioController
 */

import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { PortfolioService } from './PortfolioService';
import { CreatePortfolioDto } from './dto/CreatePortfolioDto';
import { PortfolioResponseDto } from './dto/PortfolioResponseDto';
import { JwtAuthGuard } from '@/auth/guards/JwtAuthGuard';
import { CurrentUser } from '@/auth/decorators/CurrentUser';
import { User } from '@/entities/User';

@ApiTags('Portfolios')
@Controller('api/v1/portfolios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  /**
   * Create a new portfolio for the authenticated user
   * 
   * @param createPortfolioDto - Portfolio creation data
   * @param user - Currently authenticated user
   * @returns Created portfolio with generated ID
   * 
   * @example
   * ```json
   * {
   *   "name": "My Crypto Portfolio",
   *   "description": "Long-term cryptocurrency investments",
   *   "baseCurrency": "USD"
   * }
   * ```
   */
  @Post()
  @ApiOperation({ 
    summary: 'Create a new portfolio',
    description: 'Creates a new portfolio for the authenticated user with the provided details.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Portfolio created successfully',
    type: PortfolioResponseDto 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Authentication required' 
  })
  async createPortfolio(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @CurrentUser() user: User,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.createPortfolio(createPortfolioDto, user.id);
  }

  /**
   * Get a specific portfolio by ID
   * 
   * @param id - Portfolio unique identifier
   * @param user - Currently authenticated user (for authorization)
   * @returns Portfolio details with assets and recent transactions
   */
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get portfolio by ID',
    description: 'Retrieves detailed information about a specific portfolio including assets and recent transactions.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Portfolio retrieved successfully',
    type: PortfolioResponseDto 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Portfolio not found' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Access denied to this portfolio' 
  })
  async getPortfolio(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.getPortfolioById(id, user.id);
  }
}
```

### Code Comments
```typescript
// ✅ Good: Meaningful comments
export class PriceCalculationService {
  /**
   * Calculates the weighted average price for multiple assets
   * 
   * This method handles the complex calculation of portfolio weighted averages,
   * taking into account both quantity and current market prices. It's used
   * for portfolio valuation and performance metrics.
   * 
   * @param assets - Array of assets with quantities and prices
   * @param baseCurrency - Target currency for conversion (default: USD)
   * @returns Weighted average price in the specified currency
   * 
   * @throws {InvalidCurrencyError} When base currency is not supported
   * @throws {InsufficientDataError} When price data is unavailable
   */
  calculateWeightedAverage(
    assets: Asset[],
    baseCurrency: string = 'USD'
  ): Promise<number> {
    // Validate input parameters
    if (!assets.length) {
      return Promise.resolve(0);
    }

    // Filter out assets with zero quantity to avoid division errors
    const validAssets = assets.filter(asset => asset.quantity > 0);

    // Calculate total portfolio value first for weighting
    let totalValue = 0;
    const assetValues = validAssets.map(asset => {
      const value = asset.quantity * asset.currentPrice;
      totalValue += value;
      return { asset, value };
    });

    // Early return for empty portfolio
    if (totalValue === 0) {
      return Promise.resolve(0);
    }

    // Calculate weighted average using portfolio value weights
    const weightedSum = assetValues.reduce((sum, { asset, value }) => {
      const weight = value / totalValue;
      return sum + (asset.currentPrice * weight);
    }, 0);

    return Promise.resolve(weightedSum);
  }

  // ❌ Bad: Useless comments
  // This function adds two numbers
  private add(a: number, b: number): number {
    return a + b; // Return the sum
  }
}
```

## 🔧 GIT WORKFLOW STANDARDS

### Commit Message Format
```bash
# ✅ Good: Conventional commit format
feat(portfolio): add real-time portfolio value updates

Implement WebSocket connection for live portfolio valuation.
- Add WebSocket service for real-time price feeds
- Update portfolio component to handle live updates
- Add error handling for connection failures

Fixes #123
Breaking Change: Portfolio API now requires WebSocket support

# ✅ Good: Various commit types
fix(auth): resolve JWT token expiration issue
docs(api): update GraphQL schema documentation
style(ui): improve button component consistency
refactor(database): optimize portfolio query performance
test(portfolio): add integration tests for portfolio creation
chore(deps): update dependencies to latest versions

# ❌ Bad: Poor commit messages
fix stuff
update files
working on portfolio
misc changes
WIP
```

### Branch Naming Conventions
```bash
# ✅ Good: Descriptive branch names
feature/portfolio-real-time-updates
fix/auth-token-expiration
hotfix/database-connection-leak
chore/update-dependencies
docs/api-documentation-update
refactor/portfolio-service-optimization

# ✅ Good: Branch naming patterns
feature/TICKET-123-add-exchange-integration
fix/BUG-456-portfolio-calculation-error
release/v1.2.0
hotfix/v1.1.1-critical-security-patch

# ❌ Bad: Poor branch names
my-feature
fix
test-branch
updates
new-stuff
```

### Pull Request Template
```markdown
## Description
Brief description of the changes in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing
- [ ] E2E tests

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Additional Notes
Any additional information that reviewers should know.
```

## 📊 PERFORMANCE STANDARDS

### Performance Targets
```typescript
// Performance requirements for different types of operations
export const PERFORMANCE_TARGETS = {
  // API Response Times
  API_RESPONSE_TIME: {
    FAST: 100, // Simple queries (user profile, single portfolio)
    MEDIUM: 300, // Complex queries (portfolio with assets)
    SLOW: 1000, // Heavy operations (portfolio analytics)
  },

  // Database Query Times
  DATABASE_QUERY_TIME: {
    SIMPLE: 50, // Indexed single table queries
    COMPLEX: 200, // Multi-table joins
    ANALYTICS: 500, // Aggregation queries
  },

  // Frontend Performance
  FRONTEND_PERFORMANCE: {
    FIRST_PAINT: 1500, // Time to first paint
    INTERACTIVE: 3000, // Time to interactive
    BUNDLE_SIZE: 500, // KB compressed
  },

  // System Resources
  RESOURCE_LIMITS: {
    MEMORY_PER_SERVICE: 512, // MB
    CPU_UTILIZATION: 70, // Percentage
    DATABASE_CONNECTIONS: 20, // Per service
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

// Usage example
export class PortfolioService {
  @MonitorPerformance('PortfolioService', PERFORMANCE_TARGETS.API_RESPONSE_TIME.MEDIUM)
  async getPortfolioWithAssets(portfolioId: string): Promise<Portfolio> {
    // Implementation here
  }
}
```

## 🔒 SECURITY STANDARDS

### Data Validation
```typescript
// ✅ Good: Comprehensive input validation
import { IsString, IsEmail, IsUUID, IsNumber, IsOptional, Min, Max, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({ 
    description: 'Portfolio name',
    example: 'My Crypto Portfolio',
    minLength: 1,
    maxLength: 100
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ 
    description: 'Portfolio description',
    example: 'Long-term cryptocurrency investments',
    required: false,
    maxLength: 500
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiProperty({ 
    description: 'Base currency for portfolio calculations',
    example: 'USD',
    default: 'USD'
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  baseCurrency?: string = 'USD';
}

export class TransactionDto {
  @ApiProperty({ description: 'Transaction amount' })
  @IsNumber()
  @Min(0.00000001)
  @Max(999999999)
  amount: number;

  @ApiProperty({ description: 'Asset symbol' })
  @IsString()
  @Length(1, 20)
  symbol: string;

  @ApiProperty({ description: 'Portfolio ID' })
  @IsUUID(4)
  portfolioId: string;
}
```

### Sensitive Data Handling
```typescript
// ✅ Good: Secure handling of API keys and sensitive data
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

  /**
   * Encrypt sensitive data like API keys
   */
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

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: EncryptedData): string {
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

// Never log sensitive data
export class ApiKeyService {
  private readonly logger = new Logger(ApiKeyService.name);

  async storeApiKey(userId: string, exchange: string, apiKey: string, secret: string) {
    // ✅ Good: Log operation without exposing sensitive data
    this.logger.log(`Storing API key for user ${userId} on exchange ${exchange}`);
    
    // ❌ Bad: Never do this
    // this.logger.log(`Storing API key ${apiKey} for user ${userId}`);
    
    const encryptedKey = this.encryptionService.encrypt(apiKey);
    const encryptedSecret = this.encryptionService.encrypt(secret);
    
    // Store encrypted values
  }
}
```

---

*This style guide ensures consistent, maintainable, and high-quality code across the entire Xela Finance Management System. All developers must adhere to these standards for successful project collaboration.* 