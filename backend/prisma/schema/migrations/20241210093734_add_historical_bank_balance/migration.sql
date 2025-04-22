-- CreateTable
CREATE TABLE "HistoricalBankBalance" (
    "time" TIMESTAMP(3) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "bankAccountId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoricalBankBalance_bankAccountId_time_key" ON "HistoricalBankBalance"("bankAccountId", "time");

-- AddForeignKey
ALTER TABLE "HistoricalBankBalance" ADD CONSTRAINT "HistoricalBankBalance_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
