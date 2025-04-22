-- CreateEnum
CREATE TYPE "PortfolioStatus" AS ENUM ('QUEUE', 'APPENDING', 'FAILED', 'ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "CryptoPortfolio" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "status" "PortfolioStatus" NOT NULL DEFAULT 'ACTIVE';
