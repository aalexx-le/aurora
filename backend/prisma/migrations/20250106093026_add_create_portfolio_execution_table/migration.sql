/*
  Warnings:

  - The values [QUEUE,APPENDING,FAILED] on the enum `PortfolioStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "CreateExecutionStatus" AS ENUM ('QUEUE', 'PROCESSING', 'FAILED', 'SUCCESS');

-- AlterEnum
BEGIN;
CREATE TYPE "PortfolioStatus_new" AS ENUM ('ACTIVE', 'INACTIVE');
ALTER TABLE "CryptoPortfolio" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "CryptoPortfolio" ALTER COLUMN "status" TYPE "PortfolioStatus_new" USING ("status"::text::"PortfolioStatus_new");
ALTER TYPE "PortfolioStatus" RENAME TO "PortfolioStatus_old";
ALTER TYPE "PortfolioStatus_new" RENAME TO "PortfolioStatus";
DROP TYPE "PortfolioStatus_old";
ALTER TABLE "CryptoPortfolio" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- CreateTable
CREATE TABLE "CreatePortfolioExecution" (
    "id" SERIAL NOT NULL,
    "status" "CreateExecutionStatus" NOT NULL DEFAULT 'QUEUE',

    CONSTRAINT "CreatePortfolioExecution_pkey" PRIMARY KEY ("id")
);
