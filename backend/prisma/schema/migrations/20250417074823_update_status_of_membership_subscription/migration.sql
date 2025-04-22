/*
  Warnings:

  - The values [ACTIVE,PAST_DUE,CANCELED,ENDED] on the enum `MembershipSubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MembershipSubscriptionStatus_new" AS ENUM ('active', 'canceled', 'past_due', 'paused', 'trialing');
ALTER TABLE "MembershipSubscription" ALTER COLUMN "status" TYPE "MembershipSubscriptionStatus_new" USING ("status"::text::"MembershipSubscriptionStatus_new");
ALTER TYPE "MembershipSubscriptionStatus" RENAME TO "MembershipSubscriptionStatus_old";
ALTER TYPE "MembershipSubscriptionStatus_new" RENAME TO "MembershipSubscriptionStatus";
DROP TYPE "MembershipSubscriptionStatus_old";
COMMIT;
