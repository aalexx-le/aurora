# Portfolio Creation Technical Implementation Guide

## Overview

This guide provides detailed technical implementation details for developers working on the crypto portfolio creation feature in Xela Finance Management System.

## Service Architecture

### 1. Frontend Service

#### Key Components

**CreatePortfolioDialog.tsx**
- Main entry point for portfolio creation
- Handles form validation and submission
- Dynamically shows exchange-specific guides

**getPortfolioForm.tsx**
- Renders form fields
- Conditionally shows passphrase field based on exchange
- Implements field validation

**useCreatePortfolio.ts**
- Custom hook for portfolio creation mutation
- Handles cache updates and refetching

**CreateExecutionSteps.tsx**
- Displays real-time progress updates
- Manages error recovery UI
- Handles retry and credential update flows

#### State Management

```typescript
// Apollo Client cache updates
const [createPortfolio] = useMutation(CREATE_CRYPTO_PORTFOLIO, {
  awaitRefetchQueries: true,
  refetchQueries: [
    GET_CRYPTO_PORTFOLIOS,
    GET_CREATE_PORTFOLIO_EXECUTIONS,
  ],
});
```

### 2. Backend Service

#### Key Modules

**CryptoPortfolioResolver**
- GraphQL resolver for portfolio operations
- Handles authentication via @AuthUser decorator
- Manages subscriptions for real-time updates

**CryptoPortfolioService**
- Core business logic for portfolio creation
- Handles credential encryption
- Manages Kafka message emission

**EncryptionService**
- AES-256-GCM encryption for API credentials
- Secure key management
- Decryption for service communication

#### Kafka Integration

```typescript
// Topic definitions
export enum KafkaTopic {
  CREATE_CRYPTO_PORTFOLIO = 'create-crypto-portfolio',
  RETRY_CRYPTO_PORTFOLIO = 'retry-crypto-portfolio',
  UPDATE_CRYPTO_PORTFOLIO_CREDENTIALS = 'update-crypto-portfolio-credentials',
}

// Message structure
interface CreatePortfolioMessage {
  userId: number;
  executionId: number;
  name?: string;
  exchanges: string;
  apiKey: string;      // Encrypted
  secretKey: string;   // Encrypted
  passphrase?: string; // Encrypted
}
```

### 3. Crypto Portfolio Service

#### Core Services

**PortfolioCreationService**
- Main workflow orchestrator
- Manages step-by-step execution
- Handles error recovery

**PortfolioExchangeService**
- CCXT library integration
- Exchange-specific configurations
- Connection testing and validation

**PortfolioProgressService**
- Progress tracking and updates
- Database operations
- Event emission for real-time updates

## Implementation Details

### 1. Exchange Support Validation

```typescript
// Check if exchange is supported
private isExchangeSupported(exchangeId: string): boolean {
  const ccxt = require('ccxt');
  return exchangeId in ccxt.exchanges;
}

// Validate exchange capabilities
private async validateExchange(exchangeId: string): Promise<void> {
  if (!this.isExchangeSupported(exchangeId)) {
    throw new Error(`Exchange '${exchangeId}' is not supported`);
  }
  
  const exchange = new ccxt[exchangeId]();
  if (!exchange.has.fetchBalance) {
    throw new Error(`Exchange '${exchangeId}' does not support balance fetching`);
  }
}
```

### 2. Credential Management

```typescript
// Encryption (Backend)
async encryptApiKey(plainText: string): Promise<string> {
  const algorithm = 'aes-256-gcm';
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

// Decryption (Crypto Portfolio Service)
async decryptApiKey(encryptedText: string): Promise<string> {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### 3. Exchange Connection Testing

```typescript
async testExchangeConnection(
  exchangeId: string,
  credentials: ExchangeCredentials
): Promise<boolean> {
  try {
    const ccxt = require('ccxt');
    const ExchangeClass = ccxt[exchangeId];
    
    const exchange = new ExchangeClass({
      apiKey: credentials.apiKey,
      secret: credentials.secretKey,
      password: credentials.passphrase,
      enableRateLimit: true,
      options: {
        defaultType: 'spot',
      },
    });
    
    // Test API connection
    await exchange.checkRequiredCredentials();
    
    // Test balance fetching permission
    const balances = await exchange.fetchBalance();
    
    return true;
  } catch (error) {
    this.logger.error(`Connection test failed: ${error.message}`);
    return false;
  }
}
```

### 4. Balance Processing

```typescript
async fetchBalances(
  exchangeId: string,
  credentials: ExchangeCredentials
): Promise<Balance[]> {
  const exchange = this.createExchangeInstance(exchangeId, credentials);
  
  // Fetch raw balances
  const rawBalances = await exchange.fetchBalance();
  
  // Process and filter balances
  const processedBalances = [];
  
  for (const [symbol, balance] of Object.entries(rawBalances.total)) {
    if (balance > 0) {
      processedBalances.push({
        symbol,
        free: rawBalances.free[symbol] || 0,
        used: rawBalances.used[symbol] || 0,
        total: balance,
      });
    }
  }
  
  return processedBalances;
}
```

### 5. Progress Tracking

```typescript
// Update progress with milestone tracking
async updateProgress(updates: ProgressUpdate): Promise<void> {
  const { executionId, step, milestone, status, error } = updates;
  
  // Calculate progress percentage
  const progressPercent = this.calculateProgressPercent(milestone);
  
  // Update database
  const execution = await this.prisma.createPortfolioExecution.update({
    where: { id: executionId },
    data: {
      currentStep: step,
      currentMilestone: milestone,
      progressPercent,
      errorMessage: error?.message,
      recoveryAction: error ? this.determineRecoveryAction(error) : null,
      updatedAt: new Date(),
    },
  });
  
  // Emit progress event
  await this.emitProgressEvent(execution);
}

// Progress calculation
private calculateProgressPercent(milestone: PortfolioCreationMilestone): number {
  const milestoneProgress = {
    INITIALIZED: 0,
    CREDENTIALS_VERIFIED: 20,
    EXCHANGE_CONNECTED: 40,
    BALANCES_FETCHED: 60,
    PORTFOLIO_STORED: 80,
    COMPLETED: 100,
  };
  
  return milestoneProgress[milestone] || 0;
}
```

### 6. Error Recovery Implementation

```typescript
// Determine recovery action based on error type
private determineRecoveryAction(error: any): ErrorRecoveryAction {
  const errorMessage = error.message?.toLowerCase() || '';
  
  if (errorMessage.includes('invalid api key') || 
      errorMessage.includes('authentication failed')) {
    return ErrorRecoveryAction.UPDATE_CREDENTIALS;
  }
  
  if (errorMessage.includes('rate limit')) {
    return ErrorRecoveryAction.WAIT_RATE_LIMIT;
  }
  
  if (errorMessage.includes('insufficient permissions') ||
      errorMessage.includes('api permissions')) {
    return ErrorRecoveryAction.CHECK_PERMISSIONS;
  }
  
  if (errorMessage.includes('network') || 
      errorMessage.includes('timeout')) {
    return ErrorRecoveryAction.RETRY_AUTOMATIC;
  }
  
  // Default to manual retry for unknown errors
  return ErrorRecoveryAction.RETRY_MANUAL;
}

// Retry with exponential backoff
async retryWithBackoff(
  executionId: number,
  operation: () => Promise<any>,
  maxRetries: number = 3
): Promise<any> {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Calculate backoff delay
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      
      this.logger.warn(
        `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`
      );
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

## Database Operations

### 1. Portfolio Creation

```typescript
async createPortfolio(portfolioData: PortfolioData): Promise<string> {
  // Check for existing parent portfolio (for aggregation)
  let parentPortfolio = await this.prisma.cryptoPortfolio.findFirst({
    where: {
      userId: portfolioData.userId,
      exchanges: Exchanges.ALL,
    },
  });
  
  // Create parent if doesn't exist
  if (!parentPortfolio) {
    parentPortfolio = await this.prisma.cryptoPortfolio.create({
      data: {
        userId: portfolioData.userId,
        name: "All Portfolios",
        exchanges: Exchanges.ALL,
        tradingType: TradingType.SPOT,
        apiKey: "AGGREGATED",
        secretKey: "AGGREGATED",
      },
    });
  }
  
  // Create actual portfolio
  const portfolio = await this.prisma.cryptoPortfolio.create({
    data: {
      userId: portfolioData.userId,
      name: portfolioData.name,
      exchanges: portfolioData.exchanges,
      tradingType: TradingType.SPOT,
      apiKey: portfolioData.apiKey,
      secretKey: portfolioData.secretKey,
      parentPortfolioId: parentPortfolio.id,
    },
  });
  
  // Create passphrase record if needed
  if (portfolioData.passphrase) {
    await this.prisma.passphraseCryptoPortfolio.create({
      data: {
        cryptoPortfolioId: portfolio.id,
        passphrase: portfolioData.passphrase,
      },
    });
  }
  
  return portfolio.id;
}
```

### 2. Asset Balance Upsert

```typescript
async upsertAssetBalances(
  portfolioId: string,
  balances: AssetBalanceData[]
): Promise<void> {
  // Use transaction for consistency
  await this.prisma.$transaction(async (tx) => {
    // Delete existing balances
    await tx.assetBalance.deleteMany({
      where: { cryptoPortfolioId: portfolioId },
    });
    
    // Insert new balances
    await tx.assetBalance.createMany({
      data: balances.map(balance => ({
        cryptoPortfolioId: portfolioId,
        assetInfoId: balance.assetInfoId,
        balance: balance.balance,
        locked: balance.locked,
      })),
    });
    
    // Update portfolio update time
    await tx.cryptoPortfolio.update({
      where: { id: portfolioId },
      data: { updateTime: new Date() },
    });
  });
}
```

## Testing Strategies

### 1. Unit Tests

```typescript
describe('PortfolioCreationService', () => {
  let service: PortfolioCreationService;
  let mockExchangeService: jest.Mocked<PortfolioExchangeService>;
  
  beforeEach(() => {
    mockExchangeService = createMock<PortfolioExchangeService>();
    service = new PortfolioCreationService(mockExchangeService, ...);
  });
  
  describe('validateExchange', () => {
    it('should validate supported exchange', async () => {
      mockExchangeService.isExchangeSupported.mockReturnValue(true);
      mockExchangeService.getExchangeInfo.mockReturnValue({
        hasBalance: true,
      });
      
      await expect(service.validateExchange('binance'))
        .resolves.not.toThrow();
    });
    
    it('should reject unsupported exchange', async () => {
      mockExchangeService.isExchangeSupported.mockReturnValue(false);
      
      await expect(service.validateExchange('invalid'))
        .rejects.toThrow('not supported');
    });
  });
});
```

### 2. Integration Tests

```typescript
describe('Portfolio Creation E2E', () => {
  it('should create portfolio successfully', async () => {
    // Create portfolio
    const result = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: CREATE_CRYPTO_PORTFOLIO,
        variables: {
          data: {
            name: 'Test Portfolio',
            exchanges: 'BINANCE',
            apiKey: 'test-key',
            secretKey: 'test-secret',
          },
        },
      });
    
    expect(result.body.data.createCryptoPortfolio).toBeDefined();
    
    // Wait for completion
    await waitForExpect(async () => {
      const execution = await getExecution(executionId);
      expect(execution.currentMilestone).toBe('COMPLETED');
    }, 30000);
  });
});
```

## Performance Considerations

### 1. Batch Processing

- Process multiple balances in batches to avoid memory issues
- Use database transactions for consistency
- Implement pagination for large portfolios

### 2. Caching Strategy

```typescript
// Cache exchange capabilities
private exchangeCapabilitiesCache = new Map<string, ExchangeCapabilities>();

// Cache asset info lookups
private assetInfoCache = new LRUCache<string, string>({
  max: 1000,
  ttl: 1000 * 60 * 60, // 1 hour
});
```

### 3. Rate Limiting

```typescript
// Implement rate limiting per exchange
private rateLimiters = new Map<string, RateLimiter>();

async executeWithRateLimit(
  exchangeId: string,
  operation: () => Promise<any>
): Promise<any> {
  const limiter = this.getRateLimiter(exchangeId);
  await limiter.removeTokens(1);
  return operation();
}
```

## Security Best Practices

1. **Never log sensitive data**
   - Mask API keys in logs
   - Use structured logging with sensitive field filtering

2. **Validate all inputs**
   - Sanitize exchange names
   - Validate credential formats
   - Check for SQL injection in portfolio names

3. **Implement request signing**
   - Sign Kafka messages
   - Verify message integrity

4. **Use secure communication**
   - TLS for all service communication
   - Encrypted Kafka topics

## Monitoring and Alerting

### Key Metrics

1. **Portfolio Creation Success Rate**
   ```typescript
   @Counter('portfolio_creation_total')
   @Counter('portfolio_creation_success')
   @Counter('portfolio_creation_failure')
   ```

2. **Step Duration Tracking**
   ```typescript
   @Histogram('portfolio_creation_step_duration', ['step'])
   ```

3. **Exchange API Latency**
   ```typescript
   @Histogram('exchange_api_latency', ['exchange', 'operation'])
   ```

### Alert Conditions

- Portfolio creation failure rate > 10%
- Average creation time > 30 seconds
- Exchange API errors > 5 per minute
- Encryption/decryption failures

## Troubleshooting Guide

### Common Issues

1. **"Invalid API Key" Error**
   - Check encryption/decryption process
   - Verify credentials in database
   - Test with exchange's API directly

2. **"Rate Limit Exceeded"**
   - Check rate limiter configuration
   - Implement exponential backoff
   - Consider using exchange's WebSocket API

3. **"Connection Timeout"**
   - Check network connectivity
   - Verify exchange API status
   - Increase timeout values

4. **"Insufficient Permissions"**
   - Guide user to check API permissions
   - Provide exchange-specific permission requirements
   - Test with minimal permission set 