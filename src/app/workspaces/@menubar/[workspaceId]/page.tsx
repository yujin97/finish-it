import { auth } from "@clerk/nextjs/server";
import { Card, CardContent } from "@/components/ui/card";
import { CreateTaskDialog } from "../../components/CreateWorkspaceDialog";

import { prisma } from "@/utils/prismaClient";
import { WorkspaceSelect } from "./components/WorkspaceSelect";

type PageParams = {
  params: Promise<{ workspaceId: string }>;
};

export default async function Page({ params }: PageParams) {
  const { workspaceId } = await params;
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) return null;

  const workspaces = await prisma.userWorkspace.findMany({
    include: {
      workspace: true,
    },
    where: {
      userId,
    },
  });

  const currentWorkspace = workspaces.find(
    ({ workspaceId: wsId }) => wsId === Number(workspaceId),
  );
  if (!currentWorkspace) return null;

  return (
    <Card>
      <CardContent>
        <div className="flex gap-2">
          <WorkspaceSelect
            currentWorkspace={{
              id: currentWorkspace.workspaceId,
              name: currentWorkspace.workspace.name,
            }}
            workspaces={workspaces.map(
              ({ workspaceId, workspace: { name } }) => ({
                id: workspaceId,
                name,
              }),
            )}
          />
          <CreateTaskDialog />
        </div>
      </CardContent>
    </Card>
  );
}
