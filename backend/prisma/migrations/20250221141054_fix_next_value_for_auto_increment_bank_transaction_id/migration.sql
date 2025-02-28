-- AlterTable
CREATE SEQUENCE banktransaction_id_seq;
ALTER TABLE "BankTransaction" ALTER COLUMN "id" SET DEFAULT nextval('banktransaction_id_seq');
ALTER SEQUENCE banktransaction_id_seq OWNED BY "BankTransaction"."id";
