/*
  Warnings:

  - The `exchanges` column on the `CryptoPortfolio` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CEXExchanges" AS ENUM ('BINANCE', 'MEXC');

-- AlterTable
ALTER TABLE "CryptoPortfolio" DROP COLUMN "exchanges",
ADD COLUMN     "exchanges" "CEXExchanges" NOT NULL DEFAULT 'BINANCE';
