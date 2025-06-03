/*
  Warnings:

  - You are about to drop the column `status` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `CreatePortfolioExecution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ErrorRecoveryAction" AS ENUM ('RETRY_AUTOMATIC', 'RETRY_MANUAL', 'UPDATE_CREDENTIALS', 'WAIT_RATE_LIMIT', 'CHECK_PERMISSIONS', 'CONTACT_SUPPORT', 'ABORT');

-- CreateEnum
CREATE TYPE "PortfolioCreationMilestone" AS ENUM ('INITIALIZED', 'CREDENTIALS_VERIFIED', 'EXCHANGE_CONNECTED', 'ACCOUNT_FETCHED', 'BALANCES_FETCHED', 'PORTFOLIO_STORED', 'COMPLETED', 'VALIDATION_FAILED', 'CREDENTIALS_FAILED', 'CONNECTION_FAILED', 'FETCH_FAILED', 'STORAGE_FAILED', 'TIMEOUT_FAILED', 'RATE_LIMITED', 'INSUFFICIENT_PERMISSIONS', 'FAILED');

-- CreateEnum
CREATE TYPE "PortfolioCreationStep" AS ENUM ('VALIDATION', 'AUTHENTICATION', 'CONNECTION', 'ACCOUNT_INFO', 'BALANCE_FETCH', 'DATA_PROCESSING', 'DATABASE_STORAGE', 'FINALIZATION');

-- AlterTable
ALTER TABLE "CreatePortfolioExecution" DROP COLUMN "status",
DROP COLUMN "time",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentMilestone" "PortfolioCreationMilestone",
ADD COLUMN     "currentStep" "PortfolioCreationStep",
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "exchangeType" "CEXExchanges",
ADD COLUMN     "executionContext" JSONB,
ADD COLUMN     "maxRetries" SMALLINT NOT NULL DEFAULT 3,
ADD COLUMN     "progressPercent" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "recoveryAction" "ErrorRecoveryAction",
ADD COLUMN     "retryCount" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropEnum
DROP TYPE "CreateExecutionStatus";

-- AddForeignKey
ALTER TABLE "CreatePortfolioExecution" ADD CONSTRAINT "CreatePortfolioExecution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
