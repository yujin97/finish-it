/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `statuses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."statuses" DROP COLUMN "updatedAt",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
