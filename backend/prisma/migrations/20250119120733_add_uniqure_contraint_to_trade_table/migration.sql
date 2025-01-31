/*
  Warnings:

  - The primary key for the `Trade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Trade` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cryptoPortfolioId,assetInfoId,time]` on the table `Trade` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Trade" DROP CONSTRAINT "Trade_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "Trade_cryptoPortfolioId_assetInfoId_time_key" ON "Trade"("cryptoPortfolioId", "assetInfoId", "time");
