# Membership & Payment Flow

This document outlines the comprehensive flow of payment processing and subscription management using visual diagrams.

## System Overview

```mermaid
graph TB
    subgraph "Payment Providers"
        Paddle[🏦 Paddle<br/>Traditional Cards]
        MetaMask[🦊 MetaMask<br/>Crypto Payments]
    end
    
    subgraph "Core System"
        API[🔗 GraphQL API]
        DB[(🗄️ Database)]
        Webhooks[📡 Webhooks]
    end
    
    subgraph "Frontend"
        React[⚛️ React App]
        Forms[📝 Subscription Forms]
        Wallet[👛 Wallet Connection]
    end
    
    Paddle --> Webhooks
    MetaMask --> API
    Webhooks --> DB
    API --> DB
    React --> API
    Forms --> Paddle
    Wallet --> MetaMask
```

## Subscription Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Pending : User selects plan
    Pending --> Trialing : Trial starts
    Pending --> Active : Immediate payment
    Pending --> Failed : Payment fails
    
    Trialing --> Active : Trial converts
    Trialing --> Canceled : User cancels
    Trialing --> Past_Due : Payment fails
    
    Active --> Past_Due : Payment fails
    Active --> Canceled : User cancels
    Active --> Paused : User pauses
    
    Past_Due --> Active : Payment recovered
    Past_Due --> Canceled : Grace expires (7-14 days)
    
    Paused --> Active : User resumes
    Paused --> Canceled : User cancels
    
    Canceled --> [*] : Subscription ends
    Failed --> [*] : Cleanup
```

## Payment Processing Flows

### Paddle Flow (Traditional)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant P as Paddle
    participant W as Webhook
    participant API as Backend API
    participant DB as Database
    
    U->>F: Select plan & payment
    F->>P: Initialize checkout
    P->>U: Payment form
    U->>P: Submit payment
    P->>W: Transaction webhook
    W->>API: Process event
    API->>DB: Update subscription
    API->>F: Notify via GraphQL
    F->>U: Success confirmation
```

### MetaMask Flow (Crypto)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant M as MetaMask
    participant BC as Blockchain
    participant API as Backend
    participant DB as Database
    
    U->>F: Select crypto payment
    F->>M: Request connection
    M->>U: Approve connection
    F->>API: Calculate crypto price
    API->>F: Return amount
    F->>M: Request transaction
    M->>U: Confirm transaction
    U->>BC: Sign & send
    BC->>API: Transaction confirmed
    API->>DB: Create subscription
    API->>F: Success notification
```

## Webhook Event Processing

```mermaid
flowchart TD
    A[📨 Webhook Received] --> B{Valid Signature?}
    B -->|❌| C[🚫 Return 400]
    B -->|✅| D[📤 Extract Event Data]
    
    D --> E{User ID Present?}
    E -->|❌| F[📝 Log & Return 200]
    E -->|✅| G[🔄 Process Event Type]
    
    G --> H[💳 Transaction Completed]
    G --> I[📅 Subscription Created]  
    G --> J[📝 Subscription Updated]
    G --> K[❌ Subscription Canceled]
    G --> L[⏰ Subscription Past Due]
    
    H --> M[💾 Store Payment Data]
    I --> N[🎯 Activate Subscription]
    J --> O[🔄 Update Details]
    K --> P[🛑 Mark Canceled]
    L --> Q[⚠️ Mark Past Due]
    
    M --> R[🔔 Notify Frontend]
    N --> R
    O --> R
    P --> R
    Q --> R
```

## Error Handling Matrix

```mermaid
graph TD
    subgraph "Payment Errors"
        PE1[Card Declined] --> R1[Retry Different Card]
        PE2[Insufficient Funds] --> R2[Add Funds/Different Method]
        PE3[Network Timeout] --> R3[Auto Retry]
    end
    
    subgraph "MetaMask Errors"
        ME1[Wallet Not Connected] --> R4[Request Connection]
        ME2[Transaction Failed] --> R5[Check Gas/Balance]
        ME3[User Rejected] --> R6[Show Cancellation]
    end
    
    subgraph "System Errors"
        SE1[Invalid Webhook] --> R7[Log & Return 400]
        SE2[Database Error] --> R8[Retry Transaction]
        SE3[Plan Not Found] --> R9[Sync Paddle Data]
    end
```

## State Transitions

```mermaid
graph LR
    subgraph "Happy Path"
        A[Pending] --> B[Active]
        B --> C[Renewed]
        A --> D[Trialing]
        D --> B
    end
    
    subgraph "Recovery Path"
        E[Past Due] --> F[Grace Period]
        F --> B
        F --> G[Canceled]
    end
    
    subgraph "User Actions"
        B --> H[Paused]
        H --> B
        B --> I[Canceled]
        I --> J[Expired]
    end
```

## Payment Method Management

```mermaid
graph TB
    subgraph "Paddle Methods"
        PM1[Credit Card] --> PM2[Customer ID]
        PM2 --> PM3[Address Data]
        PM2 --> PM4[Business Data]
    end
    
    subgraph "MetaMask Methods"
        MM1[Wallet Address] --> MM2[ENS Name]
        MM1 --> MM3[Supported Tokens]
        MM3 --> MM4[ETH]
        MM3 --> MM5[USDC]
        MM3 --> MM6[USDT]
    end
    
    subgraph "Unified Storage"
        US1[Payment Method Base]
        PM4 --> US1
        MM6 --> US1
        US1 --> US2[Transaction History]
    end
```

## Real-time Updates

```mermaid
sequenceDiagram
    participant DB as Database
    participant API as GraphQL API
    participant SUB as Subscription
    participant UI as Frontend
    
    Note over DB,UI: Subscription Status Change
    
    DB->>API: Status updated
    API->>SUB: Publish event
    SUB->>UI: Real-time notification
    UI->>UI: Update subscription state
    UI->>UI: Refresh plan access
```

## Security Flow

```mermaid
graph TD
    subgraph "Webhook Security"
        WS1[📨 Incoming Webhook] --> WS2{Signature Valid?}
        WS2 -->|✅| WS3[Process Event]
        WS2 -->|❌| WS4[🚫 Reject]
    end
    
    subgraph "MetaMask Security"
        MS1[💳 Payment Request] --> MS2[📝 Message Signing]
        MS2 --> MS3{Signature Valid?}
        MS3 -->|✅| MS4[🔗 Blockchain Transaction]
        MS3 -->|❌| MS5[🚫 Reject Payment]
    end
    
    subgraph "Data Protection"
        DP1[🔐 API Keys in ENV]
        DP2[🛡️ Minimal Data Storage]
        DP3[📋 Audit Trail]
    end
```

## Monitoring Dashboard

```mermaid
graph TB
    subgraph "Business Metrics"
        BM1[💰 MRR]
        BM2[📉 Churn Rate]
        BM3[📈 Conversion Rate]
    end
    
    subgraph "Technical Metrics"
        TM1[⚡ Webhook Processing Time]
        TM2[🎯 Payment Success Rate]
        TM3[🚨 Error Rate by Provider]
    end
    
    subgraph "Alerts"
        A1[🔴 Critical: Webhook Failures]
        A2[🟡 Warning: High Error Rate]
        A3[🔵 Info: Milestone Events]
    end
    
    BM1 --> A3
    TM3 --> A1
    TM2 --> A2
```
