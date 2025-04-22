/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the details it contains will be lost.
  - Added the required column `userId` to the `BankManager` table without income-expense-ratio-bar-chart default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_bankId_fkey";

-- AlterTable
ALTER TABLE "BankManager" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Transaction";

-- CreateTable
CREATE TABLE "BankTransaction" (
    "id" TEXT NOT NULL,
    "bankId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BankManager" ADD CONSTRAINT "BankManager_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
