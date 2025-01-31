/*
  Warnings:

  - You are about to drop the column `oKXCryptoPortfolioId` on the `HistoricalAssetProfit` table. All the data in the column will be lost.
  - You are about to drop the column `oKXCryptoPortfolioId` on the `HistoricalCryptoBalance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HistoricalAssetProfit" DROP CONSTRAINT "HistoricalAssetProfit_oKXCryptoPortfolioId_fkey";

-- DropForeignKey
ALTER TABLE "HistoricalCryptoBalance" DROP CONSTRAINT "HistoricalCryptoBalance_oKXCryptoPortfolioId_fkey";

-- AlterTable
ALTER TABLE "HistoricalAssetProfit" DROP COLUMN "oKXCryptoPortfolioId";

-- AlterTable
ALTER TABLE "HistoricalCryptoBalance" DROP COLUMN "oKXCryptoPortfolioId";
