/*
  Warnings:

  - Added the required column `fullName` to the `BankAccount` table without income-expense-ratio-bar-chart default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BankAccount" ADD COLUMN     "fullName" TEXT NOT NULL;
