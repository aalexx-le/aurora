/*
  Warnings:

  - The values [GLOBAL,PLAN_SPECIFIC,USER_SPECIFIC] on the enum `DiscountTargetType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdBy` on the `MembershipDiscount` table. All the data in the column will be lost.
  - You are about to drop the column `minimumAmount` on the `MembershipDiscount` table. All the data in the column will be lost.
  - You are about to drop the column `minimumPlanIds` on the `MembershipDiscount` table. All the data in the column will be lost.
  - You are about to drop the column `targetPlanIds` on the `MembershipDiscount` table. All the data in the column will be lost.
  - You are about to drop the column `targetUserIds` on the `MembershipDiscount` table. All the data in the column will be lost.
  - The primary key for the `MembershipDiscountUsage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MembershipDiscountUsage` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `MembershipDiscountUsage` table. All the data in the column will be lost.
  - You are about to drop the column `discountAmount` on the `MembershipSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `discountId` on the `MembershipSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `finalAmount` on the `MembershipSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `originalAmount` on the `MembershipSubscription` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DiscountTargetType_new" AS ENUM ('PRICE_SPECIFIC', 'FIRST_TIME_USER');
ALTER TABLE "MembershipDiscount" ALTER COLUMN "targetType" DROP DEFAULT;
ALTER TABLE "MembershipDiscount" ALTER COLUMN "targetType" TYPE "DiscountTargetType_new" USING ("targetType"::text::"DiscountTargetType_new");
ALTER TYPE "DiscountTargetType" RENAME TO "DiscountTargetType_old";
ALTER TYPE "DiscountTargetType_new" RENAME TO "DiscountTargetType";
DROP TYPE "DiscountTargetType_old";
ALTER TABLE "MembershipDiscount" ALTER COLUMN "targetType" SET DEFAULT 'FIRST_TIME_USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "MembershipDiscount" DROP CONSTRAINT "MembershipDiscount_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "MembershipDiscountUsage" DROP CONSTRAINT "MembershipDiscountUsage_userId_fkey";

-- DropForeignKey
ALTER TABLE "MembershipSubscription" DROP CONSTRAINT "MembershipSubscription_discountId_fkey";

-- AlterTable
ALTER TABLE "MembershipDiscount" DROP COLUMN "createdBy",
DROP COLUMN "minimumAmount",
DROP COLUMN "minimumPlanIds",
DROP COLUMN "targetPlanIds",
DROP COLUMN "targetUserIds",
ALTER COLUMN "targetType" SET DEFAULT 'FIRST_TIME_USER';

-- AlterTable
ALTER TABLE "MembershipDiscountUsage" DROP CONSTRAINT "MembershipDiscountUsage_pkey",
DROP COLUMN "id",
DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "MembershipSubscription" DROP COLUMN "discountAmount",
DROP COLUMN "discountId",
DROP COLUMN "finalAmount",
DROP COLUMN "originalAmount";

-- CreateTable
CREATE TABLE "MembershipDiscountPrice" (
    "id" TEXT NOT NULL,
    "discountId" TEXT NOT NULL,
    "priceId" TEXT NOT NULL,

    CONSTRAINT "MembershipDiscountPrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MembershipDiscountPrice" ADD CONSTRAINT "MembershipDiscountPrice_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "MembershipDiscount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipDiscountPrice" ADD CONSTRAINT "MembershipDiscountPrice_priceId_fkey" FOREIGN KEY ("priceId") REFERENCES "MembershipPrice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
