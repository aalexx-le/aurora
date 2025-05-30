# SYSTEM PATTERNS - XELA Finance Management System

## 🏗️ ARCHITECTURAL PATTERNS

### Microservices Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Auth Service  │
│   (Next.js)     │────▶   (GraphQL)     │────▶   (JWT/OAuth)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐    ┌──────────▼────────┐    ┌──────────▼────────┐
│ Portfolio      │    │ Exchange          │    │ Banking           │
│ Service        │    │ Integration       │    │ Service           │
│ (NestJS)       │    │ Service           │    │ (NestJS)          │
└────────────────┘    └───────────────────┘    └───────────────────┘
        │                         │                         │
┌───────▼────────┐    ┌──────────▼────────┐    ┌──────────▼────────┐
│ PostgreSQL     │    │ Redis Cache       │    │ Time Series DB    │
│ (Primary DB)   │    │ (Sessions/Cache)  │    │ (Analytics)       │
└────────────────┘    └───────────────────┘    └───────────────────┘
```

### Event-Driven Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Exchange API    │────▶ Message Queue    │────▶ Portfolio      │
│ WebSocket       │    │ (Apache Kafka/  │    │ Update Service  │
│ Streams         │    │  RabbitMQ)      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Event Processor   │
                    │ (Apache Airflow)  │
                    └───────────────────┘
```

## 📊 DATA PATTERNS

### Database Design Patterns

#### Repository Pattern
```typescript
// Abstract repository interface
interface IPortfolioRepository {
  findById(id: string): Promise<Portfolio>;
  findByUserId(userId: string): Promise<Portfolio[]>;
  create(portfolio: CreatePortfolioDto): Promise<Portfolio>;
  update(id: string, data: UpdatePortfolioDto): Promise<Portfolio>;
  delete(id: string): Promise<void>;
}

// Concrete implementation
@Injectable()
export class PortfolioRepository implements IPortfolioRepository {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepo: Repository<Portfolio>,
  ) {}

  async findById(id: string): Promise<Portfolio> {
    return this.portfolioRepo.findOne({ where: { id } });
  }
  // ... other methods
}
```

#### Unit of Work Pattern
```typescript
@Injectable()
export class PortfolioService {
  constructor(
    private readonly portfolioRepo: IPortfolioRepository,
    private readonly transactionRepo: ITransactionRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async updatePortfolioWithTransactions(
    portfolioId: string,
    transactions: CreateTransactionDto[],
  ): Promise<void> {
    await this.entityManager.transaction(async (manager) => {
      // All operations within single transaction
      const portfolio = await this.portfolioRepo.findById(portfolioId);
      
      for (const txData of transactions) {
        await this.transactionRepo.create(txData);
        portfolio.updateBalance(txData);
      }
      
      await this.portfolioRepo.update(portfolioId, portfolio);
    });
  }
}
```

### Caching Patterns

#### Cache-Aside Pattern
```typescript
@Injectable()
export class PriceService {
  constructor(
    private readonly redis: Redis,
    private readonly exchangeApi: ExchangeApiService,
  ) {}

  async getCurrentPrice(symbol: string): Promise<number> {
    const cacheKey = `price:${symbol}`;
    
    // Try cache first
    const cachedPrice = await this.redis.get(cacheKey);
    if (cachedPrice) {
      return parseFloat(cachedPrice);
    }
    
    // Cache miss - fetch from API
    const price = await this.exchangeApi.getPrice(symbol);
    
    // Update cache with 30-second TTL
    await this.redis.setex(cacheKey, 30, price.toString());
    
    return price;
  }
}
```

#### Write-Through Pattern
```typescript
@Injectable()
export class TransactionService {
  async createTransaction(data: CreateTransactionDto): Promise<Transaction> {
    // Write to database
    const transaction = await this.transactionRepo.create(data);
    
    // Write to cache simultaneously
    const cacheKey = `transaction:${transaction.id}`;
    await this.redis.setex(
      cacheKey, 
      3600, 
      JSON.stringify(transaction)
    );
    
    return transaction;
  }
}
```

## 🔄 API PATTERNS

### GraphQL Schema Design
```graphql
# Schema-first approach
type Portfolio {
  id: ID!
  userId: ID!
  name: String!
  totalValue: Float!
  assets: [Asset!]!
  transactions: [Transaction!]!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Asset {
  id: ID!
  symbol: String!
  quantity: Float!
  averagePrice: Float!
  currentPrice: Float!
  totalValue: Float!
  exchange: Exchange!
}

type Query {
  portfolio(id: ID!): Portfolio
  portfolios(userId: ID!): [Portfolio!]!
  asset(id: ID!): Asset
}

type Mutation {
  createPortfolio(input: CreatePortfolioInput!): Portfolio!
  updatePortfolio(id: ID!, input: UpdatePortfolioInput!): Portfolio!
  deletePortfolio(id: ID!): Boolean!
}

type Subscription {
  portfolioUpdated(portfolioId: ID!): Portfolio!
  priceUpdated(symbol: String!): PriceUpdate!
}
```

### REST API Patterns
```typescript
// RESTful controller design
@Controller('api/v1/portfolios')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @ApiOperation({ summary: 'Get user portfolios' })
  @ApiResponse({ status: 200, type: [PortfolioDto] })
  async getPortfolios(@CurrentUser() user: User): Promise<PortfolioDto[]> {
    return this.portfolioService.findByUserId(user.id);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string' })
  async getPortfolio(@Param('id') id: string): Promise<PortfolioDto> {
    return this.portfolioService.findById(id);
  }

  @Post()
  @ApiBody({ type: CreatePortfolioDto })
  async createPortfolio(
    @Body() createDto: CreatePortfolioDto,
    @CurrentUser() user: User,
  ): Promise<PortfolioDto> {
    return this.portfolioService.create({ ...createDto, userId: user.id });
  }
}
```

## 🔐 SECURITY PATTERNS

### Authentication & Authorization
```typescript
// JWT Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

// Role-based access control
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

### Data Encryption
```typescript
@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly secretKey = process.env.ENCRYPTION_KEY;

  encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.secretKey);
    cipher.setAAD(Buffer.from('xela', 'utf8'));
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipher(this.algorithm, this.secretKey);
    decipher.setAAD(Buffer.from('xela', 'utf8'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
```

## 🔄 INTEGRATION PATTERNS

### Exchange API Integration
```typescript
// Strategy pattern for different exchanges
interface ExchangeStrategy {
  getPortfolio(apiKey: string, secret: string): Promise<Portfolio>;
  getTransactions(apiKey: string, secret: string): Promise<Transaction[]>;
  getCurrentPrices(symbols: string[]): Promise<PriceMap>;
}

@Injectable()
export class BinanceStrategy implements ExchangeStrategy {
  async getPortfolio(apiKey: string, secret: string): Promise<Portfolio> {
    const client = new BinanceApi({ apiKey, apiSecret: secret });
    const account = await client.account();
    
    return this.transformToPortfolio(account);
  }
  
  // ... other methods
}

@Injectable()
export class ExchangeService {
  private strategies = new Map<string, ExchangeStrategy>();

  constructor(
    private binanceStrategy: BinanceStrategy,
    private okxStrategy: OkxStrategy,
    private mexcStrategy: MexcStrategy,
  ) {
    this.strategies.set('binance', binanceStrategy);
    this.strategies.set('okx', okxStrategy);
    this.strategies.set('mexc', mexcStrategy);
  }

  async syncPortfolio(
    exchange: string,
    credentials: ExchangeCredentials,
  ): Promise<Portfolio> {
    const strategy = this.strategies.get(exchange);
    if (!strategy) {
      throw new Error(`Unsupported exchange: ${exchange}`);
    }
    
    return strategy.getPortfolio(credentials.apiKey, credentials.secret);
  }
}
```

### Event Processing Pattern
```typescript
// Event sourcing pattern
@Injectable()
export class PortfolioEventHandler {
  constructor(
    private readonly eventStore: EventStore,
    private readonly portfolioRepo: PortfolioRepository,
  ) {}

  @EventsHandler(TransactionCreatedEvent)
  async handle(event: TransactionCreatedEvent): Promise<void> {
    // Store event
    await this.eventStore.append(event);
    
    // Update read model
    const portfolio = await this.portfolioRepo.findById(event.portfolioId);
    portfolio.applyTransaction(event.transaction);
    await this.portfolioRepo.save(portfolio);
    
    // Publish integration event
    await this.eventBus.publish(
      new PortfolioUpdatedEvent(portfolio.id, portfolio.totalValue)
    );
  }
}
```

## 🎨 FRONTEND PATTERNS

### Component Composition
```typescript
// Compound component pattern
export const Portfolio = ({ children, ...props }) => {
  return (
    <PortfolioProvider {...props}>
      <div className="portfolio-container">
        {children}
      </div>
    </PortfolioProvider>
  );
};

Portfolio.Header = ({ children }) => {
  const { portfolio } = usePortfolio();
  return (
    <div className="portfolio-header">
      <h2>{portfolio.name}</h2>
      {children}
    </div>
  );
};

Portfolio.Summary = () => {
  const { portfolio, isLoading } = usePortfolio();
  
  if (isLoading) return <PortfolioSkeleton />;
  
  return (
    <div className="portfolio-summary">
      <div className="total-value">${portfolio.totalValue}</div>
      <div className="daily-change">{portfolio.dailyChange}%</div>
    </div>
  );
};

Portfolio.Assets = () => {
  const { assets } = usePortfolio();
  
  return (
    <div className="portfolio-assets">
      {assets.map(asset => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  );
};

// Usage
<Portfolio portfolioId="123">
  <Portfolio.Header>
    <RefreshButton />
  </Portfolio.Header>
  <Portfolio.Summary />
  <Portfolio.Assets />
</Portfolio>
```

### State Management with Apollo Client
```typescript
// GraphQL with local state
const GET_PORTFOLIO = gql`
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
        totalValue
      }
    }
  }
`;

const UPDATE_PORTFOLIO_CACHE = gql`
  mutation UpdatePortfolioCache($portfolioId: ID!, $updates: PortfolioInput!) {
    updatePortfolioCache(portfolioId: $portfolioId, updates: $updates) @client
  }
`;

// Custom hook with optimistic updates
export const usePortfolio = (portfolioId: string) => {
  const { data, loading, error, subscribeToMore } = useQuery(GET_PORTFOLIO, {
    variables: { id: portfolioId },
    errorPolicy: 'all',
  });

  const [updateCache] = useMutation(UPDATE_PORTFOLIO_CACHE);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: PORTFOLIO_SUBSCRIPTION,
      variables: { portfolioId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        
        return {
          ...prev,
          portfolio: subscriptionData.data.portfolioUpdated,
        };
      },
    });

    return unsubscribe;
  }, [portfolioId, subscribeToMore]);

  return {
    portfolio: data?.portfolio,
    isLoading: loading,
    error,
    updateCache,
  };
};
```

## 📊 MONITORING PATTERNS

### Logging Pattern
```typescript
// Structured logging with context
@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

  logInfo(message: string, context?: Record<string, any>): void {
    this.logger.log({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  logError(error: Error, context?: Record<string, any>): void {
    this.logger.error({
      level: 'error',
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }
}

// Usage with request context
@Injectable()
export class PortfolioService {
  constructor(private readonly logger: LoggerService) {}

  async createPortfolio(data: CreatePortfolioDto, userId: string): Promise<Portfolio> {
    this.logger.logInfo('Creating portfolio', {
      userId,
      portfolioName: data.name,
      operation: 'portfolio.create',
    });

    try {
      const portfolio = await this.portfolioRepo.create({ ...data, userId });
      
      this.logger.logInfo('Portfolio created successfully', {
        portfolioId: portfolio.id,
        userId,
        operation: 'portfolio.create.success',
      });

      return portfolio;
    } catch (error) {
      this.logger.logError(error, {
        userId,
        portfolioName: data.name,
        operation: 'portfolio.create.error',
      });
      throw error;
    }
  }
}
```

### Health Check Pattern
```typescript
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.redis.pingCheck('redis'),
      () => this.exchangeHealthIndicator.isHealthy('binance'),
      () => this.exchangeHealthIndicator.isHealthy('okx'),
    ]);
  }

  @Get('detailed')
  async detailedCheck() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkExchangeAPIs(),
      this.checkDiskSpace(),
      this.checkMemoryUsage(),
    ]);

    return {
      timestamp: new Date().toISOString(),
      status: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'unhealthy',
      checks: checks.map((check, index) => ({
        name: ['database', 'redis', 'exchanges', 'disk', 'memory'][index],
        status: check.status,
        details: check.status === 'fulfilled' ? check.value : check.reason,
      })),
    };
  }
}
```

## 🔧 CONFIGURATION PATTERNS

### Environment Configuration
```typescript
// Configuration validation
export class AppConfig {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  REDIS_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsBoolean()
  ENABLE_SWAGGER: boolean = false;

  @ValidateNested()
  @Type(() => ExchangeConfig)
  EXCHANGES: ExchangeConfig;
}

export class ExchangeConfig {
  @ValidateNested()
  @Type(() => BinanceConfig)
  BINANCE: BinanceConfig;

  @ValidateNested()
  @Type(() => OkxConfig)
  OKX: OkxConfig;
}

// Configuration module
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
  ],
})
export class AppConfigModule {}
```

## 📋 TESTING PATTERNS

### Unit Testing Pattern
```typescript
describe('PortfolioService', () => {
  let service: PortfolioService;
  let mockRepository: jest.Mocked<IPortfolioRepository>;

  beforeEach(async () => {
    const mockRepo = {
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        {
          provide: 'IPortfolioRepository',
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    mockRepository = module.get('IPortfolioRepository');
  });

  describe('createPortfolio', () => {
    it('should create a portfolio successfully', async () => {
      // Arrange
      const createDto = { name: 'Test Portfolio' };
      const userId = 'user-123';
      const expectedPortfolio = { id: 'portfolio-123', name: 'Test Portfolio', userId };

      mockRepository.create.mockResolvedValue(expectedPortfolio);

      // Act
      const result = await service.createPortfolio(createDto, userId);

      // Assert
      expect(result).toEqual(expectedPortfolio);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createDto,
        userId,
      });
    });
  });
});
```

### Integration Testing Pattern
```typescript
describe('Portfolio API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get auth token
    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = authResponse.body.accessToken;
  });

  describe('/portfolios (GET)', () => {
    it('should return user portfolios', async () => {
      return request(app.getHttpServer())
        .get('/portfolios')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

*These system patterns provide the technical foundation and implementation guidelines for all development within the Xela Finance Management System, ensuring consistency, maintainability, and scalability.* 