/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ExpenseCategory` table. All the details in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ExpenseCategory" DROP COLUMN "createdAt";
