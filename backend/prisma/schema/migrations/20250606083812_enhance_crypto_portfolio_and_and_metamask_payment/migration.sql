/*
  Warnings:

  - You are about to drop the column `status` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `CreatePortfolioExecution` table. All the data in the column will be lost.
  - The `exchanges` column on the `CryptoPortfolio` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `OKXCryptoPortfolio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `CreatePortfolioExecution` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ErrorRecoveryAction" AS ENUM ('RETRY_AUTOMATIC', 'RETRY_MANUAL', 'UPDATE_CREDENTIALS', 'WAIT_RATE_LIMIT', 'CHECK_PERMISSIONS', 'CONTACT_SUPPORT', 'ABORT');

-- CreateEnum
CREATE TYPE "PortfolioCreationMilestone" AS ENUM ('INITIALIZED', 'CREDENTIALS_VERIFIED', 'EXCHANGE_CONNECTED', 'ACCOUNT_FETCHED', 'BALANCES_FETCHED', 'PORTFOLIO_STORED', 'COMPLETED', 'VALIDATION_FAILED', 'CREDENTIALS_FAILED', 'CONNECTION_FAILED', 'FETCH_FAILED', 'STORAGE_FAILED', 'TIMEOUT_FAILED', 'RATE_LIMITED', 'INSUFFICIENT_PERMISSIONS', 'FAILED');

-- CreateEnum
CREATE TYPE "PortfolioCreationStep" AS ENUM ('VALIDATION', 'AUTHENTICATION', 'BALANCE_RETRIEVAL', 'DATABASE_STORAGE', 'COMPLETION');

-- CreateEnum
CREATE TYPE "Exchanges" AS ENUM ('ALL', 'BINANCE', 'MEXC', 'OKX', 'COINBASE', 'COINBASEEXCHANGE', 'COINBASEINTERNATIONAL', 'KRAKEN', 'KRAKENFUTURES', 'BYBIT', 'BITGET', 'GATE', 'HUOBI', 'HTX', 'KUCOIN', 'KUCOINFUTURES', 'CRYPTOCOM', 'BITFINEX', 'BITMEX', 'BITSTAMP', 'GEMINI', 'BITMART', 'BITRUE', 'ASCENDEX', 'PROBIT', 'POLONIEX', 'LBANK', 'PHEMEX', 'WOO', 'WOOFIPRO', 'DERIBIT', 'BINGX', 'HASHKEY', 'COINEX', 'WHITEBIT', 'XT', 'MEXC3', 'P2B', 'TRADEOGRE', 'NDAX', 'OXFUN', 'BLOFIN', 'COINCATCH', 'BINANCEUS', 'BINANCEUSDM', 'BINANCECOINM', 'OKCOIN', 'MYOKX', 'OKXUS', 'BITHUMB', 'UPBIT', 'COINONE', 'HUOBIJP', 'BITFLYER', 'COINCHECK', 'BITBANK', 'ZAIF', 'BTCBOX', 'INDODAX', 'TOKOCRYPTO', 'COINSPH', 'NOVADAX', 'MERCADO', 'BITSO', 'BTCTURK', 'BTCALPHA', 'EXMO', 'BITTEAM', 'KUNA', 'LATOKEN', 'HYPERLIQUID', 'VERTEX', 'PARADEX', 'DERIVE', 'APEX', 'DEFX', 'WOOFIPRO_DEX', 'IDEX', 'WAVESEXCHANGE', 'MODETRADE', 'ALPACA', 'BEQUANT', 'BIGONE', 'BIT2C', 'BITBNS', 'BITOPRO', 'BITVAVO', 'BL3P', 'BLOCKCHAINCOM', 'BTCMARKETS', 'CEX', 'COINLIST', 'COINMATE', 'COINMETRO', 'COINSPOT', 'CRYPTOMUS', 'DELTA', 'DIGIFINEX', 'ELLIPX', 'FMFWIO', 'HOLLAEX', 'INDEPENDENTRESERVE', 'LUNO', 'OCEANEX', 'ONETRADING', 'PAYMIUM', 'TIMEX', 'YOBIT', 'ZONDA', 'HITBTC', 'HUOBI_LEGACY');

-- AlterEnum
ALTER TYPE "PaymentProvider" ADD VALUE 'METAMASK';

-- DropForeignKey
ALTER TABLE "OKXCryptoPortfolio" DROP CONSTRAINT "OKXCryptoPortfolio_cryptoPortfolioId_fkey";

-- AlterTable
ALTER TABLE "CreatePortfolioExecution" DROP COLUMN "status",
DROP COLUMN "time",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentMilestone" "PortfolioCreationMilestone",
ADD COLUMN     "currentStep" "PortfolioCreationStep",
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "exchangeType" "Exchanges",
ADD COLUMN     "executionContext" JSONB,
ADD COLUMN     "maxRetries" SMALLINT NOT NULL DEFAULT 3,
ADD COLUMN     "progressPercent" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "recoveryAction" "ErrorRecoveryAction",
ADD COLUMN     "retryCount" SMALLINT NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CryptoPortfolio" DROP COLUMN "exchanges",
ADD COLUMN     "exchanges" "Exchanges" NOT NULL DEFAULT 'BINANCE';

-- DropTable
DROP TABLE "OKXCryptoPortfolio";

-- DropEnum
DROP TYPE "CEXExchanges";

-- DropEnum
DROP TYPE "CreateExecutionStatus";

-- CreateTable
CREATE TABLE "PassphraseCryptoPortfolio" (
    "id" TEXT NOT NULL,
    "cryptoPortfolioId" TEXT NOT NULL,
    "passphrase" TEXT NOT NULL,

    CONSTRAINT "PassphraseCryptoPortfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaMaskPaymentMethod" (
    "id" SERIAL NOT NULL,
    "paymentMethodId" INTEGER NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "ensName" TEXT,

    CONSTRAINT "MetaMaskPaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaMaskPaymentTransaction" (
    "id" SERIAL NOT NULL,
    "paymentTransactionId" INTEGER NOT NULL,
    "transactionHash" TEXT NOT NULL,
    "tokenAddress" TEXT,
    "tokenSymbol" TEXT NOT NULL,
    "blockNumber" INTEGER,
    "gasUsed" TEXT,
    "gasPrice" TEXT,

    CONSTRAINT "MetaMaskPaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PassphraseCryptoPortfolio_cryptoPortfolioId_key" ON "PassphraseCryptoPortfolio"("cryptoPortfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "MetaMaskPaymentMethod_paymentMethodId_key" ON "MetaMaskPaymentMethod"("paymentMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "MetaMaskPaymentMethod_walletAddress_key" ON "MetaMaskPaymentMethod"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "MetaMaskPaymentTransaction_paymentTransactionId_key" ON "MetaMaskPaymentTransaction"("paymentTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "MetaMaskPaymentTransaction_transactionHash_key" ON "MetaMaskPaymentTransaction"("transactionHash");

-- AddForeignKey
ALTER TABLE "PassphraseCryptoPortfolio" ADD CONSTRAINT "PassphraseCryptoPortfolio_cryptoPortfolioId_fkey" FOREIGN KEY ("cryptoPortfolioId") REFERENCES "CryptoPortfolio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatePortfolioExecution" ADD CONSTRAINT "CreatePortfolioExecution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaMaskPaymentMethod" ADD CONSTRAINT "MetaMaskPaymentMethod_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "PaymentMethod"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MetaMaskPaymentTransaction" ADD CONSTRAINT "MetaMaskPaymentTransaction_paymentTransactionId_fkey" FOREIGN KEY ("paymentTransactionId") REFERENCES "PaymentTransaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
