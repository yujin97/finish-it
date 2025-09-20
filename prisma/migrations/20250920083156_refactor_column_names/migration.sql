/*
  Warnings:

  - You are about to drop the column `user_id` on the `users_workspaces` table. All the data in the column will be lost.
  - Added the required column `userId` to the `users_workspaces` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."users_workspaces" DROP COLUMN "user_id",
ADD COLUMN     "userId" TEXT NOT NULL;
