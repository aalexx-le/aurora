/*
  Warnings:

  - You are about to drop the column `oKXCryptoPortfolioId` on the `AssetBalance` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "AssetBalance" DROP CONSTRAINT "AssetBalance_oKXCryptoPortfolioId_fkey";

-- DropForeignKey
ALTER TABLE "OKXCryptoPortfolio" DROP CONSTRAINT "OKXCryptoPortfolio_cryptoPortfolioId_fkey";

-- AlterTable
ALTER TABLE "AssetBalance" DROP COLUMN "oKXCryptoPortfolioId";

-- AlterTable
ALTER TABLE "CryptoPortfolio" ADD COLUMN     "parentPortfolioId" TEXT;

-- AddForeignKey
ALTER TABLE "CryptoPortfolio" ADD CONSTRAINT "CryptoPortfolio_parentPortfolioId_fkey" FOREIGN KEY ("parentPortfolioId") REFERENCES "CryptoPortfolio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
