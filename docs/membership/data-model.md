# Membership Data Model

This document outlines the comprehensive data model using visual diagrams to show relationships and structure.

## System Architecture Overview

```mermaid
graph TB
    subgraph "User Management"
        User[👤 User]
    end
    
    subgraph "Subscription Core"
        Sub[📋 Subscription]
        Plan[📦 Plan]
        Price[💰 Price]
        Feature[⚙️ Feature]
    end
    
    subgraph "Payment System"
        PayMethod[💳 Payment Method]
        Transaction[💸 Transaction]
    end
    
    subgraph "Time & Pricing"
        Period[⏰ Time Period]
        UnitPrice[💵 Unit Price]
    end
    
    User --> Sub
    Plan --> Sub
    Plan --> Price
    Plan --> Feature
    Price --> Period
    Price --> UnitPrice
    User --> PayMethod
    Sub --> Transaction
```

## Complete Entity Relationship Diagram

```mermaid
erDiagram
    User {
        int id PK
        string email UK
        string name
        string password
    }
    
    MembershipSubscription {
        string id PK
        int userId FK
        string planId FK
        enum status
        datetime startDate
        datetime endDate
        datetime createdAt
        datetime updatedAt
    }
    
    MembershipPlan {
        string id PK
        string name
        string description
        datetime createdAt
        datetime updatedAt
    }
    
    MembershipPrice {
        string id PK
        string planId FK
        int billingCycleId FK
        int trialPeriodId FK
        int unitPriceId FK
        enum status
        datetime createdAt
    }
    
    Feature {
        int id PK
        enum type
        string name
    }
    
    MembershipFeature {
        int id PK
        string planId FK
        int featureId FK
    }
    
    TimePeriod {
        int id PK
        enum interval
        int frequency
    }
    
    UnitPrice {
        int id PK
        string amount
        string currencyCode
    }
    
    PaymentMethod {
        int id PK
        int userId FK
        enum provider
    }
    
    PaddlePaymentMethod {
        int id PK
        int paymentMethodId FK
        string customerId UK
        string addressId
        string businessId
    }
    
    MetaMaskPaymentMethod {
        int id PK
        int paymentMethodId FK
        string walletAddress UK
        string ensName
    }
    
    PaymentTransaction {
        int id PK
        string membershipSubscriptionId FK
        int userId
        decimal amount
        string currency
        enum status
        datetime createdAt
        datetime updatedAt
    }
    
    PaddlePaymentTransaction {
        int id PK
        int paymentTransactionId FK
    }
    
    MetaMaskPaymentTransaction {
        int id PK
        int paymentTransactionId FK
        string transactionHash UK
        string tokenAddress
        string tokenSymbol
        int blockNumber
        string gasUsed
        string gasPrice
    }
    
    User ||--o{ MembershipSubscription : has
    User ||--o{ PaymentMethod : owns
    
    MembershipPlan ||--o{ MembershipSubscription : offers
    MembershipPlan ||--o{ MembershipPrice : has
    MembershipPlan ||--o{ MembershipFeature : includes
    
    MembershipFeature }o--|| Feature : references
    
    MembershipPrice }o--|| TimePeriod : "billing cycle"
    MembershipPrice }o--|| TimePeriod : "trial period"
    MembershipPrice }o--|| UnitPrice : priced_at
    
    PaymentMethod ||--o| PaddlePaymentMethod : extends
    PaymentMethod ||--o| MetaMaskPaymentMethod : extends
    
    MembershipSubscription ||--o{ PaymentTransaction : generates
    PaymentTransaction ||--o| PaddlePaymentTransaction : extends
    PaymentTransaction ||--o| MetaMaskPaymentTransaction : extends
```

## Payment Provider Architecture

```mermaid
graph TB
    subgraph "Base Payment System"
        PM[PaymentMethod<br/>Base Entity]
        PT[PaymentTransaction<br/>Base Entity]
    end
    
    subgraph "Paddle Provider"
        PPM[PaddlePaymentMethod<br/>customerId, addressId, businessId]
        PPT[PaddlePaymentTransaction<br/>Webhook Data]
    end
    
    subgraph "MetaMask Provider"  
        MPM[MetaMaskPaymentMethod<br/>walletAddress, ensName]
        MPT[MetaMaskPaymentTransaction<br/>transactionHash, tokenData]
    end
    
    PM --> PPM
    PM --> MPM
    PT --> PPT
    PT --> MPT
    
    PPM -.-> PPT
    MPM -.-> MPT
```

## Subscription Lifecycle States

```mermaid
stateDiagram-v2
    [*] --> pending : Plan Selected
    
    pending --> trialing : Trial Starts
    pending --> active : Immediate Payment
    pending --> failed : Payment Failed
    
    trialing --> active : Trial Converts
    trialing --> canceled : User Cancels
    trialing --> past_due : Payment Fails
    
    active --> past_due : Payment Fails
    active --> canceled : User Cancels
    active --> paused : User Pauses
    
    past_due --> active : Payment Recovered
    past_due --> canceled : Grace Expires
    
    paused --> active : User Resumes
    paused --> canceled : User Cancels
    
    canceled --> [*] : Ends
    failed --> [*] : Cleanup
```

## Feature System Design

```mermaid
graph LR
    subgraph "Feature Types"
        FT1[CRYPTO<br/>🪙 Crypto Features]
        FT2[EXPENSE<br/>💰 Expense Features]
    end
    
    subgraph "Plan Features"
        PF[MembershipFeature<br/>Junction Table]
    end
    
    subgraph "Plans"
        P1[Basic Plan]
        P2[Pro Plan]
        P3[Enterprise Plan]
    end
    
    FT1 --> PF
    FT2 --> PF
    PF --> P1
    PF --> P2
    PF --> P3
```

## Pricing Structure

```mermaid
graph TB
    subgraph "Plan Pricing"
        Plan[📦 Plan]
        Price[💰 Price]
    end
    
    subgraph "Time Configuration"
        Billing[⏰ Billing Cycle<br/>month/year]
        Trial[🆓 Trial Period<br/>days/weeks]
    end
    
    subgraph "Cost Structure"
        Unit[💵 Unit Price<br/>amount + currency]
    end
    
    Plan --> Price
    Price --> Billing
    Price --> Trial
    Price --> Unit
    
    Billing --> Period1[Daily: 1 day]
    Billing --> Period2[Weekly: 1 week]
    Billing --> Period3[Monthly: 1 month]
    Billing --> Period4[Annual: 12 months]
```

## Data Types & Enums

```mermaid
graph TD
    subgraph "Subscription Status"
        SS1[active ✅]
        SS2[canceled ❌]
        SS3[past_due ⚠️]
        SS4[paused ⏸️]
        SS5[trialing 🆓]
    end
    
    subgraph "Payment Status"
        PS1[authorized ✅]
        PS2[captured ✅]
        PS3[canceled ❌]
        PS4[error ⚠️]
        PS5[pending ⏳]
    end
    
    subgraph "Payment Provider"
        PP1[PADDLE 🏦]
        PP2[METAMASK 🦊]
    end
    
    subgraph "Feature Type"
        FT1[CRYPTO 🪙]
        FT2[EXPENSE 💰]
    end
    
    subgraph "Time Interval"
        TI1[day 📅]
        TI2[week 📅]
        TI3[month 📅]
        TI4[year 📅]
    end
```

## Security & Data Integrity

```mermaid
graph TB
    subgraph "Unique Constraints"
        UC1[User email ✅]
        UC2[Paddle customerId ✅]
        UC3[Wallet address ✅]
        UC4[Transaction hash ✅]
    end
    
    subgraph "Foreign Key Constraints"
        FK1[User → Subscription]
        FK2[Plan → Subscription]
        FK3[Price → Plan]
        FK4[Feature → Plan]
    end
    
    subgraph "Business Rules"
        BR1[One active subscription per user per plan]
        BR2[Payment method matches provider]
        BR3[Transaction amount > 0]
        BR4[End date > Start date]
    end
```

## Performance Optimization

```mermaid
graph LR
    subgraph "Database Indexes"
        I1[User ID + Status]
        I2[Plan ID]
        I3[Transaction Hash]
        I4[Customer ID]
        I5[Wallet Address]
    end
    
    subgraph "Query Patterns"
        Q1[Active subscriptions by user]
        Q2[Plan features lookup]
        Q3[Transaction history]
        Q4[Payment method by provider]
    end
    
    I1 --> Q1
    I2 --> Q2
    I3 --> Q3
    I4 --> Q4
    I5 --> Q4
``` 