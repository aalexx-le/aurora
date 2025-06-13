# Discount System Architecture

## Overview

The discount system in Xela provides a comprehensive solution for managing promotional offers, free trials, and pricing incentives. It consists of two main layers: the internal membership discount management and the external Paddle payment provider integration.

## System Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[User Interface]
        GQL_CLIENT[GraphQL Client]
    end
    
    subgraph "Backend Layer"
        subgraph "GraphQL API"
            RESOLVER[Discount Resolver]
        end
        
        subgraph "Business Logic"
            DISCOUNT_SERVICE[Membership Discount Service]
            VALIDATION[Discount Validation]
        end
        
        subgraph "Payment Integration"
            PADDLE_SERVICE[Paddle Discount Service]
            PADDLE_API[Paddle API]
        end
        
        subgraph "Data Layer"
            DB[(PostgreSQL Database)]
            ENTITIES[Discount Entities]
        end
    end
    
    UI --> GQL_CLIENT
    GQL_CLIENT --> RESOLVER
    RESOLVER --> DISCOUNT_SERVICE
    DISCOUNT_SERVICE --> VALIDATION
    DISCOUNT_SERVICE --> PADDLE_SERVICE
    PADDLE_SERVICE --> PADDLE_API
    DISCOUNT_SERVICE --> ENTITIES
    ENTITIES --> DB
    
    style UI fill:#e1f5fe
    style RESOLVER fill:#f3e5f5
    style DISCOUNT_SERVICE fill:#e8f5e8
    style PADDLE_SERVICE fill:#fff3e0
    style DB fill:#fce4ec
```

## Core Components

### 1. Discount Types

The system supports three primary discount types:

```mermaid
graph LR
    DISCOUNT_TYPES[Discount Types]
    
    DISCOUNT_TYPES --> PERCENTAGE[Percentage<br/>0.1 = 10% off]
    DISCOUNT_TYPES --> FIXED[Fixed Amount<br/>$10.00 off]
    DISCOUNT_TYPES --> FREE_TRIAL[Free Trial<br/>X billing periods]
    
    style PERCENTAGE fill:#e3f2fd
    style FIXED fill:#f1f8e9
    style FREE_TRIAL fill:#fff8e1
```

### 2. Target Types

Discounts can be targeted to specific user segments:

```mermaid
graph LR
    TARGET_TYPES[Target Types]
    
    TARGET_TYPES --> FIRST_TIME[First Time Users<br/>New customers only]
    TARGET_TYPES --> PRICE_SPECIFIC[Price Specific<br/>Linked to specific plans]
    
    style FIRST_TIME fill:#e8f5e8
    style PRICE_SPECIFIC fill:#f3e5f5
```

## Data Model

```mermaid
erDiagram
    MembershipDiscount {
        string id PK
        string name
        string description
        string code
        enum type
        decimal value
        string currencyCode
        decimal maxAmount
        boolean isActive
        datetime startDate
        datetime endDate
        int maxUses
        int maxUsesPerUser
        int currentUses
        enum targetType
        datetime createdAt
        datetime updatedAt
    }
    
    MembershipDiscountPrice {
        string discountId FK
        string priceId FK
        datetime createdAt
    }
    
    MembershipDiscountUsage {
        string id PK
        string discountId FK
        string userId FK
        string subscriptionId
        decimal discountAmount
        string currencyCode
        datetime usedAt
    }
    
    MembershipPrice {
        string id PK
        string planId FK
        decimal amount
        string currencyCode
    }
    
    User {
        string id PK
        string email
        datetime createdAt
    }
    
    MembershipDiscount ||--o{ MembershipDiscountPrice : "restricts"
    MembershipDiscount ||--o{ MembershipDiscountUsage : "tracks"
    MembershipDiscountPrice }o--|| MembershipPrice : "applies_to"
    MembershipDiscountUsage }o--|| User : "used_by"
```

## Service Layer Architecture

### Membership Discount Service

```mermaid
graph TD
    subgraph "Membership Discount Service"
        CREATE[Create Discount]
        UPDATE[Update Discount]
        VALIDATE[Validate Discount]
        LINK[Link to Prices]
        TRACK[Track Usage]
    end
    
    subgraph "Business Rules"
        USAGE_LIMITS[Usage Limits]
        DATE_VALIDATION[Date Validation]
        USER_ELIGIBILITY[User Eligibility]
        PRICE_RESTRICTIONS[Price Restrictions]
    end
    
    subgraph "External Integration"
        PADDLE_SYNC[Paddle Sync]
        WEBHOOK_HANDLING[Webhook Handling]
    end
    
    CREATE --> USAGE_LIMITS
    CREATE --> PADDLE_SYNC
    UPDATE --> DATE_VALIDATION
    UPDATE --> PADDLE_SYNC
    VALIDATE --> USER_ELIGIBILITY
    VALIDATE --> PRICE_RESTRICTIONS
    LINK --> PRICE_RESTRICTIONS
    TRACK --> USAGE_LIMITS
    
    style CREATE fill:#e8f5e8
    style VALIDATE fill:#fff3e0
    style PADDLE_SYNC fill:#f3e5f5
```

### Paddle Integration Service

```mermaid
graph TD
    subgraph "Paddle Discount Service"
        MAP_DATA[Map DTO to Paddle Format]
        CREATE_PADDLE[Create in Paddle]
        UPDATE_PADDLE[Update in Paddle]
        SYNC_STATUS[Sync Status]
    end
    
    subgraph "Data Transformation"
        TYPE_MAPPING[Type Mapping]
        AMOUNT_FORMATTING[Amount Formatting]
        VALIDATION[Paddle Validation]
    end
    
    subgraph "Error Handling"
        RETRY_LOGIC[Retry Logic]
        ERROR_MAPPING[Error Mapping]
        FALLBACK[Fallback Strategies]
    end
    
    MAP_DATA --> TYPE_MAPPING
    MAP_DATA --> AMOUNT_FORMATTING
    CREATE_PADDLE --> VALIDATION
    CREATE_PADDLE --> RETRY_LOGIC
    UPDATE_PADDLE --> ERROR_MAPPING
    SYNC_STATUS --> FALLBACK
    
    style MAP_DATA fill:#e1f5fe
    style CREATE_PADDLE fill:#f1f8e9
    style ERROR_MAPPING fill:#ffebee
```

## Discount Lifecycle

```mermaid
sequenceDiagram
    participant Admin
    participant GraphQL
    participant DiscountService
    participant PaddleService
    participant Database
    participant PaddleAPI
    
    Admin->>GraphQL: Create Discount Request
    GraphQL->>DiscountService: Process Creation
    DiscountService->>Database: Save Discount
    DiscountService->>PaddleService: Create in Paddle
    PaddleService->>PaddleAPI: API Call
    PaddleAPI-->>PaddleService: Paddle Discount ID
    PaddleService-->>DiscountService: Success Response
    DiscountService->>Database: Update with Paddle ID
    DiscountService-->>GraphQL: Created Discount
    GraphQL-->>Admin: Success Response
```

## Validation Flow

```mermaid
graph TD
    START[User Applies Discount]
    
    subgraph "Validation Checks"
        CODE_EXISTS{Code Exists?}
        IS_ACTIVE{Is Active?}
        DATE_VALID{Date Valid?}
        USAGE_LIMIT{Usage Limit OK?}
        USER_ELIGIBLE{User Eligible?}
        PRICE_MATCH{Price Matches?}
    end
    
    APPLY[Apply Discount]
    REJECT[Reject Application]
    
    START --> CODE_EXISTS
    CODE_EXISTS -->|No| REJECT
    CODE_EXISTS -->|Yes| IS_ACTIVE
    IS_ACTIVE -->|No| REJECT
    IS_ACTIVE -->|Yes| DATE_VALID
    DATE_VALID -->|No| REJECT
    DATE_VALID -->|Yes| USAGE_LIMIT
    USAGE_LIMIT -->|No| REJECT
    USAGE_LIMIT -->|Yes| USER_ELIGIBLE
    USER_ELIGIBLE -->|No| REJECT
    USER_ELIGIBLE -->|Yes| PRICE_MATCH
    PRICE_MATCH -->|No| REJECT
    PRICE_MATCH -->|Yes| APPLY
    
    style APPLY fill:#e8f5e8
    style REJECT fill:#ffebee
```

## GraphQL API Operations

### Core Operations

```mermaid
graph LR
    subgraph "Queries"
        GET_DISCOUNTS[getDiscounts]
        GET_DISCOUNT[getDiscount]
        VALIDATE_CODE[validateDiscountCode]
    end
    
    subgraph "Mutations"
        CREATE[createDiscount]
        UPDATE[updateDiscount]
        DELETE[deleteDiscount]
        LINK[linkDiscountToPrice]
        UNLINK[unlinkDiscountFromPrice]
    end
    
    subgraph "Resolvers"
        USAGE_HISTORY[usageHistory]
        PRICES[prices]
    end
    
    style GET_DISCOUNTS fill:#e3f2fd
    style CREATE fill:#e8f5e8
    style USAGE_HISTORY fill:#f3e5f5
```

## Integration Points

### Frontend Integration

```mermaid
graph TD
    subgraph "User Journey"
        BROWSE[Browse Plans]
        ENTER_CODE[Enter Discount Code]
        VALIDATE[Validate Code]
        APPLY[Apply Discount]
        CHECKOUT[Proceed to Checkout]
    end
    
    subgraph "Admin Journey"
        CREATE_DISCOUNT[Create Discount]
        CONFIGURE[Configure Rules]
        LINK_PRICES[Link to Prices]
        MONITOR[Monitor Usage]
    end
    
    BROWSE --> ENTER_CODE
    ENTER_CODE --> VALIDATE
    VALIDATE --> APPLY
    APPLY --> CHECKOUT
    
    CREATE_DISCOUNT --> CONFIGURE
    CONFIGURE --> LINK_PRICES
    LINK_PRICES --> MONITOR
    
    style VALIDATE fill:#fff3e0
    style APPLY fill:#e8f5e8
    style MONITOR fill:#f3e5f5
```

### Payment Provider Integration

```mermaid
graph LR
    subgraph "Xela System"
        INTERNAL_DISCOUNT[Internal Discount]
        MAPPING[Data Mapping]
    end
    
    subgraph "Paddle System"
        PADDLE_DISCOUNT[Paddle Discount]
        CHECKOUT[Paddle Checkout]
    end
    
    subgraph "Synchronization"
        WEBHOOK[Webhook Events]
        STATUS_SYNC[Status Sync]
    end
    
    INTERNAL_DISCOUNT --> MAPPING
    MAPPING --> PADDLE_DISCOUNT
    PADDLE_DISCOUNT --> CHECKOUT
    CHECKOUT --> WEBHOOK
    WEBHOOK --> STATUS_SYNC
    STATUS_SYNC --> INTERNAL_DISCOUNT
    
    style MAPPING fill:#fff3e0
    style WEBHOOK fill:#f3e5f5
```

## Error Handling Strategy

```mermaid
graph TD
    ERROR[Error Occurs]
    
    subgraph "Error Types"
        VALIDATION_ERROR[Validation Error]
        PADDLE_ERROR[Paddle API Error]
        DATABASE_ERROR[Database Error]
        BUSINESS_ERROR[Business Logic Error]
    end
    
    subgraph "Handling Strategy"
        USER_FRIENDLY[User-Friendly Message]
        RETRY[Retry Logic]
        FALLBACK[Fallback Behavior]
        LOGGING[Error Logging]
    end
    
    ERROR --> VALIDATION_ERROR
    ERROR --> PADDLE_ERROR
    ERROR --> DATABASE_ERROR
    ERROR --> BUSINESS_ERROR
    
    VALIDATION_ERROR --> USER_FRIENDLY
    PADDLE_ERROR --> RETRY
    DATABASE_ERROR --> FALLBACK
    BUSINESS_ERROR --> LOGGING
    
    style ERROR fill:#ffebee
    style USER_FRIENDLY fill:#e8f5e8
    style RETRY fill:#fff3e0
```

## Performance Considerations

## Security Considerations

- **Code Generation**: Secure random code generation to prevent guessing
- **Usage Tracking**: Prevent abuse through usage limits and user restrictions
- **Validation**: Server-side validation for all discount applications
- **Audit Trail**: Complete audit trail for discount usage and modifications

## Monitoring and Analytics

```mermaid
graph TD
    subgraph "Metrics"
        USAGE_RATE[Usage Rate]
        CONVERSION[Conversion Rate]
        REVENUE_IMPACT[Revenue Impact]
        ERROR_RATE[Error Rate]
    end
    
    subgraph "Alerts"
        HIGH_USAGE[High Usage Alert]
        ERROR_SPIKE[Error Spike Alert]
        EXPIRATION[Expiration Alert]
    end
    
    USAGE_RATE --> HIGH_USAGE
    ERROR_RATE --> ERROR_SPIKE
    CONVERSION --> EXPIRATION
    
    style USAGE_RATE fill:#e8f5e8
    style ERROR_SPIKE fill:#ffebee
    style EXPIRATION fill:#fff3e0
```

## Future Enhancements

- **A/B Testing**: Support for discount A/B testing
- **Dynamic Pricing**: Real-time discount adjustments
- **Referral Integration**: Integration with referral systems
- **Advanced Targeting**: ML-based user targeting
- **Bulk Operations**: Bulk discount management tools 