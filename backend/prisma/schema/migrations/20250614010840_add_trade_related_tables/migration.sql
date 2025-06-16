-- CreateEnum
CREATE TYPE "ComputationStage" AS ENUM ('SYMBOL_DISCOVERY', 'TRADE_HISTORY_FETCH', 'PRICE_HISTORY_FETCH', 'PNL_CALCULATION', 'ANALYTICS_CALCULATION', 'COMPLETED');

-- DropIndex
DROP INDEX "Trade_cryptoPortfolioId_assetInfoId_price_qty_time_key";

-- AlterTable
ALTER TABLE "CreatePortfolioExecution" ADD COLUMN     "analyticsCalculated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "computationStage" "ComputationStage",
ADD COLUMN     "pnlCalculated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pricesProcessed" INTEGER,
ADD COLUMN     "symbolsDiscovered" INTEGER,
ADD COLUMN     "tradesProcessed" INTEGER;

-- AlterTable
ALTER TABLE "HistoricalAssetProfit" ADD COLUMN     "averageCostBasis" DOUBLE PRECISION,
ADD COLUMN     "currentPrice" DOUBLE PRECISION,
ADD COLUMN     "holdingPeriodDays" INTEGER,
ADD COLUMN     "isPrecomputed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "percentageGain" DOUBLE PRECISION,
ADD COLUMN     "realizedPnl" DOUBLE PRECISION,
ADD COLUMN     "totalPnl" DOUBLE PRECISION,
ADD COLUMN     "unrealizedPnl" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "HistoricalCryptoBalance" ADD COLUMN     "assetCount" INTEGER,
ADD COLUMN     "diversificationScore" DOUBLE PRECISION,
ADD COLUMN     "isPrecomputed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "riskScore" DOUBLE PRECISION,
ADD COLUMN     "totalPnl" DOUBLE PRECISION,
ADD COLUMN     "totalRealizedPnl" DOUBLE PRECISION,
ADD COLUMN     "totalUnrealizedPnl" DOUBLE PRECISION,
ADD COLUMN     "totalValue" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Trade" ADD COLUMN     "feeAsset" TEXT,
ADD COLUMN     "fees" DOUBLE PRECISION,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "isPrecomputed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "realizedPnl" DOUBLE PRECISION,
ADD COLUMN     "side" TEXT,
ADD COLUMN     "symbol" TEXT,
ADD CONSTRAINT "Trade_pkey" PRIMARY KEY ("id");
