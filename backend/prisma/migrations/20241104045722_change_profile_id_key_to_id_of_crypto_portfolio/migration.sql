/*
  Warnings:

  - The primary key for the `CryptoPortfolio` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `profileId` on the `CryptoPortfolio` table. All the details in the column will be lost.
  - The required column `id` was added to the `CryptoPortfolio` table with income-expense-ratio-bar-chart prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "AssetBalance" DROP CONSTRAINT "AssetBalance_cryptoPortfolioId_fkey";

-- DropForeignKey
ALTER TABLE "HistoricalCryptoBalance" DROP CONSTRAINT "HistoricalCryptoBalance_cryptoPortfolioId_fkey";

-- AlterTable
ALTER TABLE "CryptoPortfolio" DROP CONSTRAINT "CryptoPortfolio_pkey",
DROP COLUMN "profileId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "CryptoPortfolio_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "AssetBalance" ADD CONSTRAINT "AssetBalance_cryptoPortfolioId_fkey" FOREIGN KEY ("cryptoPortfolioId") REFERENCES "CryptoPortfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalCryptoBalance" ADD CONSTRAINT "HistoricalCryptoBalance_cryptoPortfolioId_fkey" FOREIGN KEY ("cryptoPortfolioId") REFERENCES "CryptoPortfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
