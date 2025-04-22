/*
  Warnings:

  - You are about to drop the column `eventId` on the `EventRecurrence` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "EventRecurrence_eventId_key";

-- AlterTable
ALTER TABLE "EventRecurrence" DROP COLUMN "eventId";
