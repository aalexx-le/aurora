/*
  Warnings:

  - You are about to drop the column `tradeType` on the `Trade` table. All the data in the column will be lost.
  - Added the required column `isBuyer` to the `Trade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trade" DROP COLUMN "tradeType",
ADD COLUMN     "isBuyer" BOOLEAN NOT NULL;
