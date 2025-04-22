/*
  Warnings:

  - The primary key for the `MembershipSubscription` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "PaymentTransaction" DROP CONSTRAINT "PaymentTransaction_membershipSubscriptionId_fkey";

-- AlterTable
ALTER TABLE "MembershipSubscription" DROP CONSTRAINT "MembershipSubscription_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MembershipSubscription_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MembershipSubscription_id_seq";

-- AlterTable
ALTER TABLE "PaymentTransaction" ALTER COLUMN "membershipSubscriptionId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_membershipSubscriptionId_fkey" FOREIGN KEY ("membershipSubscriptionId") REFERENCES "MembershipSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
