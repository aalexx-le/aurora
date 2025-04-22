-- DropForeignKey
ALTER TABLE "Recurrence" DROP CONSTRAINT "Recurrence_eventId_fkey";

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "recurrenceId" INTEGER;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_recurrenceId_fkey" FOREIGN KEY ("recurrenceId") REFERENCES "Recurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
