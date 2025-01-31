/*
  Warnings:

  - Added the required column `userId` to the `CreatePortfolioExecution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreatePortfolioExecution" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" INTEGER NOT NULL;
