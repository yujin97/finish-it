"use server";
import { prisma } from "@/utils/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { taskSchema, CreateTaskFormData } from "../schemas/createTaskFormData";
import { revalidatePath } from "next/cache";

type Parameters = {
  data: CreateTaskFormData;
  workspaceId: number;
};

export async function createTask({ data, workspaceId }: Parameters) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) throw new Error("Unauthorized User");
  await prisma.userWorkspace.findFirstOrThrow({
    where: {
      userId,
      workspaceId,
    },
  });

  const parseData = taskSchema.parse(data);
  const { name, description } = parseData;

  const {
    _max: { sortOrder: maxSortOrder },
  } = await prisma.task.aggregate({
    where: {
      workspaceId,
      statusId: 1,
    },
    _max: {
      sortOrder: true,
    },
  });

  const sortOrder = maxSortOrder
    ? Math.ceil(maxSortOrder.toNumber()) + 1000
    : 0;

  const newTask = await prisma.task.create({
    data: {
      title: name,
      description,
      workspaceId,
      creatorId: userId,
      statusId: 1,
      sortOrder,
    },
  });

  if (!!newTask) {
    revalidatePath(`/workspaces/${workspaceId}`, "layout");
    return newTask.id;
  }

  return null;
}
