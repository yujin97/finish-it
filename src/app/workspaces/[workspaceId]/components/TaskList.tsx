"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { Task } from "@prisma-generated/client";

import { TaskCard } from "./TaskCard";

type ClientTask = Omit<Task, "sortOrder"> & {
  sortOrder: string;
};

type Props = {
  statusId: string;
  statusName: string;
  tasks: ClientTask[];
  nextStatusId: number;
};

export function TaskList({ statusId, statusName, tasks, nextStatusId }: Props) {
  const { isDropTarget, ref } = useDroppable({
    id: statusId,
    type: "column",
    accept: "item",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <Card
      key={statusId}
      ref={ref}
      className={`w-full sm:flex-1 ${isDropTarget ? "bg-green-200/50" : ""}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{statusName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 max-h-96 lg:max-h-none overflow-y-auto lg:overflow-visible">
        {tasks.map(({ id: taskId, title, description, workspaceId }, index) => {
          return (
            <TaskCard
              key={taskId}
              taskId={taskId}
              workspaceId={workspaceId}
              statusId={statusId}
              title={title}
              description={description}
              nextStatusId={nextStatusId}
              index={index}
            />
          );
        })}
      </CardContent>
    </Card>
  );
}
