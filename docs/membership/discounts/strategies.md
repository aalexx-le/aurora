# Discount Strategies for MVP

## How to add a discount

### 2. Early Adopter Strategy

```graphql
mutation CreateEarlyAdopter {
  createDiscount(data: {
    name: "Early Adopter Special"
    description: "50% off for the first 3 months"
    type: PERCENTAGE
    value: "0.5"
    targetType: FIRST_TIME_USER
    isActive: true
    isRecurring: true
    maxUsesPerUser: 1
    endDate: "2025-12-31T23:59:59.000Z"
  }) {
    id
    name
    code
    type
    value
    endDate
    isActive
  }
}

mutation CreateEarlyAdopter {
  createDiscount(data: {
    name: "Early Adopter Special"
    description: "6 months free"
    type: PERCENTAGE
    value: "0.5"
    targetType: FIRST_TIME_USER
    isActive: true
    isRecurring: true
    maxUsesPerUser: 1
    endDate: "2025-12-31T23:59:59.000Z"
  }) {
    id
    name
    code
    type
    value
    endDate
    isActive
  }
}
```

### 3. Launch Week Promotion

```graphql
mutation CreateLaunchWeek {
  createDiscount(data: {
    name: "Launch Week Special"
    description: "75% off first month for launch week"
    code: "LAUNCH75"
    type: PERCENTAGE
    value: "0.75"
    targetType: FIRST_TIME_USER
    isActive: true
    maxUses: 100
    maxUsesPerUser: 1
    startDate: "2024-03-01T00:00:00.000Z"
    endDate: "2024-03-07T23:59:59.000Z"
  }) {
    id
    name
    code
    type
    value
    maxUses
    startDate
    endDate
    isActive
  }
}
```

### 4. Annual Plan Incentive

```graphql
mutation CreateAnnualDiscount {
  createDiscount(data: {
    name: "Annual Plan Discount"
    description: "2 months free when you pay annually"
    type: PERCENTAGE
    value: "0.167"
    targetType: PRICE_SPECIFIC
    isActive: true
  }) {
    id
    name
    type
    value
    targetType
    isActive
  }
}
```

### 5. Referral Bonus

```graphql
mutation CreateReferralBonus {
  createDiscount(data: {
    name: "Referral Bonus"
    description: "$10 off for successful referrals"
    type: FIXED_AMOUNT
    value: "10.00"
    currencyCode: "USD"
    isActive: true
    maxUsesPerUser: 5
  }) {
    id
    name
    type
    value
    currencyCode
    maxUsesPerUser
    isActive
  }
}
```

## Admin Workflow for Creating Price-Specific Discounts

### Step 1: Query Available Plans and Prices

```graphql
query GetPlansAndPrices {
  membershipPlans {
    id
    name
    description
    prices {
      id
      status
      unitPrice {
        id
        amount
        currencyCode
      }
      billingCycle {
        id
        interval
        frequency
      }
      trialPeriod {
        id
        interval
        frequency
      }
    }
  }
}
```

### Step 2: Create Discount with Price Restrictions

```graphql
mutation CreatePriceSpecificDiscount {
  createDiscount(data: {
    name: "Pro Plan Special"
    description: "20% off Pro Plan for new customers"
    code: "PRO20"
    type: PERCENTAGE
    value: "0.2"
    targetType: PRICE_SPECIFIC
    isActive: true
    maxUsesPerUser: 1
  }) {
    id
    name
    code
    type
    value
    targetType
    isActive
  }
}
```

### Step 3: Link Discount to Specific Prices

```graphql
mutation LinkToProMonthly {
  linkDiscountToPrice(
    discountId: "your-discount-id-here"
    priceId: "your-pro-monthly-price-id-here"
  )
}

mutation LinkToProAnnual {
  linkDiscountToPrice(
    discountId: "your-discount-id-here"
    priceId: "your-pro-annual-price-id-here"
  )
}
```

### Step 4: Verify Discount Configuration

```graphql
query VerifyDiscountSetup {
  getDiscount(id: "your-discount-id-here") {
    id
    name
    code
    type
    value
    targetType
    isActive
    prices {
      id
      priceId
      price {
        id
        unitPrice {
          amount
          currencyCode
        }
        billingCycle {
          interval
          frequency
        }
      }
    }
  }
}
```

### Step 5: Test Discount Validation

```graphql
query TestDiscountValidation {
  validateDiscountCode(data: {
    code: "PRO20"
    planId: "your-plan-id"
    amount: "29.99"
    currencyCode: "USD"
  }) {
    isValid
    discount {
      id
      name
      code
    }
    originalAmount
    discountAmount
    finalAmount
    error
    errorCode
  }
}
```