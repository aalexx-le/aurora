# Crypto Portfolio Creation Flow

## Overview

The crypto portfolio creation process in Xela Finance Management System is a sophisticated multi-service architecture that handles secure API credential management, real-time portfolio synchronization, and comprehensive error recovery. This document details the complete flow from user interface to data persistence.

## Architecture Overview

The portfolio creation system consists of three main components:

1. **Frontend (Next.js/React)** - User interface and state management
2. **Backend (NestJS/GraphQL)** - API gateway and credential encryption
3. **Crypto Portfolio Service (NestJS/Kafka)** - Portfolio synchronization engine

```mermaid
graph TD
    subgraph "Frontend"
        UI[Portfolio Creation Dialog]
        GQL[GraphQL Client]
        SUB[WebSocket Subscription]
    end
    
    subgraph "Backend"
        RESOLVER[GraphQL Resolver]
        SERVICE[Portfolio Service]
        ENCRYPT[Encryption Service]
        KAFKA_PRODUCER[Kafka Producer]
    end
    
    subgraph "Crypto Portfolio Service"
        KAFKA_CONSUMER[Kafka Consumer]
        PORTFOLIO_SERVICE[Portfolio Creation Service]
        EXCHANGE_SERVICE[Exchange Service]
        PROGRESS_SERVICE[Progress Service]
        CCXT[CCXT Library]
    end
    
    subgraph "Database"
        DB[(PostgreSQL)]
    end
    
    UI --> GQL
    GQL --> RESOLVER
    RESOLVER --> SERVICE
    SERVICE --> ENCRYPT
    SERVICE --> KAFKA_PRODUCER
    KAFKA_PRODUCER -->|CREATE_CRYPTO_PORTFOLIO| KAFKA_CONSUMER
    KAFKA_CONSUMER --> PORTFOLIO_SERVICE
    PORTFOLIO_SERVICE --> EXCHANGE_SERVICE
    EXCHANGE_SERVICE --> CCXT
    PORTFOLIO_SERVICE --> PROGRESS_SERVICE
    PROGRESS_SERVICE --> DB
    PROGRESS_SERVICE -->|Progress Updates| KAFKA_PRODUCER
    KAFKA_PRODUCER -->|onCreatePortfolioExecution| SUB
    SUB --> UI
```

## Portfolio Creation Steps and Milestones

### Complete Execution Flow

```mermaid
graph TD
    Start([Portfolio Creation Started]) --> Init[INITIALIZED<br/>0%]
    
    %% VALIDATION STEP
    Init --> V_Start[VALIDATION Step Started]
    V_Start --> V_Process{Exchange<br/>Validation}
    V_Process -->|Success| V_Success[CREDENTIALS_VERIFIED<br/>20%]
    V_Process -->|Failure| V_Fail[VALIDATION_FAILED<br/>Error State]
    
    %% AUTHENTICATION STEP
    V_Success --> A_Start[AUTHENTICATION Step Started]
    A_Start --> A_Decrypt{Credential<br/>Decryption}
    A_Decrypt -->|Success| A_Test{Connection<br/>Test}
    A_Decrypt -->|Failure| A_Fail_Cred[CREDENTIALS_FAILED<br/>Error State]
    A_Test -->|Success| A_Success[EXCHANGE_CONNECTED<br/>40%]
    A_Test -->|Auth Failure| A_Fail_Cred
    A_Test -->|Connection Failure| A_Fail_Conn[CONNECTION_FAILED<br/>Error State]
    A_Test -->|Permissions| A_Fail_Perm[INSUFFICIENT_PERMISSIONS<br/>Error State]
    
    %% BALANCE_RETRIEVAL STEP
    A_Success --> B_Start[BALANCE_RETRIEVAL Step Started]
    B_Start --> B_Fetch{Fetch<br/>Balances}
    B_Fetch -->|Success| B_Process{Process<br/>Balance Data}
    B_Fetch -->|Rate Limited| B_Fail_Rate[RATE_LIMITED<br/>Error State]
    B_Fetch -->|API Error| B_Fail_Fetch[FETCH_FAILED<br/>Error State]
    B_Process -->|Success| B_Success[BALANCES_FETCHED<br/>60%]
    B_Process -->|Failure| B_Fail_Fetch
    
    %% DATABASE_STORAGE STEP
    B_Success --> D_Start[DATABASE_STORAGE Step Started]
    D_Start --> D_Portfolio{Create<br/>Portfolio}
    D_Portfolio -->|Success| D_Balances{Store<br/>Balances}
    D_Portfolio -->|Failure| D_Fail[STORAGE_FAILED<br/>Error State]
    D_Balances -->|Success| D_Success[PORTFOLIO_STORED<br/>80%]
    D_Balances -->|Failure| D_Fail
    
    %% COMPLETION STEP
    D_Success --> C_Start[COMPLETION Step Started]
    C_Start --> C_Final{Finalize<br/>Setup}
    C_Final -->|Success| C_Success[COMPLETED<br/>100%]
    C_Final -->|Failure| C_Fail[FAILED<br/>Error State]
    
    %% Error Recovery Paths
    V_Fail --> Recovery1[Recovery Actions<br/>• RETRY_MANUAL<br/>• CONTACT_SUPPORT]
    A_Fail_Cred --> Recovery2[Recovery Actions<br/>• UPDATE_CREDENTIALS<br/>• RETRY_MANUAL]
    A_Fail_Conn --> Recovery3[Recovery Actions<br/>• RETRY_AUTOMATIC<br/>• CHECK_PERMISSIONS]
    A_Fail_Perm --> Recovery4[Recovery Actions<br/>• CHECK_PERMISSIONS<br/>• CONTACT_SUPPORT]
    B_Fail_Rate --> Recovery5[Recovery Actions<br/>• WAIT_RATE_LIMIT<br/>• RETRY_AUTOMATIC]
    B_Fail_Fetch --> Recovery6[Recovery Actions<br/>• RETRY_AUTOMATIC<br/>• RETRY_MANUAL]
    D_Fail --> Recovery7[Recovery Actions<br/>• RETRY_AUTOMATIC<br/>• CONTACT_SUPPORT]
    C_Fail --> Recovery8[Recovery Actions<br/>• RETRY_MANUAL<br/>• CONTACT_SUPPORT]
    
    %% Retry Paths
    Recovery1 -.->|Retry| V_Start
    Recovery2 -.->|New Credentials| A_Start
    Recovery3 -.->|Retry| A_Start
    Recovery4 -.->|Fix Permissions| A_Start
    Recovery5 -.->|After Rate Limit| B_Start
    Recovery6 -.->|Retry| B_Start
    Recovery7 -.->|Retry| D_Start
    Recovery8 -.->|Retry| C_Start
    
    %% Styling
    classDef successState fill:#d4edda,stroke:#155724,color:#155724
    classDef errorState fill:#f8d7da,stroke:#721c24,color:#721c24
    classDef processState fill:#cce5ff,stroke:#004085,color:#004085
    classDef recoveryState fill:#fff3cd,stroke:#856404,color:#856404
    
    class Init,V_Success,A_Success,B_Success,D_Success,C_Success successState
    class V_Fail,A_Fail_Cred,A_Fail_Conn,A_Fail_Perm,B_Fail_Rate,B_Fail_Fetch,D_Fail,C_Fail errorState
    class V_Start,A_Start,B_Start,D_Start,C_Start,V_Process,A_Decrypt,A_Test,B_Fetch,B_Process,D_Portfolio,D_Balances,C_Final processState
    class Recovery1,Recovery2,Recovery3,Recovery4,Recovery5,Recovery6,Recovery7,Recovery8 recoveryState
```

### Step and Milestone Mapping

| Step | Success Milestone | Error Milestones | Progress % |
|------|------------------|------------------|------------|
| `VALIDATION` | `CREDENTIALS_VERIFIED` | `VALIDATION_FAILED` | 0% → 20% |
| `AUTHENTICATION` | `EXCHANGE_CONNECTED` | `CREDENTIALS_FAILED`<br/>`CONNECTION_FAILED`<br/>`INSUFFICIENT_PERMISSIONS` | 20% → 40% |
| `BALANCE_RETRIEVAL` | `BALANCES_FETCHED` | `FETCH_FAILED`<br/>`RATE_LIMITED` | 40% → 60% |
| `DATABASE_STORAGE` | `PORTFOLIO_STORED` | `STORAGE_FAILED` | 60% → 80% |
| `COMPLETION` | `COMPLETED` | `FAILED`<br/>`TIMEOUT_FAILED` | 80% → 100% |

### Error Recovery Action Mapping

```mermaid
graph LR
    subgraph "Error Types"
        E1[VALIDATION_FAILED]
        E2[CREDENTIALS_FAILED]
        E3[CONNECTION_FAILED]
        E4[INSUFFICIENT_PERMISSIONS]
        E5[FETCH_FAILED]
        E6[RATE_LIMITED]
        E7[STORAGE_FAILED]
        E8[TIMEOUT_FAILED]
        E9[FAILED]
    end
    
    subgraph "Recovery Actions"
        R1[RETRY_AUTOMATIC]
        R2[RETRY_MANUAL]
        R3[UPDATE_CREDENTIALS]
        R4[WAIT_RATE_LIMIT]
        R5[CHECK_PERMISSIONS]
        R6[CONTACT_SUPPORT]
        R7[ABORT]
    end
    
    E1 --> R2
    E1 --> R6
    E2 --> R3
    E2 --> R2
    E3 --> R1
    E3 --> R5
    E4 --> R5
    E4 --> R6
    E5 --> R1
    E5 --> R2
    E6 --> R4
    E6 --> R1
    E7 --> R1
    E7 --> R6
    E8 --> R2
    E8 --> R6
    E9 --> R2
    E9 --> R6
    
    %% Styling
    classDef errorClass fill:#f8d7da,stroke:#721c24,color:#721c24
    classDef recoveryClass fill:#fff3cd,stroke:#856404,color:#856404
    
    class E1,E2,E3,E4,E5,E6,E7,E8,E9 errorClass
    class R1,R2,R3,R4,R5,R6,R7 recoveryClass
```

## Data Flow

### 1. User Input (Frontend)

The user initiates portfolio creation through the portfolio creation dialog by providing:
- **Portfolio Name** (optional): Custom name for the portfolio
- **Exchange Selection**: Choose from 100+ supported exchanges
- **API Credentials**: API key, secret key, and passphrase (if required)
- **Form Validation**: Real-time validation ensures all required fields are completed

### 2. GraphQL Mutation

The frontend sends a GraphQL mutation to create the portfolio, which includes all the user-provided credentials and configuration.

### 3. Backend Processing

#### 3.1 GraphQL Resolver
The GraphQL resolver receives the portfolio creation request and delegates processing to the portfolio service.

#### 3.2 Portfolio Service Operations
The backend service performs several critical operations:

1. **Passphrase Validation**: Validates that passphrase is provided for exchanges that require it (OKX, Coinbase, KuCoin, Bitget)
2. **Credential Encryption**: Encrypts all sensitive credentials using AES-256-GCM encryption
3. **Execution Record Creation**: Creates a tracking record to monitor portfolio creation progress
4. **Kafka Message Emission**: Sends encrypted credentials to the crypto-portfolio-service for processing

### 4. Crypto Portfolio Service Processing

The crypto-portfolio-service handles the actual portfolio creation through five well-defined steps:

#### 4.1 Portfolio Creation Steps

The service processes portfolio creation through these sequential steps:
- **VALIDATION**: Validate exchange support and capabilities
- **AUTHENTICATION**: Test API credentials and connection
- **BALANCE_RETRIEVAL**: Fetch account balances from exchange
- **DATABASE_STORAGE**: Store portfolio data and balances
- **COMPLETION**: Mark as complete and notify frontend

#### 4.2 Step-by-Step Processing

1. **VALIDATION Step**
   - Validates exchange is supported by CCXT library
   - Checks exchange has balance fetching capability
   - Updates progress: `INITIALIZED → CREDENTIALS_VERIFIED`

2. **AUTHENTICATION Step**
   - Decrypts API credentials securely
   - Tests connection to exchange API
   - Verifies API permissions are sufficient
   - Updates progress: `CREDENTIALS_VERIFIED → EXCHANGE_CONNECTED`

3. **BALANCE_RETRIEVAL Step**
   - Fetches all account balances from exchange
   - Processes and validates balance data
   - Creates or finds AssetInfo records for each cryptocurrency
   - Updates progress: `EXCHANGE_CONNECTED → BALANCES_FETCHED`

4. **DATABASE_STORAGE Step**
   - Creates CryptoPortfolio record with encrypted credentials
   - Stores all asset balances in the database
   - Links portfolio to user account
   - Updates progress: `BALANCES_FETCHED → PORTFOLIO_STORED`

5. **COMPLETION Step**
   - Marks execution as successful
   - Emits completion event for real-time updates
   - Updates progress: `PORTFOLIO_STORED → COMPLETED`

### 5. Real-time Progress Updates

The system provides real-time progress updates through GraphQL subscriptions, allowing the frontend to display live progress indicators and error recovery options to users.

Progress milestones track the completion percentage:
- `INITIALIZED` (0%)
- `CREDENTIALS_VERIFIED` (20%)
- `EXCHANGE_CONNECTED` (40%)
- `BALANCES_FETCHED` (60%)
- `PORTFOLIO_STORED` (80%)
- `COMPLETED` (100%)

## Error Handling and Recovery

### Error Recovery Actions

The system provides sophisticated error recovery mechanisms:

```typescript
enum ErrorRecoveryAction {
  RETRY_AUTOMATIC,        // System will retry automatically
  RETRY_MANUAL,          // User can trigger retry
  UPDATE_CREDENTIALS,    // User needs to update API credentials
  WAIT_RATE_LIMIT,      // Wait for rate limit to reset
  CHECK_PERMISSIONS,    // User needs to check API permissions
  CONTACT_SUPPORT,      // Unrecoverable error
  ABORT                 // User can abort the process
}
```

### Error Recovery Flow

1. **Automatic Retry**
   - For transient errors (network, temporary API issues)
   - Maximum 3 retry attempts
   - Exponential backoff between retries

2. **Manual Retry**
   ```graphql
   mutation RetryPortfolioCreation($executionId: Int!) {
     retryPortfolioCreation(executionId: $executionId) {
       id
       currentMilestone
     }
   }
   ```

3. **Update Credentials**
   ```graphql
   mutation UpdatePortfolioCredentials($executionId: Int!, $credentials: UpdateCredentialsInput!) {
     updatePortfolioCredentials(executionId: $executionId, credentials: $credentials) {
       id
       currentMilestone
     }
   }
   ```

4. **Support Ticket**
   ```graphql
   mutation CreateSupportTicket($data: CreateSupportTicketInput!) {
     createSupportTicket(data: $data)
   }
   ```

## Database Schema

### Core Tables

1. **CryptoPortfolio**
   - Stores portfolio configuration and encrypted credentials
   - Links to user and exchange
   - Supports portfolio aggregation (parent/child relationships)

2. **CreatePortfolioExecution**
   - Tracks portfolio creation progress
   - Stores execution context for retry operations
   - Records error information and recovery actions

3. **AssetBalance**
   - Stores current balance for each asset
   - Links to AssetInfo and CryptoPortfolio

4. **AssetInfo**
   - Master list of all cryptocurrency assets
   - Stores symbol, name, logo, and metadata

## Security Considerations

1. **Credential Encryption**
   - All API credentials are encrypted using AES-256-GCM
   - Encryption keys are stored securely in environment variables
   - Credentials are never logged or exposed in plain text

2. **API Permission Validation**
   - System only requires read-only permissions
   - Validates permissions during authentication step
   - Provides clear guidance for API key creation

3. **Rate Limiting**
   - Respects exchange rate limits
   - Implements exponential backoff for retries
   - Tracks rate limit errors for user notification

## Exchange-Specific Considerations

### Passphrase Requirements

The following exchanges require an additional passphrase:
- OKX
- Coinbase (Pro/Advanced Trade)
- KuCoin
- Bitget

The UI dynamically shows/hides the passphrase field based on the selected exchange.

### Exchange Guides

The system provides comprehensive setup guides for 20+ major exchanges, including:
- Step-by-step API key creation instructions
- Required permissions checklist
- Direct links to exchange API settings
- Security best practices

## Performance Optimizations

1. **Asynchronous Processing**
   - Portfolio creation is handled asynchronously via Kafka
   - UI remains responsive during long-running operations

2. **Batch Operations**
   - Asset balances are upserted in batch
   - Reduces database round trips

3. **Caching**
   - AssetInfo records are cached to avoid duplicate lookups
   - Exchange capabilities are cached in memory

## Monitoring and Logging

The system provides comprehensive logging at each step:
- Execution start/completion
- Step transitions
- Error details with stack traces
- Performance metrics

Example log flow:
```
🚀 Creating portfolio for user 123, execution 456, exchange binance
🔍 Validating exchange: binance
✅ Exchange binance is supported and has balance capability
🔓 Decrypting exchange credentials...
✅ Credentials decrypted successfully
🔌 Testing connection to binance...
✅ Successfully connected to binance
💰 Fetching account balances from binance...
✅ Fetched 15 balances from binance
📊 Processing 15 balances...
✅ Processed 15 balances successfully
💾 Creating portfolio record...
✅ Portfolio record created with ID: uuid-123
💰 Storing 15 asset balances...
✅ Asset balances stored successfully
✅ Portfolio creation successful: uuid-123
```