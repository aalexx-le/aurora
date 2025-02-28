-- CreateTable
CREATE TABLE "AutoBankManager" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "bankManagerId" TEXT NOT NULL,

    CONSTRAINT "AutoBankManager_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AutoBankManager_bankManagerId_key" ON "AutoBankManager"("bankManagerId");

-- AddForeignKey
ALTER TABLE "AutoBankManager" ADD CONSTRAINT "AutoBankManager_bankManagerId_fkey" FOREIGN KEY ("bankManagerId") REFERENCES "BankManager"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
