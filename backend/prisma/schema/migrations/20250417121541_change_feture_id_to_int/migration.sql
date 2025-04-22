/*
  Warnings:

  - The primary key for the `Feature` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Feature` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `featureId` on the `MembershipFeature` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "MembershipFeature" DROP CONSTRAINT "MembershipFeature_featureId_fkey";

-- AlterTable
ALTER TABLE "Feature" DROP CONSTRAINT "Feature_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Feature_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "MembershipFeature" DROP COLUMN "featureId",
ADD COLUMN     "featureId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MembershipFeature" ADD CONSTRAINT "MembershipFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
