"use server";
import { prisma } from "@/utils/prismaClient";
import { auth } from "@clerk/nextjs/server";
import {
  workspaceSchema,
  CreateWorkspaceFormData,
} from "../schemas/createWorkspaceFormData";

type Parameters = {
  data: CreateWorkspaceFormData;
};

export async function createWorkspace({ data }: Parameters) {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) throw new Error("Unauthorized User");

  const parsedData = workspaceSchema.parse(data);
  const { name } = parsedData;

  const newWorkspace = await prisma.workspace.create({
    data: {
      name,
      creatorId: userId,
      userWorkspace: {
        create: {
          userId,
        },
      },
    },
  });

  return newWorkspace.id;
}
