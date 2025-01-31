-- AlterTable
ALTER TABLE "AssetBalance" ADD COLUMN     "oKXCryptoPortfolioId" TEXT;

-- AlterTable
ALTER TABLE "HistoricalAssetProfit" ADD COLUMN     "oKXCryptoPortfolioId" TEXT;

-- AlterTable
ALTER TABLE "HistoricalCryptoBalance" ADD COLUMN     "oKXCryptoPortfolioId" TEXT;

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "oKXCryptoPortfolioId" TEXT;

-- CreateTable
CREATE TABLE "OKXCryptoPortfolio" (
    "id" TEXT NOT NULL,
    "cryptoPortfolioId" TEXT NOT NULL,
    "passphrase" TEXT NOT NULL,

    CONSTRAINT "OKXCryptoPortfolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OKXCryptoPortfolio_cryptoPortfolioId_key" ON "OKXCryptoPortfolio"("cryptoPortfolioId");

-- AddForeignKey
ALTER TABLE "OKXCryptoPortfolio" ADD CONSTRAINT "OKXCryptoPortfolio_cryptoPortfolioId_fkey" FOREIGN KEY ("cryptoPortfolioId") REFERENCES "CryptoPortfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetBalance" ADD CONSTRAINT "AssetBalance_oKXCryptoPortfolioId_fkey" FOREIGN KEY ("oKXCryptoPortfolioId") REFERENCES "OKXCryptoPortfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_oKXCryptoPortfolioId_fkey" FOREIGN KEY ("oKXCryptoPortfolioId") REFERENCES "OKXCryptoPortfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalCryptoBalance" ADD CONSTRAINT "HistoricalCryptoBalance_oKXCryptoPortfolioId_fkey" FOREIGN KEY ("oKXCryptoPortfolioId") REFERENCES "OKXCryptoPortfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalAssetProfit" ADD CONSTRAINT "HistoricalAssetProfit_oKXCryptoPortfolioId_fkey" FOREIGN KEY ("oKXCryptoPortfolioId") REFERENCES "OKXCryptoPortfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
