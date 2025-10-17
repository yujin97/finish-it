import { prisma } from "@/utils/prismaClient";

import { TaskDetailsDialog } from "../../../components/TaskDetailsDialog";

type PageParams = {
  taskId: string;
};

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { taskId } = await params;

  const task = await prisma.task.findFirst({
    where: {
      id: Number(taskId),
    },
  });

  if (!task) return null;

  const { sortOrder: __sortOrder, ...clientTask } = task;

  return <TaskDetailsDialog task={clientTask} />;
}
