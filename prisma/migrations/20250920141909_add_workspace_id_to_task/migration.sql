/*
  Warnings:

  - Added the required column `workspace_id` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."tasks" ADD COLUMN     "workspace_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
