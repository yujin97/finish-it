"use server";
import { prisma } from "@/utils/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteTask(workspaceId: number, taskId: number) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) throw new Error("Unauthorized User");
  await prisma.userWorkspace.findFirstOrThrow({
    where: {
      userId,
      workspaceId,
    },
  });

  const updatedTask = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  if (!!updatedTask) {
    revalidatePath(`/workspaces/${workspaceId}`, "layout");
    redirect(`/workspaces/${workspaceId}`);
  }

  return null;
}
