# 🎨 CREATIVE PHASE: DISCOUNT SYSTEM API DESIGN

**Date**: Current Session  
**Phase**: API Design & Business Logic  
**Project**: XELA Finance Management System  
**Task**: Add Discount Functionality to Membership Model

---

## 📋 PROBLEM STATEMENT

Design a comprehensive API layer for the discount system that provides:

1. **Admin Management**: Full CRUD operations for discount creation, modification, and monitoring
2. **User Application**: Simple and secure discount code application during subscription
3. **Validation Engine**: Robust business rules validation with clear error messaging
4. **Analytics Interface**: Query capabilities for discount performance and usage tracking
5. **Integration Points**: Seamless integration with existing subscription and payment flows

**Technical Requirements**:
- GraphQL-first approach (aligning with existing backend architecture)
- RESTful fallback endpoints for specific use cases
- Comprehensive input validation and error handling
- Rate limiting and security measures
- Real-time usage tracking and fraud prevention

---

## 🔍 OPTIONS ANALYSIS

### Option 1: GraphQL-Only API
**Description**: Pure GraphQL implementation with all operations through resolvers
**Pros**:
- Consistent with existing backend architecture
- Type-safe operations with schema validation
- Flexible query capabilities for complex operations
- Single endpoint for all discount operations
**Cons**:
- More complex for simple operations like code validation
- Potential performance overhead for simple lookups
- Requires GraphQL knowledge for frontend integration
**Complexity**: Medium
**Implementation Time**: 2-3 weeks

### Option 2: Hybrid GraphQL + REST
**Description**: GraphQL for complex operations, REST for simple actions
**Pros**:
- Best of both worlds approach
- Simple REST endpoints for discount code validation
- GraphQL for complex admin operations and analytics
- Easier caching strategies for simple operations
**Cons**:
- Multiple API paradigms to maintain
- Potential inconsistency in error handling
- More complex authentication strategy
**Complexity**: Medium-High
**Implementation Time**: 3-4 weeks

### Option 3: Enhanced GraphQL with Optimizations ⭐ **SELECTED**
**Description**: GraphQL-first with performance optimizations and simplified operations
**Pros**:
- Consistent architecture with existing system
- Optimized resolvers for common operations
- Single authentication and authorization strategy
- Type-safe operations throughout
- Better caching and performance strategies
**Cons**:
- Requires careful optimization for simple operations
- Some learning curve for simple discount code applications
**Complexity**: Medium
**Implementation Time**: 2-3 weeks

---

## 🎯 SELECTED DESIGN: ENHANCED GRAPHQL WITH OPTIMIZATIONS

### Core Design Principles

1. **Type Safety**: Comprehensive GraphQL schema with strong typing
2. **Performance**: Optimized resolvers with minimal database queries
3. **Security**: Comprehensive validation and rate limiting
4. **Usability**: Simple operations for common use cases
5. **Extensibility**: Easy to add new discount types and validation rules

---

## 📊 GRAPHQL SCHEMA DESIGN

### Core Types

```graphql
# Enums
enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_TRIAL
}

enum DiscountTargetType {
  GLOBAL
  PLAN_SPECIFIC
  USER_SPECIFIC
  FIRST_TIME_USER
}

enum DiscountStatus {
  ACTIVE
  INACTIVE
  EXPIRED
  EXHAUSTED
}

# Main Discount Type
type Discount {
  id: ID!
  name: String!
  description: String
  code: String
  
  # Configuration
  type: DiscountType!
  value: Float!
  currencyCode: String
  maxAmount: Float
  
  # Validity
  isActive: Boolean!
  status: DiscountStatus!
  startDate: DateTime
  endDate: DateTime
  maxUses: Int
  maxUsesPerUser: Int!
  currentUses: Int!
  
  # Targeting
  targetType: DiscountTargetType!
  targetUserIds: [Int!]!
  targetPlanIds: [String!]!
  minimumAmount: Float
  minimumPlanIds: [String!]!
  
  # Metadata
  createdAt: DateTime!
  updatedAt: DateTime!
  createdBy: User
  
  # Relations
  usageHistory: [DiscountUsage!]!
  subscriptions: [MembershipSubscription!]!
}

# Validation Results
type DiscountValidationResult {
  isValid: Boolean!
  discount: Discount
  originalAmount: Float
  discountAmount: Float
  finalAmount: Float
  error: String
  errorCode: DiscountErrorCode
}

enum DiscountErrorCode {
  DISCOUNT_NOT_FOUND
  DISCOUNT_INACTIVE
  DISCOUNT_EXPIRED
  DISCOUNT_EXHAUSTED
  USER_LIMIT_EXCEEDED
  MINIMUM_AMOUNT_NOT_MET
  PLAN_NOT_ELIGIBLE
  USER_NOT_ELIGIBLE
  INVALID_CURRENCY
  ALREADY_APPLIED
}
```

### Input Types

```graphql
# Discount Creation/Update
input CreateDiscountInput {
  name: String!
  description: String
  code: String
  
  # Configuration
  type: DiscountType!
  value: Float!
  currencyCode: String
  maxAmount: Float
  
  # Validity
  isActive: Boolean = true
  startDate: DateTime
  endDate: DateTime
  maxUses: Int
  maxUsesPerUser: Int = 1
  
  # Targeting
  targetType: DiscountTargetType = GLOBAL
  targetUserIds: [Int!] = []
  targetPlanIds: [String!] = []
  minimumAmount: Float
  minimumPlanIds: [String!] = []
}

# Discount Application
input ValidateDiscountInput {
  code: String!
  userId: Int!
  planId: String!
  amount: Float!
  currencyCode: String!
}
```

---

## 🔧 QUERY OPERATIONS

### Admin Queries

```graphql
type Query {
  # Get all discounts with filtering and pagination
  discounts(
    filter: DiscountFilter
    sort: DiscountSort
    first: Int = 20
    after: String
  ): DiscountConnection!
  
  # Get specific discount by ID
  discount(id: ID!): Discount
  
  # Validate discount without applying
  validateDiscount(input: ValidateDiscountInput!): DiscountValidationResult!
  
  # Analytics and reporting
  discountAnalytics(
    discountId: ID!
    startDate: DateTime
    endDate: DateTime
  ): DiscountAnalytics!
}
```

### User Queries

```graphql
type Query {
  # Get available discounts for a user
  availableDiscounts(
    userId: Int!
    planId: String!
    amount: Float!
    currencyCode: String!
  ): [Discount!]!
}
```

---

## ⚡ MUTATION OPERATIONS

### Admin Mutations

```graphql
type Mutation {
  # Create new discount
  createDiscount(input: CreateDiscountInput!): CreateDiscountResult!
  
  # Update existing discount
  updateDiscount(input: UpdateDiscountInput!): UpdateDiscountResult!
  
  # Delete discount (soft delete)
  deleteDiscount(id: ID!): DeleteDiscountResult!
  
  # Generate unique promotional code
  generateDiscountCode(prefix: String, length: Int = 8): String!
}

type CreateDiscountResult {
  success: Boolean!
  discount: Discount
  error: String
}
```

### User Mutations

```graphql
type Mutation {
  # Apply discount to subscription (used during checkout)
  applyDiscount(input: ApplyDiscountInput!): ApplyDiscountResult!
}

type ApplyDiscountResult {
  success: Boolean!
  discountUsage: DiscountUsage
  subscription: MembershipSubscription
  error: String
  errorCode: DiscountErrorCode
}
```

---

## 🔐 BUSINESS LOGIC & VALIDATION

### Discount Validation Engine

```typescript
interface DiscountValidationContext {
  discount: Discount;
  userId: number;
  planId: string;
  amount: number;
  currencyCode: string;
  ipAddress?: string;
  userAgent?: string;
}

// Core Validation Rules
const validationRules: DiscountValidator[] = [
  {
    name: 'DiscountExists',
    validate: async (context) => {
      if (!context.discount) {
        return { isValid: false, errorCode: 'DISCOUNT_NOT_FOUND' };
      }
      return { isValid: true };
    }
  },
  
  {
    name: 'DiscountActive',
    validate: async (context) => {
      if (!context.discount.isActive) {
        return { isValid: false, errorCode: 'DISCOUNT_INACTIVE' };
      }
      return { isValid: true };
    }
  },
  
  {
    name: 'UsageLimits',
    validate: async (context) => {
      const { discount, userId } = context;
      
      // Check global usage limit
      if (discount.maxUses && discount.currentUses >= discount.maxUses) {
        return { isValid: false, errorCode: 'DISCOUNT_EXHAUSTED' };
      }
      
      // Check per-user usage limit
      const userUsageCount = await prisma.discountUsage.count({
        where: { discountId: discount.id, userId }
      });
      
      if (userUsageCount >= discount.maxUsesPerUser) {
        return { isValid: false, errorCode: 'USER_LIMIT_EXCEEDED' };
      }
      
      return { isValid: true };
    }
  }
];
```

### Discount Calculation Engine

```typescript
class DiscountCalculator {
  static calculate(discount: Discount, originalAmount: number): DiscountCalculationResult {
    let discountAmount = 0;
    
    switch (discount.type) {
      case 'PERCENTAGE':
        discountAmount = originalAmount * discount.value;
        // Apply maximum discount cap if specified
        if (discount.maxAmount && discountAmount > discount.maxAmount) {
          discountAmount = discount.maxAmount;
        }
        break;
        
      case 'FIXED_AMOUNT':
        discountAmount = Math.min(discount.value, originalAmount);
        break;
        
      case 'FREE_TRIAL':
        // For free trial, discount is the full amount for the trial period
        discountAmount = originalAmount;
        break;
    }
    
    const finalAmount = Math.max(0, originalAmount - discountAmount);
    
    return {
      originalAmount,
      discountAmount,
      finalAmount,
      discountPercentage: (discountAmount / originalAmount) * 100
    };
  }
}
```

---

## 🛡️ SECURITY & RATE LIMITING

### Authentication & Authorization

```typescript
// Role-based access control
enum DiscountPermission {
  CREATE_DISCOUNT = 'discount:create',
  READ_DISCOUNT = 'discount:read',
  UPDATE_DISCOUNT = 'discount:update',
  DELETE_DISCOUNT = 'discount:delete',
  APPLY_DISCOUNT = 'discount:apply'
}

// Admin resolver guards
@UseGuards(AuthGuard)
@Permissions(DiscountPermission.CREATE_DISCOUNT)
async createDiscount(
  @Args('input') input: CreateDiscountInput,
  @CurrentUser() user: User
): Promise<CreateDiscountResult> {
  // Implementation
}

// User resolver guards with rate limiting
@UseGuards(AuthGuard)
@RateLimit(10, 60) // 10 requests per minute
async validateDiscount(
  @Args('input') input: ValidateDiscountInput,
  @CurrentUser() user: User
): Promise<DiscountValidationResult> {
  // Implementation
}
```

### Fraud Prevention

```typescript
class FraudDetector {
  static async analyzeDiscountUsage(
    userId: number,
    discountId: string,
    ipAddress: string
  ): Promise<FraudDetectionResult> {
    const flags = [];
    let riskScore = 0;
    
    // Check for high frequency usage
    const recentUsage = await this.getRecentUsageByUser(userId);
    if (recentUsage > 10) {
      flags.push('HIGH_FREQUENCY_USAGE');
      riskScore += 30;
    }
    
    // Check for suspicious IP patterns
    const ipUsage = await this.getRecentUsageByIP(ipAddress);
    if (ipUsage > 20) {
      flags.push('SUSPICIOUS_IP_ACTIVITY');
      riskScore += 40;
    }
    
    return {
      riskScore,
      flags,
      shouldBlock: riskScore > 70
    };
  }
}
```

---

## 📊 PERFORMANCE OPTIMIZATION

### Caching Strategy

```typescript
// Redis caching for frequently accessed discounts
@Cacheable('discount_by_code', 300) // 5 minutes
async getDiscountByCode(code: string): Promise<Discount | null> {
  return await this.prisma.discount.findUnique({
    where: { code }
  });
}

// Cache active discounts for quick eligibility checks
@Cacheable('active_discounts', 600) // 10 minutes
async getActiveDiscounts(): Promise<Discount[]> {
  return await this.prisma.discount.findMany({
    where: {
      isActive: true,
      OR: [
        { startDate: null },
        { startDate: { lte: new Date() } }
      ]
    }
  });
}
```

---

## 🔧 INTEGRATION POINTS

### Subscription Creation Flow

```typescript
// Enhanced subscription creation with discount support
async createSubscriptionWithDiscount(
  userId: number,
  planId: string,
  discountCode?: string
): Promise<MembershipSubscription> {
  
  // Get plan pricing
  const plan = await this.getSubscriptionPlan(planId);
  let originalAmount = plan.price.amount;
  let discountAmount = 0;
  let finalAmount = originalAmount;
  let appliedDiscount: Discount | null = null;
  
  // Apply discount if provided
  if (discountCode) {
    const validationResult = await this.validateAndCalculateDiscount(
      discountCode,
      userId,
      planId,
      originalAmount
    );
    
    if (!validationResult.isValid) {
      throw new Error(`Discount validation failed: ${validationResult.error}`);
    }
    
    appliedDiscount = validationResult.discount!;
    discountAmount = validationResult.discountAmount!;
    finalAmount = validationResult.finalAmount!;
  }
  
  // Create subscription with discount data
  const subscription = await this.prisma.$transaction(async (tx) => {
    const newSubscription = await tx.membershipSubscription.create({
      data: {
        userId,
        planId,
        discountId: appliedDiscount?.id,
        originalAmount,
        discountAmount,
        finalAmount,
        status: 'active'
      }
    });
    
    // Record discount usage if applied
    if (appliedDiscount) {
      await tx.discountUsage.create({
        data: {
          discountId: appliedDiscount.id,
          userId,
          membershipSubscriptionId: newSubscription.id,
          originalAmount,
          discountAmount,
          finalAmount,
          currencyCode: plan.price.currencyCode
        }
      });
      
      // Update discount usage count
      await tx.discount.update({
        where: { id: appliedDiscount.id },
        data: { currentUses: { increment: 1 } }
      });
    }
    
    return newSubscription;
  });
  
  return subscription;
}
```

---

🎨 CREATIVE CHECKPOINT: API Design Complete

**Key Design Decisions Made**:

1. **GraphQL-First Architecture** ✅
   - Consistent with existing backend patterns
   - Type-safe operations with comprehensive schema
   - Optimized resolvers for performance

2. **Comprehensive Validation Engine** ✅
   - Rule-based validation system
   - Extensible for new business rules
   - Clear error codes and messaging

3. **Security & Fraud Prevention** ✅
   - Role-based access control
   - Rate limiting strategies
   - IP and usage pattern analysis

4. **Performance Optimization** ✅
   - Redis caching for frequent operations
   - Optimized database queries
   - Bulk operation support

5. **Integration Strategy** ✅
   - Seamless subscription flow integration
   - Transaction-based consistency
   - Audit trail maintenance

**Next Required Creative Phase**: UI/UX Design
- Design user-facing discount application interface
- Plan admin discount management dashboard
- Design discount display in pricing components
- Plan user feedback and error handling UX

🎨🎨🎨 EXITING CREATIVE PHASE - API DESIGN DECISION MADE 🎨🎨🎨 