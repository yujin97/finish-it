/*
  Warnings:

  - A unique constraint covering the columns `[workspace_id,sort_order]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tasks_workspace_id_sort_order_key" ON "public"."tasks"("workspace_id", "sort_order");
