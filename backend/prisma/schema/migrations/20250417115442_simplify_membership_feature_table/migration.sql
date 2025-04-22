/*
  Warnings:

  - The primary key for the `MembershipFeature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `MembershipFeature` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `MembershipFeature` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `MembershipFeature` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MembershipFeature` table. All the data in the column will be lost.
  - The `id` column on the `MembershipFeature` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MembershipFeature" DROP CONSTRAINT "MembershipFeature_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MembershipFeature_pkey" PRIMARY KEY ("id");
