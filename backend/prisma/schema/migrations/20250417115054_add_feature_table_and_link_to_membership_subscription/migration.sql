-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('CRYPTO', 'EXPENSE');

-- CreateTable
CREATE TABLE "Feature" (
    "id" TEXT NOT NULL,
    "type" "FeatureType" NOT NULL,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "planId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipFeature_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MembershipFeature" ADD CONSTRAINT "MembershipFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MembershipPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembershipFeature" ADD CONSTRAINT "MembershipFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "Feature"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
