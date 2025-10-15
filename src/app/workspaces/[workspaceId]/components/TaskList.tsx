"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { Task } from "@prisma-generated/client";

import { TaskCard } from "./TaskCard";

type ClientTask = Omit<Task, "sortOrder"> & {
  sortOrder: string;
};

type Props = {
  statusId: number;
  statusName: string;
  tasks: ClientTask[];
  nextStatusId: number;
};

export function TaskList({ statusId, statusName, tasks, nextStatusId }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: `taskList${statusId}` });
  const isOverStyle = isOver ? "bg-greeen-200" : "";

  return (
    <Card
      key={statusId}
      ref={setNodeRef}
      className={`w-full sm:flex-1 ${isOverStyle}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{statusName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 max-h-96 lg:max-h-none overflow-y-auto lg:overflow-visible">
        {tasks.map(({ id: taskId, title, description, workspaceId }) => {
          return (
            <TaskCard
              key={taskId}
              taskId={taskId}
              workspaceId={workspaceId}
              statusId={statusId}
              title={title}
              description={description}
              nextStatusId={nextStatusId}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
