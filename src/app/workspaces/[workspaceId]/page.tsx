import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/utils/prismaClient";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TaskCard } from "./components/TaskCard";

type PageParams = {
  workspaceId: string;
};

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { workspaceId } = await params;

  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) return <div>Please Signin</div>;

  const workspaceIdNumber = Number(workspaceId);

  const workspace = await prisma.userWorkspace.findFirst({
    where: {
      workspaceId: workspaceIdNumber,
      userId,
    },
    include: {
      workspace: true,
    },
  });

  if (!workspace) return <div>workspace does not exist</div>;

  const statuses = await prisma.status.findMany();

  const tasks = await prisma.task.findMany({
    where: { workspaceId: workspaceIdNumber },
    include: {
      status: true,
    },
  });

  const tasksByStatus = statuses.map(({ id, name }) => {
    const tasksOfStatus: typeof tasks = [];
    tasks.forEach((task) => {
      if (task.status.id === id) {
        tasksOfStatus.push(task);
      }
    });

    return {
      id,
      name,
      tasks: tasksOfStatus,
    };
  });

  return (
    <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-12 gap-6 lg:gap-8">
      <div className="text-2xl font-bold text-center sm:text-left">
        {workspace.workspace.name}
      </div>
      <div className="flex flex-1 flex-col sm:flex-row gap-4 lg:gap-6">
        {tasksByStatus.map(({ id, name, tasks }) => (
          <Card key={id} className="w-full sm:flex-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">{name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 max-h-96 lg:max-h-none overflow-y-auto lg:overflow-visible">
              {tasks.map(({ id, title, description }) => (
                <TaskCard key={id} title={title} description={description} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
