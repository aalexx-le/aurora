CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- CreateEnum
CREATE TYPE "Interval" AS ENUM ('1m', '5m', '15m', '30m', '1h', '1day');

-- CreateEnum
CREATE TYPE "TradingType" AS ENUM ('FUTURES', 'SPOT');

-- CreateEnum
CREATE TYPE "OtpPurpose" AS ENUM ('VERIFY_ACCOUNT', 'RESET_PASSWORD');

-- CreateTable
CREATE TABLE "UserCryptoProfile" (
    "profileId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "exchanges" TEXT NOT NULL DEFAULT 'binance',
    "tradingType" "TradingType" NOT NULL,
    "apiKey" TEXT NOT NULL,
    "secretKey" TEXT NOT NULL,

    CONSTRAINT "UserCryptoProfile_pkey" PRIMARY KEY ("profileId")
);

-- CreateTable
CREATE TABLE "AssetBalance" (
    "id" TEXT NOT NULL,
    "cryptoProfileId" TEXT NOT NULL,
    "assetInfoId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "locked" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AssetBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "logo" TEXT NOT NULL,

    CONSTRAINT "AssetInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetPrice" (
    "assetInfoId" TEXT NOT NULL,
    "interval" TEXT NOT NULL,
    "open_time" TIMESTAMP(3) NOT NULL,
    "close_time" TIMESTAMP(3) NOT NULL,
    "openPrice" DOUBLE PRECISION NOT NULL,
    "closePrice" DOUBLE PRECISION NOT NULL,
    "highPrice" DOUBLE PRECISION NOT NULL,
    "lowPrice" DOUBLE PRECISION NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "HistoricalCryptoBalance" (
    "cryptoProfileId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "estimatedBalance" DOUBLE PRECISION NOT NULL,
    "changePercent" DOUBLE PRECISION NOT NULL,
    "changeBalance" DOUBLE PRECISION NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "otp" TEXT,
    "otpPurpose" "OtpPurpose",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);


-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "UserCryptoProfile" ADD CONSTRAINT "UserCryptoProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetBalance" ADD CONSTRAINT "AssetBalance_cryptoProfileId_fkey" FOREIGN KEY ("cryptoProfileId") REFERENCES "UserCryptoProfile"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetBalance" ADD CONSTRAINT "AssetBalance_assetInfoId_fkey" FOREIGN KEY ("assetInfoId") REFERENCES "AssetInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetPrice" ADD CONSTRAINT "AssetPrice_assetInfoId_fkey" FOREIGN KEY ("assetInfoId") REFERENCES "AssetInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricalCryptoBalance" ADD CONSTRAINT "HistoricalCryptoBalance_cryptoProfileId_fkey" FOREIGN KEY ("cryptoProfileId") REFERENCES "UserCryptoProfile"("profileId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "AssetPrice_assetInfoId_open_time_key" ON "AssetPrice"("assetInfoId", "open_time");

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalCryptoBalance_cryptoProfileId_time_key" ON "HistoricalCryptoBalance"("cryptoProfileId", "time");

-- CreateIndex
CREATE INDEX "AssetPrice_assetInfoId_open_time_desc_key" ON "AssetPrice"("assetInfoId", "open_time" desc);

-- CreateIndex
CREATE INDEX "HistoricalCryptoBalance_cryptoProfileId_time_desc_key" ON "HistoricalCryptoBalance"("cryptoProfileId", "time" desc);


SELECT create_hypertable('"AssetPrice"', 'open_time');
SELECT create_hypertable('"HistoricalCryptoBalance"', 'time');
