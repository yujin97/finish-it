/*
  Warnings:

  - A unique constraint covering the columns `[workspace_id,status_id,sort_order]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."tasks_workspace_id_sort_order_key";

-- CreateIndex
CREATE UNIQUE INDEX "tasks_workspace_id_status_id_sort_order_key" ON "public"."tasks"("workspace_id", "status_id", "sort_order");
