import { prisma } from "@/utils/prismaClient";

import { TaskList } from "./TaskList";
import { CreateTaskDialog } from "../components/CreateTaskDialog";
import { TaskDetailsDialog } from "../components/TaskDetailsDialog";

type Props = {
  userId: string;
  workspaceId: number;
  taskId?: number;
};

export async function WorkspaceView({ userId, workspaceId, taskId }: Props) {
  const workspace = await prisma.userWorkspace.findFirst({
    where: {
      workspaceId,
      userId,
    },
    include: {
      workspace: true,
    },
  });

  if (!workspace) return <div>workspace does not exist</div>;

  const statuses = await prisma.status.findMany();

  const tasks = await prisma.task.findMany({
    where: { workspaceId, deletedAt: null },
    include: {
      status: true,
    },
    orderBy: [{ sortOrder: "desc" }, { updatedAt: "desc" }],
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

  if (!!taskId && !tasks.some(({ id }) => id === taskId)) {
    return <div>task does not exist</div>;
  }

  const selectedTask = tasks.find(({ id }) => id === taskId);

  const clientSelectedTask = selectedTask
    ? // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (({ sortOrder, ...rest }) => rest)(selectedTask)
    : undefined;

  return (
    <div className="flex flex-1 flex-col px-4 sm:px-6 lg:px-12 gap-6 lg:gap-8">
      <div className="text-2xl font-bold text-center sm:text-left">
        {workspace.workspace.name}
      </div>
      <CreateTaskDialog workspaceId={workspaceId} />
      <div className="flex flex-1 flex-col sm:flex-row gap-4 lg:gap-6">
        {tasksByStatus.map(({ id: statusId, name, tasks }, statusIdx) => (
          <TaskList
            key={statusId}
            statusId={statusId}
            statusName={name}
            tasks={tasks.map((task) => ({
              ...task,
              sortOrder: task.sortOrder.toString(),
            }))}
            nextStatusId={statuses[statusIdx + 1]?.id}
          />
        ))}
      </div>
      <TaskDetailsDialog
        task={clientSelectedTask}
        viewPath={`/workspaces/${workspaceId}`}
      />
    </div>
  );
}
