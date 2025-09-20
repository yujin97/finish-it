/*
  Warnings:

  - You are about to drop the column `userId` on the `users_workspaces` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `users_workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."users_workspaces" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;
