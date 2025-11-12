"use server";
import { prisma } from "@/utils/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import * as z from "zod";

type Parameters = {
  workspaceId: number;
  taskId: number;
  newPositionTaskId: number;
};

const paramSchema = z.object({
  workspaceId: z.number(),
  taskId: z.number(),
  newPositionTaskId: z.number(),
});

export async function reorderTask(params: Parameters) {
  const { isAuthenticated, userId } = await auth();
  if (!isAuthenticated || !userId) throw new Error("Unauthorized User");

  const sanitizedParams = paramSchema.parse(params);

  const { workspaceId, taskId, newPositionTaskId } = sanitizedParams;

  await prisma.userWorkspace.findFirstOrThrow({
    where: {
      userId,
      workspaceId,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    // lock the tasks in the target workspace
    await tx.$executeRaw`
        SELECT * from "tasks"
        WHERE "workspace_id" = ${workspaceId}
        ORDER BY "sort_order"
        FOR UPDATE
    `;

    const newPositionTask = await tx.task.findUnique({
      where: { id: newPositionTaskId },
    });

    if (!newPositionTask) throw new Error("invalid target");

    const targetTask = await tx.task.findUnique({
      where: { id: taskId },
    });

    if (!targetTask) throw new Error("invalid target");

    let sortOrderDirection: "gt" | "lt" = "gt";
    let orderByDirection: "asc" | "desc" = "asc";

    if (newPositionTask.sortOrder < targetTask.sortOrder) {
      sortOrderDirection = "lt";
      orderByDirection = "desc";
    }

    const nextTask = await tx.task.findFirst({
      where: {
        workspaceId,
        sortOrder: { [sortOrderDirection]: newPositionTask.sortOrder },
      },
      orderBy: { sortOrder: orderByDirection },
    });

    const newOrder = nextTask
      ? newPositionTask.sortOrder.add(nextTask.sortOrder).div(2)
      : newPositionTask.sortOrder.add(1000);

    return await tx.task.update({
      where: { id: taskId },
      data: { sortOrder: newOrder },
    });
  });

  if (!!result) {
    revalidatePath(`/workspaces/${workspaceId}`, "layout");
    return result.id;
  }

  return null;
}
