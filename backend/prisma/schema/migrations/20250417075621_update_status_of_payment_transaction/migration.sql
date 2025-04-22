/*
  Warnings:

  - The values [PENDING,SUCCEEDED,FAILED,REFUNDED,PARTIALLY_REFUNDED,REQUIRES_ACTION] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('authorized', 'authorized_flagged', 'canceled', 'captured', 'error', 'action_required', 'pending_no_action_required', 'created', 'unknown', 'dropped');
ALTER TABLE "PaymentTransaction" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
COMMIT;
