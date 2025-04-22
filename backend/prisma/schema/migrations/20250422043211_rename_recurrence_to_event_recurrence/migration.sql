/*
  Warnings:

  - You are about to drop the `Recurrence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_recurrenceId_fkey";

-- DropTable
DROP TABLE "Recurrence";

-- CreateTable
CREATE TABLE "EventRecurrence" (
    "id" SERIAL NOT NULL,
    "type" "RecurrenceType" NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "daysOfWeek" TEXT,
    "dayOfMonth" INTEGER,
    "weekOfMonth" INTEGER,
    "dayOfWeek" INTEGER,
    "endDate" TIMESTAMP(3),
    "endCount" INTEGER,
    "eventId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRecurrence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventRecurrence_eventId_key" ON "EventRecurrence"("eventId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_recurrenceId_fkey" FOREIGN KEY ("recurrenceId") REFERENCES "EventRecurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
