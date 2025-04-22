/*
  Warnings:

  - Added the required column `userId` to the `EventRecurrence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventRecurrence" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "EventRecurrence" ADD CONSTRAINT "EventRecurrence_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
