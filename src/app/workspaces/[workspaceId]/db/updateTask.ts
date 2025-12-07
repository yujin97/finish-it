"use server";
import { prisma } from "@/utils/prismaClient";
import { auth } from "@clerk/nextjs/server";
import { taskSchema, CreateTaskFormData } from "../schemas/createTaskFormData";
import { revalidatePath } from "next/cache";

type Parameters = {
  taskId: number;
  workspaceId: number;
  data: CreateTaskFormData;
};

type UpdateTaskResult =
  | { success: true; data: { id: number; title: string; description: string } }
  | {
      success: false;
      error:
        | "SESSION_EXPIRED"
        | "WORKSPACE_ACCESS_DENIED"
        | "VALIDATION_ERROR"
        | "TASK_NOT_FOUND"
        | "UNKNOWN_ERROR";
    };

export async function updateTask({
  taskId,
  workspaceId,
  data,
}: Parameters): Promise<UpdateTaskResult> {
  try {
    // 1. Auth check
    const { isAuthenticated, userId } = await auth();
    if (!isAuthenticated || !userId) {
      return { success: false, error: "SESSION_EXPIRED" };
    }

    // 2. Workspace access check
    const userWorkspace = await prisma.userWorkspace.findFirst({
      where: { userId, workspaceId, deletedAt: null },
    });

    if (!userWorkspace) {
      return { success: false, error: "WORKSPACE_ACCESS_DENIED" };
    }

    // 3. Validate data
    const parseResult = taskSchema.safeParse(data);
    if (!parseResult.success) {
      return { success: false, error: "VALIDATION_ERROR" };
    }

    const { name, description } = parseResult.data;

    // 4. Verify task exists and belongs to workspace
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, workspaceId, deletedAt: null },
    });

    if (!existingTask) {
      return { success: false, error: "TASK_NOT_FOUND" };
    }

    // 5. Update task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: name,
        description,
      },
    });

    // 6. Revalidate
    revalidatePath(`/workspaces/${workspaceId}`, "layout");

    return {
      success: true,
      data: {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
      },
    };
  } catch (error) {
    console.error("Failed to update task:", error);
    return { success: false, error: "UNKNOWN_ERROR" };
  }
}
