-- CreateTable
CREATE TABLE "Trade" (
    "id" SERIAL NOT NULL,
    "cryptoPortfolioId" TEXT NOT NULL,
    "assetInfoId" TEXT NOT NULL,
    "tradeType" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,
    "quoteQty" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION NOT NULL,
    "commissionAsset" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_cryptoPortfolioId_fkey" FOREIGN KEY ("cryptoPortfolioId") REFERENCES "CryptoPortfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trade" ADD CONSTRAINT "Trade_assetInfoId_fkey" FOREIGN KEY ("assetInfoId") REFERENCES "AssetInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
