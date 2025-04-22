-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PADDLE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'ENDED');

-- CreateEnum
CREATE TYPE "Interval" AS ENUM ('day', 'week', 'month', 'year');

-- CreateEnum
CREATE TYPE "PriceStatus" AS ENUM ('active', 'archived');

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" "PaymentProvider" NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaddlePaymentMethod" (
    "id" SERIAL NOT NULL,
    "paymentMethodId" INTEGER NOT NULL,
    "providerCustomerId" TEXT NOT NULL,

    CONSTRAINT "PaddlePaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" SERIAL NOT NULL,
    "subscriptionId" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaddlePaymentTransaction" (
    "id" SERIAL NOT NULL,
    "paymentTransactionId" INTEGER NOT NULL,
    "paddleTransactionId" TEXT NOT NULL,

    CONSTRAINT "PaddlePaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubscriptionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanPrice" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "billingCycleId" INTEGER,
    "trialPeriodId" INTEGER,
    "unitPriceId" INTEGER NOT NULL,
    "status" "PriceStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlanPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimePeriod" (
    "id" SERIAL NOT NULL,
    "interval" "Interval" NOT NULL,
    "frequency" INTEGER NOT NULL,

    CONSTRAINT "TimePeriod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnitPrice" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "UnitPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaddlePaymentMethod_paymentMethodId_key" ON "PaddlePaymentMethod"("paymentMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "PaddlePaymentMethod_providerCustomerId_key" ON "PaddlePaymentMethod"("providerCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "PaddlePaymentTransaction_paddleTransactionId_key" ON "PaddlePaymentTransaction"("paddleTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

-- AddForeignKey
ALTER TABLE "PaddlePaymentMethod" ADD CONSTRAINT "PaddlePaymentMethod_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaddlePaymentTransaction" ADD CONSTRAINT "PaddlePaymentTransaction_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "SubscriptionPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanPrice" ADD CONSTRAINT "PlanPrice_billingCycleId_fkey" FOREIGN KEY ("billingCycleId") REFERENCES "TimePeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanPrice" ADD CONSTRAINT "PlanPrice_trialPeriodId_fkey" FOREIGN KEY ("trialPeriodId") REFERENCES "TimePeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanPrice" ADD CONSTRAINT "PlanPrice_unitPriceId_fkey" FOREIGN KEY ("unitPriceId") REFERENCES "UnitPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
