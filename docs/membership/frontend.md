# Frontend Integration Documentation

This document outlines the React frontend architecture for membership and subscription management using visual diagrams.

## Frontend Architecture Overview

```mermaid
graph TB
    subgraph "User Interface Layer"
        Pages[📄 Pages]
        Components[🧩 Components]
        Forms[📝 Forms]
    end
    
    subgraph "State Management"
        Apollo[🚀 Apollo Client]
        Zustand[🗄️ Zustand Store]
        LocalState[🔄 React State]
    end
    
    subgraph "Business Logic"
        Hooks[🎣 Custom Hooks]
        Utils[⚙️ Utilities]
        Validation[✅ Form Validation]
    end
    
    subgraph "External Integrations"
        GraphQL[🔗 GraphQL API]
        Paddle[🏦 Paddle SDK]
        MetaMask[🦊 MetaMask SDK]
    end
    
    Pages --> Components
    Components --> Forms
    Forms --> Hooks
    Hooks --> Apollo
    Hooks --> Zustand
    Apollo --> GraphQL
    Hooks --> Paddle
    Hooks --> MetaMask
```

## Component Hierarchy

```mermaid
graph TD
    App[🏠 App] --> SubscriptionPage[📄 Subscription Page]
    
    SubscriptionPage --> SubscriptionForm[📝 Subscription Form]
    SubscriptionForm --> PaymentProviderSelect[💳 Provider Select]
    SubscriptionForm --> BillingIntervalToggle[⏰ Billing Toggle]
    SubscriptionForm --> PlanGrid[📋 Plan Grid]
    
    PlanGrid --> PlanCard[📦 Plan Card]
    PlanCard --> PlanPricing[💰 Pricing Display]
    PlanCard --> PlanFeatures[⚙️ Features List]
    PlanCard --> PlanActions[🎯 Action Buttons]
    
    PaymentProviderSelect --> PaddleOption[🏦 Paddle Option]
    PaymentProviderSelect --> MetaMaskOption[🦊 MetaMask Option]
    
    PlanActions --> PaddleCheckout[🏦 Paddle Checkout]
    PlanActions --> MetaMaskPayment[🦊 MetaMask Payment]
```

## User Flow Diagrams

### Plan Selection Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant UI as 🖥️ UI Components
    participant Hooks as 🎣 Custom Hooks
    participant API as 🔗 GraphQL API
    
    User->>UI: Visit subscription page
    UI->>Hooks: useSubscriptionPlans()
    Hooks->>API: Query available plans
    API->>Hooks: Return plans + pricing
    Hooks->>UI: Update component state
    UI->>User: Display plan options
    
    User->>UI: Select billing interval
    UI->>Hooks: handleIntervalChange()
    Hooks->>UI: Update pricing display
    
    User->>UI: Choose plan
    UI->>Hooks: handlePlanSelect()
    Hooks->>UI: Highlight selected plan
    
    User->>UI: Click subscribe
    UI->>Hooks: handleCheckout()
    Hooks->>API: Process payment
```

### Paddle Payment Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant Form as 📝 Form
    participant Hook as 🎣 usePaddleCheckout
    participant Paddle as 🏦 Paddle SDK
    participant API as 🔗 Backend API
    
    User->>Form: Submit payment form
    Form->>Hook: openCheckout(options)
    Hook->>Paddle: Paddle.Checkout.open()
    Paddle->>User: Display payment modal
    
    User->>Paddle: Complete payment
    Paddle->>Hook: Success callback
    Hook->>API: Webhook processes payment
    API->>Hook: GraphQL subscription update
    Hook->>Form: Update UI state
    Form->>User: Show success message
```

### MetaMask Payment Flow

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant UI as 🖥️ MetaMask Component
    participant Wallet as 🦊 MetaMask Extension
    participant Blockchain as ⛓️ Ethereum Network
    participant API as 🔗 Backend API
    
    User->>UI: Select crypto payment
    UI->>Wallet: Request connection
    Wallet->>User: Approve connection
    User->>Wallet: Approve connection
    
    UI->>API: Calculate crypto price
    API->>UI: Return token amount
    UI->>Wallet: Request transaction
    Wallet->>User: Confirm transaction
    
    User->>Wallet: Sign transaction
    Wallet->>Blockchain: Submit transaction
    Blockchain->>API: Transaction confirmed
    API->>UI: Payment successful
    UI->>User: Show success state
```

## State Management Flow

```mermaid
graph TB
    subgraph "Apollo Client Cache"
        AC1[📋 Subscriptions Query]
        AC2[📦 Plans Query]
        AC3[💳 Payment Methods Query]
        AC4[🔔 Real-time Subscriptions]
    end
    
    subgraph "Zustand Store"
        ZS1[🎯 Current Plan Selection]
        ZS2[⏰ Billing Interval]
        ZS3[💳 Payment Provider]
        ZS4[🔄 Loading States]
    end
    
    subgraph "Component State"
        CS1[📝 Form Values]
        CS2[✅ Validation Errors]
        CS3[🎨 UI States]
    end
    
    AC1 --> ZS1
    AC2 --> ZS1
    ZS1 --> CS1
    ZS2 --> CS1
    ZS3 --> CS1
    CS2 --> CS3
```

## Hook Architecture

```mermaid
graph LR
    subgraph "Data Hooks"
        H1[useSubscriptionPlans]
        H2[useSubscriptionStatus]
        H3[usePaymentMethods]
    end
    
    subgraph "Action Hooks"
        H4[useCheckoutHandler]
        H5[usePaddleCheckout]
        H6[useReactivateSubscription]
    end
    
    subgraph "Apollo Hooks"
        H7[useQuery]
        H8[useMutation]
        H9[useSubscription]
    end
    
    H1 --> H7
    H2 --> H7
    H3 --> H7
    H4 --> H8
    H5 --> H8
    H6 --> H8
```

## Form Validation Flow

```mermaid
graph TD
    A[Form Input] --> B{Zod Schema Validation}
    
    B -->|❌ Invalid| C[Display Field Errors]
    B -->|✅ Valid| D[Enable Submit Button]
    
    D --> E[Submit Handler]
    E --> F{Business Rules Check}
    
    F -->|❌ Invalid| G[Show Business Error]
    F -->|✅ Valid| H[Process Request]
    
    H --> I{API Response}
    I -->|❌ Error| J[Show API Error]
    I -->|✅ Success| K[Show Success State]
```

## Error Handling Strategy

```mermaid
graph TB
    subgraph "Error Types"
        E1[🔴 Network Errors]
        E2[⚠️ Validation Errors]
        E3[🚫 Authorization Errors]
        E4[💳 Payment Errors]
    end
    
    subgraph "Error Boundaries"
        EB1[🛡️ Component Boundary]
        EB2[🛡️ Payment Boundary]
        EB3[🛡️ Form Boundary]
    end
    
    subgraph "User Feedback"
        UF1[🔔 Toast Notifications]
        UF2[📝 Inline Messages]
        UF3[🎨 Error States]
        UF4[🔄 Retry Options]
    end
    
    E1 --> EB1
    E2 --> EB3
    E3 --> EB1
    E4 --> EB2
    
    EB1 --> UF1
    EB2 --> UF2
    EB3 --> UF2
    UF1 --> UF4
```

## Real-time Updates

```mermaid
sequenceDiagram
    participant Backend as 🔗 Backend
    participant Apollo as 🚀 Apollo Client
    participant Store as 🗄️ State Store
    participant UI as 🖥️ UI Components
    
    Note over Backend,UI: Subscription Status Change
    
    Backend->>Apollo: GraphQL subscription event
    Apollo->>Store: Update cache
    Store->>UI: Trigger re-render
    UI->>UI: Update subscription display
    UI->>UI: Show status notification
    UI->>UI: Enable/disable features
```

## Performance Optimization

```mermaid
graph TB
    subgraph "Code Splitting"
        CS1[📦 Lazy Components]
        CS2[🔄 Dynamic Imports]
        CS3[📱 Route-based Splitting]
    end
    
    subgraph "Memoization"
        M1[⚡ useMemo]
        M2[🔄 useCallback]
        M3[🧩 React.memo]
    end
    
    subgraph "Apollo Optimization"
        AO1[💾 Cache Policies]
        AO2[📊 Field Policies]
        AO3[🎯 Query Batching]
    end
    
    CS1 --> M1
    CS2 --> M2
    CS3 --> M3
    M1 --> AO1
    M2 --> AO2
    M3 --> AO3
```

## Component Props Flow

```mermaid
graph TB
    subgraph "SubscriptionForm Props"
        SF1[plans: MembershipPlan[]]
        SF2[loading: boolean]
        SF3[onSubmit: Function]
    end
    
    subgraph "PlanCard Props"
        PC1[plan: MembershipPlan]
        PC2[isSelected: boolean]
        PC3[billingInterval: Interval]
        PC4[onSelect: Function]
    end
    
    subgraph "PaymentProvider Props"
        PP1[selectedProvider: Provider]
        PP2[onProviderChange: Function]
        PP3[availableMethods: Method[]]
    end
    
    SF1 --> PC1
    SF2 --> PC2
    SF3 --> PC4
    PC1 --> PP1
    PC4 --> PP2
```

## Loading States Management

```mermaid
stateDiagram-v2
    [*] --> Idle
    
    Idle --> Loading : User action
    Loading --> Success : API success
    Loading --> Error : API error
    
    Success --> Idle : Reset
    Error --> Idle : Reset
    Error --> Loading : Retry
    
    Loading --> Submitting : Form submission
    Submitting --> Success : Payment success
    Submitting --> Error : Payment error
```

## Accessibility Features

```mermaid
graph LR
    subgraph "Keyboard Navigation"
        KN1[⌨️ Tab Order]
        KN2[↩️ Enter Actions]
        KN3[⎋ Escape Handling]
    end
    
    subgraph "Screen Reader Support"
        SR1[🔊 ARIA Labels]
        SR2[📢 Live Regions]
        SR3[🎯 Focus Management]
    end
    
    subgraph "Visual Accessibility"
        VA1[🎨 Color Contrast]
        VA2[📏 Text Scaling]
        VA3[⚡ Reduced Motion]
    end
    
    KN1 --> SR1
    KN2 --> SR2
    KN3 --> SR3
    SR1 --> VA1
    SR2 --> VA2
    SR3 --> VA3
```

This comprehensive frontend documentation covers all aspects of the membership system implementation, from basic components to advanced features like Web3 integration, providing developers with the information needed to understand, maintain, and extend the system. 