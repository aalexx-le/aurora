/*
  Warnings:

  - You are about to drop the column `updateTime` on the `HistoricalCryptoBalance` table. All the details in the column will be lost.

*/
-- AlterTable
ALTER TABLE "HistoricalCryptoBalance" DROP COLUMN "updateTime";

-- AlterTable
ALTER TABLE "UserCryptoProfile" ADD COLUMN     "updateTime" TIMESTAMP(3);
