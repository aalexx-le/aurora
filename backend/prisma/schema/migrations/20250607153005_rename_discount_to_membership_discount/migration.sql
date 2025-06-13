/*
  Warnings:

  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiscountUsage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "DiscountUsage" DROP CONSTRAINT "DiscountUsage_discountId_fkey";

-- DropForeignKey
ALTER TABLE "DiscountUsage" DROP CONSTRAINT "DiscountUsage_membershipSubscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "DiscountUsage" DROP CONSTRAINT "DiscountUsage_userId_fkey";

-- DropForeignKey
ALTER TABLE "MembershipSubscription" DROP CONSTRAINT "MembershipSubscription_discountId_fkey";

-- DropTable
DROP TABLE "Discount";

-- DropTable
DROP TABLE "DiscountUsage";

-- CreateTable
CREATE TABLE "MembershipDiscount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "type" "DiscountType" NOT NULL,
    "value" DECIMAL(10,4) NOT NULL,
    "currencyCode" TEXT,
    "maxAmount" DECIMAL(10,2),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "maxUses" INTEGER,
    "maxUsesPerUser" INTEGER DEFAULT 1,
    "currentUses" INTEGER NOT NULL DEFAULT 0,
    "minimumAmount" DECIMAL(10,2),
    "minimumPlanIds" TEXT[],
    "targetType" "DiscountTargetType" NOT NULL DEFAULT 'GLOBAL',
    "targetUserIds" INTEGER[],
    "targetPlanIds" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER,

    CONSTRAINT "MembershipDiscount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipDiscountUsage" (
    "id" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "membershipSubscriptionId" TEXT NOT NULL,
    "originalAmount" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL,
    "finalAmount" DECIMAL(10,2) NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "MembershipDiscountUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MembershipDiscount_code_key" ON "MembershipDiscount"("code");

-- CreateIndex
CREATE UNIQUE INDEX "MembershipDiscountUsage_discountId_membershipSubscriptionId_key" ON "MembershipDiscountUsage"("discountId", "membershipSubscriptionId");

-- AddForeignKey
ALTER TABLE "MembershipDiscount" ADD CONSTRAINT "MembershipDiscount_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipDiscountUsage" ADD CONSTRAINT "MembershipDiscountUsage_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "MembershipDiscount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipDiscountUsage" ADD CONSTRAINT "MembershipDiscountUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipDiscountUsage" ADD CONSTRAINT "MembershipDiscountUsage_membershipSubscriptionId_fkey" FOREIGN KEY ("membershipSubscriptionId") REFERENCES "MembershipSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipSubscription" ADD CONSTRAINT "MembershipSubscription_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "MembershipDiscount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
