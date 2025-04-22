/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `categoryId` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `EventCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `EventCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Recurrence` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Recurrence` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `eventId` on the `Recurrence` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Recurrence" DROP CONSTRAINT "Recurrence_eventId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER,
ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "EventCategory" DROP CONSTRAINT "EventCategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "EventCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Recurrence" DROP CONSTRAINT "Recurrence_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "eventId",
ADD COLUMN     "eventId" INTEGER NOT NULL,
ADD CONSTRAINT "Recurrence_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Recurrence_eventId_key" ON "Recurrence"("eventId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "EventCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recurrence" ADD CONSTRAINT "Recurrence_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
