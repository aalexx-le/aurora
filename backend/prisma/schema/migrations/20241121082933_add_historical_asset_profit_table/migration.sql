-- CreateTable
CREATE TABLE "HistoricalAssetProfit" (
    "time" TIMESTAMP(3) NOT NULL,
    "estimatedProfit" DOUBLE PRECISION NOT NULL,
    "totalCostInQuoteQty" DOUBLE PRECISION NOT NULL,
    "remainingQty" DOUBLE PRECISION NOT NULL,
    "assetInfoId" TEXT NOT NULL,
    "cryptoPortfolioId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalAssetProfit_cryptoPortfolioId_assetInfoId_time_key" ON "HistoricalAssetProfit"("cryptoPortfolioId", "assetInfoId", "time" desc);

-- AddForeignKey
ALTER TABLE "HistoricalAssetProfit" ADD CONSTRAINT "HistoricalAssetProfit_assetInfoId_fkey" FOREIGN KEY ("assetInfoId") REFERENCES "AssetInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalAssetProfit" ADD CONSTRAINT "HistoricalAssetProfit_cryptoPortfolioId_fkey" FOREIGN KEY ("cryptoPortfolioId") REFERENCES "CryptoPortfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

SELECT create_hypertable('"HistoricalAssetProfit"', 'time');