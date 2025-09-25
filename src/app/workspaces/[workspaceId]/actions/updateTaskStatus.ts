"use server";
import { prisma } from "@/utils/prismaClient";
import { changeTaskStatus } from "@prisma-generated/sql";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(
  taskId: number,
  statusId: number,
  workspaceId: number,
) {
  await prisma.$queryRawTyped(changeTaskStatus(taskId, workspaceId, statusId));

  revalidatePath(`/workspaces/${workspaceId}`);
}
