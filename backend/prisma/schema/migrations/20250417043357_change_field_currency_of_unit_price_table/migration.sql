/*
  Warnings:

  - You are about to drop the column `currency` on the `UnitPrice` table. All the data in the column will be lost.
  - Added the required column `currencyCode` to the `UnitPrice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UnitPrice" DROP COLUMN "currency",
ADD COLUMN     "currencyCode" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE TEXT;
