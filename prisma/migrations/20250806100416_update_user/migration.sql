/*
  Warnings:

  - The `subscriptionLevel` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `planType` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'UNPAID', 'TRIALING', 'INCOMPLETE', 'INCOMPLETE_EXPIRED');

-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "status",
ADD COLUMN     "status" "public"."SubscriptionStatus" NOT NULL,
DROP COLUMN "planType",
ADD COLUMN     "planType" "public"."SubscriptionPlan" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "subscriptionLevel",
ADD COLUMN     "subscriptionLevel" "public"."SubscriptionPlan" NOT NULL DEFAULT 'FREE';
