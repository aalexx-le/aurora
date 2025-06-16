-- AlterTable
ALTER TABLE "CreatePortfolioExecution" ADD COLUMN     "computationCompletedAt" TIMESTAMP(3),
ADD COLUMN     "computationProgress" DOUBLE PRECISION,
ADD COLUMN     "computationStartedAt" TIMESTAMP(3);
