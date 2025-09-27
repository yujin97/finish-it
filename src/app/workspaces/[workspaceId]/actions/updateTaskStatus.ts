"use server";
import { prisma } from "@/utils/prismaClient";
import { changeTaskStatus } from "@prisma-generated/sql";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function updateTaskStatus(
  taskId: number,
  statusId: number,
  workspaceId: number,
) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) throw new Error("Unauthorized User");

  await prisma.userWorkspace.findFirstOrThrow({
    where: {
      userId,
      workspaceId,
    },
  });

  await prisma.$queryRawTyped(changeTaskStatus(taskId, workspaceId, statusId));

  revalidatePath(`/workspaces/${workspaceId}`);
}
