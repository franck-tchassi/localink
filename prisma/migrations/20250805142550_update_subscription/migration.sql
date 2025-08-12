/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `planType` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Subscription_userId_idx";

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "updatedAt",
ADD COLUMN     "planType" TEXT NOT NULL;
