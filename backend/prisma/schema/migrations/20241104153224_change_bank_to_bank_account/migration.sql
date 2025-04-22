/*
  Warnings:

  - You are about to drop the column `api_key` on the `BankManager` table. All the details in the column will be lost.
  - You are about to drop the `Bank` table. If the table is not empty, all the details it contains will be lost.
  - Added the required column `apiKey` to the `BankManager` table without income-expense-ratio-bar-chart default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Bank" DROP CONSTRAINT "Bank_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_bankId_fkey";

-- AlterTable
ALTER TABLE "BankManager" DROP COLUMN "api_key",
ADD COLUMN     "apiKey" TEXT NOT NULL;

-- DropTable
DROP TABLE "Bank";

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bankManagerId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_bankManagerId_fkey" FOREIGN KEY ("bankManagerId") REFERENCES "BankManager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
