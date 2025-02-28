/*
  Warnings:

  - The `thirdParty` column on the `AutoBankManager` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AutoBankManagerThirdParty" AS ENUM ('CASSO');

-- AlterTable
ALTER TABLE "AutoBankManager" DROP COLUMN "thirdParty",
ADD COLUMN     "thirdParty" "AutoBankManagerThirdParty" NOT NULL DEFAULT 'CASSO';

-- DropEnum
DROP TYPE "BankManagerThirdParty";
