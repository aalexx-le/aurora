/*
  Warnings:

  - A unique constraint covering the columns `[cryptoPortfolioId,assetInfoId,time]` on the table `HistoricalAssetProfit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "HistoricalAssetProfit_cryptoPortfolioId_assetInfoId_time_key";

-- DropIndex
DROP INDEX "HistoricalAssetProfit_time_idx";

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalAssetProfit_cryptoPortfolioId_assetInfoId_time_key" ON "HistoricalAssetProfit"("cryptoPortfolioId", "assetInfoId", "time");
