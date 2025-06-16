/*
  Warnings:

  - You are about to drop the column `analyticsCalculated` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `computationCompletedAt` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `computationProgress` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `computationStage` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `computationStartedAt` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `pnlCalculated` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `pricesProcessed` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `symbolsDiscovered` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `tradesProcessed` on the `CreatePortfolioExecution` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PortfolioCreationStep" ADD VALUE 'SYMBOL_DISCOVERY';
ALTER TYPE "PortfolioCreationStep" ADD VALUE 'TRADE_HISTORY_FETCH';
ALTER TYPE "PortfolioCreationStep" ADD VALUE 'PRICE_HISTORY_FETCH';
ALTER TYPE "PortfolioCreationStep" ADD VALUE 'PNL_CALCULATION';
ALTER TYPE "PortfolioCreationStep" ADD VALUE 'ANALYTICS_CALCULATION';

-- AlterTable
ALTER TABLE "CreatePortfolioExecution" DROP COLUMN "analyticsCalculated",
DROP COLUMN "computationCompletedAt",
DROP COLUMN "computationProgress",
DROP COLUMN "computationStage",
DROP COLUMN "computationStartedAt",
DROP COLUMN "pnlCalculated",
DROP COLUMN "pricesProcessed",
DROP COLUMN "symbolsDiscovered",
DROP COLUMN "tradesProcessed";

-- DropEnum
DROP TYPE "ComputationStage";
