/*
  Warnings:

  - The primary key for the `MembershipDiscountPrice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MembershipDiscountPrice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discountId,priceId]` on the table `MembershipDiscountPrice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MembershipDiscountPrice" DROP CONSTRAINT "MembershipDiscountPrice_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "MembershipDiscountPrice_discountId_priceId_key" ON "MembershipDiscountPrice"("discountId", "priceId");
