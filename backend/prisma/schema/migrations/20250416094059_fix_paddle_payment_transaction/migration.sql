/*
  Warnings:

  - You are about to drop the column `paddleTransactionId` on the `PaddlePaymentTransaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentTransactionId]` on the table `PaddlePaymentTransaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PaymentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'REQUIRES_ACTION');

-- DropForeignKey
ALTER TABLE "PaddlePaymentMethod" DROP CONSTRAINT "PaddlePaymentMethod_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_subscriptionId_fkey";

-- DropIndex
DROP INDEX "PaddlePaymentTransaction_paddleTransactionId_key";

-- AlterTable
ALTER TABLE "PaddlePaymentTransaction" DROP COLUMN "paddleTransactionId";

-- AlterTable
ALTER TABLE "PaymentTransaction" ADD COLUMN     "status" "PaymentStatus" NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaddlePaymentTransaction_paymentTransactionId_key" ON "PaddlePaymentTransaction"("paymentTransactionId");

-- AddForeignKey
ALTER TABLE "PaddlePaymentMethod" ADD CONSTRAINT "PaddlePaymentMethod_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
