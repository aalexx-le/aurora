-- CreateEnum
CREATE TYPE "BankManagerThirdParty" AS ENUM ('CASSO');

-- AlterTable
ALTER TABLE "AutoBankManager" ADD COLUMN     "thirdParty" "BankManagerThirdParty" NOT NULL DEFAULT 'CASSO';
