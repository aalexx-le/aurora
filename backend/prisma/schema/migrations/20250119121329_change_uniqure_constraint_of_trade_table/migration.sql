/*
  Warnings:

  - A unique constraint covering the columns `[cryptoPortfolioId,assetInfoId,price,qty,time]` on the table `Trade` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Trade_cryptoPortfolioId_assetInfoId_time_key";

-- CreateIndex
CREATE UNIQUE INDEX "Trade_cryptoPortfolioId_assetInfoId_price_qty_time_key" ON "Trade"("cryptoPortfolioId", "assetInfoId", "price", "qty", "time");
