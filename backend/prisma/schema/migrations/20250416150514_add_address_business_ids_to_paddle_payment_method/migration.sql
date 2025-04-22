/*
  Warnings:

  - You are about to drop the column `providerCustomerId` on the `PaddlePaymentMethod` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `PaddlePaymentMethod` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[addressId]` on the table `PaddlePaymentMethod` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[businessId]` on the table `PaddlePaymentMethod` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customerId` to the `PaddlePaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PaddlePaymentMethod_providerCustomerId_key";

-- AlterTable
ALTER TABLE "PaddlePaymentMethod" DROP COLUMN "providerCustomerId",
ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "businessId" TEXT,
ADD COLUMN     "customerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaddlePaymentMethod_customerId_key" ON "PaddlePaymentMethod"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "PaddlePaymentMethod_addressId_key" ON "PaddlePaymentMethod"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "PaddlePaymentMethod_businessId_key" ON "PaddlePaymentMethod"("businessId");
