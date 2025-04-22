/*
  Warnings:

  - You are about to drop the column `oKXCryptoPortfolioId` on the `Trade` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_oKXCryptoPortfolioId_fkey";

-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "oKXCryptoPortfolioId";
