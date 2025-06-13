# Membership API Documentation

This document outlines the GraphQL API for membership and subscription management using visual flow diagrams.

## API Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        React[⚛️ React Frontend]
        Mobile[📱 Mobile App]
    end
    
    subgraph "API Gateway"
        GraphQL[🔗 GraphQL API]
        Auth[🔐 Authentication]
    end
    
    subgraph "Business Logic"
        Resolvers[📊 Resolvers]
        Services[⚙️ Services]
    end
    
    subgraph "Data Layer"
        Database[(🗄️ Database)]
        Webhooks[📡 External APIs]
    end
    
    React --> GraphQL
    Mobile --> GraphQL
    GraphQL --> Auth
    Auth --> Resolvers
    Resolvers --> Services
    Services --> Database
    Services --> Webhooks
```

## Core API Operations Flow

```mermaid
graph LR
    subgraph "Query Operations"
        Q1[📋 Get Subscriptions]
        Q2[📦 Get Plans]
        Q3[💳 Get Payment Methods]
        Q4[💸 Get Transactions]
    end
    
    subgraph "Mutation Operations"
        M1[🎯 Create Subscription]
        M2[🔄 Update Subscription]
        M3[❌ Cancel Subscription]
        M4[💳 Manage Payment Methods]
    end
    
    subgraph "Subscription Operations"
        S1[🔔 Status Updates]
        S2[💰 Payment Events]
        S3[📅 Renewal Alerts]
    end
    
    Q1 --> M1
    Q2 --> M1
    M1 --> S1
    M2 --> S1
    M3 --> S1
```

## Subscription Management Flow

```mermaid
sequenceDiagram
    participant Client as 📱 Client
    participant API as 🔗 GraphQL API
    participant Auth as 🔐 Auth Service
    participant DB as 🗄️ Database
    participant Paddle as 🏦 Paddle
    
    Note over Client,Paddle: Create Subscription Flow
    
    Client->>API: getMembershipPlans()
    API->>DB: Fetch available plans
    DB->>API: Return plans with pricing
    API->>Client: Plans + features data
    
    Client->>API: createSubscription(planId, provider)
    API->>Auth: Validate user permissions
    Auth->>API: User authorized
    
    alt Paddle Payment
        API->>Paddle: Create checkout session
        Paddle->>API: Return checkout URL
        API->>Client: Checkout session data
        Client->>Paddle: Complete payment
        Paddle->>API: Webhook notification
        API->>DB: Create subscription record
    else MetaMask Payment
        API->>Client: Return crypto payment details
        Client->>Client: Process blockchain transaction
        Client->>API: Submit transaction proof
        API->>DB: Verify & create subscription
    end
    
    API->>Client: Subscription created event
```

## Payment Method Management

```mermaid
graph TD
    A[Get Payment Methods] --> B{Provider Type}
    
    B -->|Paddle| C[Credit Card Methods]
    B -->|MetaMask| D[Wallet Methods]
    
    C --> E[Customer ID Lookup]
    C --> F[Address Information]
    C --> G[Business Information]
    
    D --> H[Wallet Address]
    D --> I[ENS Name Resolution]
    D --> J[Supported Tokens]
    
    E --> K[Unified Response]
    F --> K
    G --> K
    H --> K
    I --> K
    J --> K
```

## Real-time Updates Architecture

```mermaid
graph TB
    subgraph "Event Sources"
        E1[💳 Payment Completed]
        E2[📅 Subscription Created]
        E3[🔄 Status Changed]
        E4[❌ Canceled]
    end
    
    subgraph "GraphQL Subscriptions"
        GQL[🔗 GraphQL Server]
        PubSub[📡 PubSub Engine]
    end
    
    subgraph "Client Connections"
        WS1[🌐 WebSocket 1]
        WS2[🌐 WebSocket 2]
        WS3[🌐 WebSocket N]
    end
    
    E1 --> PubSub
    E2 --> PubSub
    E3 --> PubSub
    E4 --> PubSub
    
    PubSub --> GQL
    GQL --> WS1
    GQL --> WS2
    GQL --> WS3
```

## Error Handling Flow

```mermaid
graph TD
    A[API Request] --> B{Request Valid?}
    
    B -->|❌ No| C[Validation Errors]
    B -->|✅ Yes| D{User Authorized?}
    
    D -->|❌ No| E[Authentication Error]
    D -->|✅ Yes| F{Business Logic Valid?}
    
    F -->|❌ No| G[Business Rule Error]
    F -->|✅ Yes| H[Process Request]
    
    H --> I{External API Success?}
    I -->|❌ No| J[Integration Error]
    I -->|✅ Yes| K[Success Response]
    
    C --> L[Error Response + Field Details]
    E --> M[401 Unauthorized]
    G --> N[400 Business Error + Extensions]
    J --> O[503 Service Error + Retry Info]
    K --> P[200 Success + Data]
```

## GraphQL Schema Overview

```mermaid
graph TB
    subgraph "Core Types"
        User[👤 User]
        Sub[📋 MembershipSubscription]
        Plan[📦 MembershipPlan]
        Price[💰 MembershipPrice]
    end
    
    subgraph "Payment Types"
        PM[💳 PaymentMethod]
        PT[💸 PaymentTransaction]
        Paddle[🏦 PaddlePaymentMethod]
        Meta[🦊 MetaMaskPaymentMethod]
    end
    
    subgraph "Feature Types"
        Feature[⚙️ Feature]
        MF[🔗 MembershipFeature]
    end
    
    subgraph "Utility Types"
        Time[⏰ TimePeriod]
        Unit[💵 UnitPrice]
    end
    
    User --> Sub
    Plan --> Sub
    Plan --> Price
    Plan --> MF
    MF --> Feature
    Price --> Time
    Price --> Unit
    PM --> Paddle
    PM --> Meta
    Sub --> PT
```

## Authentication & Authorization

```mermaid
graph LR
    subgraph "Authentication"
        JWT[🔑 JWT Token]
        Verify[✅ Token Verification]
        Extract[📤 User Extraction]
    end
    
    subgraph "Authorization"
        Perms[🛡️ Permission Check]
        Resource[📋 Resource Access]
        Context[🎯 Context Validation]
    end
    
    JWT --> Verify
    Verify --> Extract
    Extract --> Perms
    Perms --> Resource
    Resource --> Context
```

## Query Performance Optimization

```mermaid
graph TB
    subgraph "Query Strategies"
        Q1[Single Subscription]
        Q2[User Subscriptions]
        Q3[Plan Features]
        Q4[Payment History]
    end
    
    subgraph "Optimization Techniques"
        O1[🎯 Field Selection]
        O2[📊 DataLoader Batching]
        O3[💾 Query Caching]
        O4[🔍 Database Indexes]
    end
    
    subgraph "Performance Metrics"
        M1[⚡ Response Time < 200ms]
        M2[📈 Complexity Score < 100]
        M3[🔢 Query Depth < 5]
    end
    
    Q1 --> O1
    Q2 --> O2
    Q3 --> O3
    Q4 --> O4
    
    O1 --> M1
    O2 --> M2
    O3 --> M1
    O4 --> M3
```

## API Response Patterns

```mermaid
graph TD
    subgraph "Success Responses"
        S1[📋 Single Entity]
        S2[📑 Entity List]
        S3[📊 Paginated Results]
        S4[🔔 Mutation Result]
    end
    
    subgraph "Error Responses"
        E1[❌ GraphQL Errors Array]
        E2[🔍 Field-Level Errors]
        E3[📝 Error Extensions]
        E4[🏷️ Error Categories]
    end
    
    subgraph "Real-time Events"
        R1[🔔 Subscription Events]
        R2[💸 Payment Updates]
        R3[📅 Status Changes]
    end
```

## Integration Points

```mermaid
graph LR
    subgraph "External Services"
        Paddle[🏦 Paddle API]
        Blockchain[🔗 Blockchain]
        Email[📧 Email Service]
    end
    
    subgraph "Internal Services"
        Auth[🔐 Auth Service]
        User[👤 User Service]
        Feature[⚙️ Feature Service]
    end
    
    subgraph "API Gateway"
        GraphQL[🔗 GraphQL API]
    end
    
    Paddle --> GraphQL
    Blockchain --> GraphQL
    Email --> GraphQL
    Auth --> GraphQL
    User --> GraphQL
    Feature --> GraphQL
```

## Rate Limiting & Security

```mermaid
graph TB
    subgraph "Request Processing"
        A[📨 Incoming Request]
        B[🔒 Rate Limit Check]
        C[🔐 Authentication]
        D[🛡️ Authorization]
        E[📊 Query Complexity Analysis]
    end
    
    subgraph "Security Measures"
        F[🚫 IP Blocking]
        G[⏰ Query Timeout]
        H[🎯 Depth Limiting]
        I[📋 Field Whitelisting]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E
    E --> F
    E --> G
    E --> H
    E --> I
``` 