-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_bankTransactionId_fkey";

-- AlterTable
ALTER TABLE "BankTransaction"
DROP CONSTRAINT "BankTransaction_pkey",
ADD COLUMN "new_id" INTEGER;

-- Convert existing string IDs to integers
UPDATE "BankTransaction" SET "new_id" = CAST("id" AS INTEGER);

-- Remove old text column
ALTER TABLE "BankTransaction" DROP COLUMN "id";

-- Rename new column and add primary key
ALTER TABLE "BankTransaction" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_pkey" PRIMARY KEY ("id");

-- Convert Expense references
ALTER TABLE "Expense" ALTER COLUMN "bankTransactionId" TYPE INTEGER 
USING ("bankTransactionId"::INTEGER);

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_bankTransactionId_fkey" FOREIGN KEY ("bankTransactionId") REFERENCES "BankTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;