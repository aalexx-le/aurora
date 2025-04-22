/*
  Warnings:

  - You are about to drop the column `desctiption` on the `Transaction` table. All the details in the column will be lost.
  - Added the required column `description` to the `Transaction` table without income-expense-ratio-bar-chart default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "desctiption",
ADD COLUMN     "description" TEXT NOT NULL;
