/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `PaymentTransaction` table. All the data in the column will be lost.
  - You are about to drop the `PlanPrice` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionPlan` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `membershipSubscriptionId` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MembershipSubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'ENDED');

-- DropForeignKey
ALTER TABLE "PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "PlanPrice" DROP CONSTRAINT "PlanPrice_billingCycleId_fkey";

-- DropForeignKey
ALTER TABLE "PlanPrice" DROP CONSTRAINT "PlanPrice_trialPeriodId_fkey";

-- DropForeignKey
ALTER TABLE "PlanPrice" DROP CONSTRAINT "PlanPrice_unitPriceId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_planId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- AlterTable
ALTER TABLE "PaymentTransaction" DROP COLUMN "subscriptionId",
ADD COLUMN     "membershipSubscriptionId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PlanPrice";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "SubscriptionPlan";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- CreateTable
CREATE TABLE "MembershipSubscription" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "MembershipSubscriptionStatus" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipPrice" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "billingCycleId" INTEGER,
    "trialPeriodId" INTEGER,
    "unitPriceId" INTEGER NOT NULL,
    "status" "PriceStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MembershipPrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MembershipSubscription" ADD CONSTRAINT "MembershipSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipSubscription" ADD CONSTRAINT "MembershipSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MembershipPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPrice" ADD CONSTRAINT "MembershipPrice_billingCycleId_fkey" FOREIGN KEY ("billingCycleId") REFERENCES "TimePeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPrice" ADD CONSTRAINT "MembershipPrice_trialPeriodId_fkey" FOREIGN KEY ("trialPeriodId") REFERENCES "TimePeriod"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPrice" ADD CONSTRAINT "MembershipPrice_unitPriceId_fkey" FOREIGN KEY ("unitPriceId") REFERENCES "UnitPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipPrice" ADD CONSTRAINT "MembershipPrice_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MembershipPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_membershipSubscriptionId_fkey" FOREIGN KEY ("membershipSubscriptionId") REFERENCES "MembershipSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
