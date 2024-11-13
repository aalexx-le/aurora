/*
  Warnings:

  - You are about to drop the `UserCryptoProfile` table. If the table is not empty, all the details it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssetBalance" DROP CONSTRAINT "AssetBalance_cryptoProfileId_fkey";

-- DropForeignKey
ALTER TABLE "HistoricalCryptoBalance" DROP CONSTRAINT "HistoricalCryptoBalance_cryptoProfileId_fkey";

-- DropForeignKey
ALTER TABLE "UserCryptoProfile" DROP CONSTRAINT "UserCryptoProfile_userId_fkey";

-- DropTable
DROP TABLE "UserCryptoProfile";

-- CreateTable
CREATE TABLE "CryptoPortfolio" (
    "profileId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "exchanges" TEXT NOT NULL DEFAULT 'binance',
    "tradingType" "TradingType" NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,
    "updateTime" TIMESTAMP(3),

    CONSTRAINT "CryptoPortfolio_pkey" PRIMARY KEY ("profileId")
);

-- AddForeignKey
ALTER TABLE "CryptoPortfolio" ADD CONSTRAINT "CryptoPortfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetBalance" ADD CONSTRAINT "AssetBalance_cryptoProfileId_fkey" FOREIGN KEY ("cryptoProfileId") REFERENCES "CryptoPortfolio"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalCryptoBalance" ADD CONSTRAINT "HistoricalCryptoBalance_cryptoProfileId_fkey" FOREIGN KEY ("cryptoProfileId") REFERENCES "CryptoPortfolio"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;


-- DropForeignKey
ALTER TABLE "AssetBalance" DROP CONSTRAINT "AssetBalance_cryptoProfileId_fkey";

-- DropForeignKey
ALTER TABLE "HistoricalCryptoBalance" DROP CONSTRAINT "HistoricalCryptoBalance_cryptoProfileId_fkey";

-- DropIndex
DROP INDEX "HistoricalCryptoBalance_cryptoProfileId_time_key";

-- AlterTable
ALTER TABLE "AssetBalance" DROP COLUMN "cryptoProfileId",
ADD COLUMN     "cryptoPortfolioId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "HistoricalCryptoBalance" DROP COLUMN "cryptoProfileId",
ADD COLUMN     "cryptoPortfolioId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalCryptoBalance_cryptoPortfolioId_time_key" ON "HistoricalCryptoBalance"("cryptoPortfolioId", "time");

-- AddForeignKey
ALTER TABLE "AssetBalance" ADD CONSTRAINT "AssetBalance_cryptoPortfolioId_fkey" FOREIGN KEY ("cryptoPortfolioId") REFERENCES "CryptoPortfolio"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalCryptoBalance" ADD CONSTRAINT "HistoricalCryptoBalance_cryptoPortfolioId_fkey" FOREIGN KEY ("cryptoPortfolioId") REFERENCES "CryptoPortfolio"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;



