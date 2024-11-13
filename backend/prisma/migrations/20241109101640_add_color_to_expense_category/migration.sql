/*
  Warnings:

  - Added the required column `bankTransactionId` to the `Expense` table without income-expense-ratio-bar-chart default value. This is not possible if the table is not empty.
  - Added the required column `color` to the `ExpenseCategory` table without income-expense-ratio-bar-chart default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankTransaction" ADD COLUMN     "spentAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "bankTransactionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ExpenseCategory" ADD COLUMN     "color" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_bankTransactionId_fkey" FOREIGN KEY ("bankTransactionId") REFERENCES "BankTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
