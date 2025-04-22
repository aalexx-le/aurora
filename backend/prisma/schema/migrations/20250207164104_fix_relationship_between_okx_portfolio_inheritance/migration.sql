-- AlterTable
ALTER TABLE "BankManager" ADD COLUMN     "isMannual" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "OKXCryptoPortfolio" ADD CONSTRAINT "OKXCryptoPortfolio_cryptoPortfolioId_fkey" FOREIGN KEY ("cryptoPortfolioId") REFERENCES "CryptoPortfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
