/*
  Warnings:

  - You are about to drop the column `isPrecomputed` on the `HistoricalAssetProfit` table. All the data in the column will be lost.
  - You are about to drop the column `isPrecomputed` on the `HistoricalCryptoBalance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HistoricalAssetProfit" DROP COLUMN "isPrecomputed";

-- AlterTable
ALTER TABLE "HistoricalCryptoBalance" DROP COLUMN "isPrecomputed";
