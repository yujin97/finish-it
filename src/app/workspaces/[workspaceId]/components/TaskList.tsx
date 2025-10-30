"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "@prisma-generated/client";

import { TaskCard } from "./TaskCard";

type ClientTask = Omit<Task, "sortOrder"> & {
  sortOrder: string;
};

type SortableTask = ClientTask & {
  sortId: string;
};

type Props = {
  statusId: string;
  statusName: string;
  tasks: SortableTask[];
  nextStatusId: number;
};

export function TaskList({ statusId, statusName, tasks, nextStatusId }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: statusId });

  const sortableItems = tasks.map(({ sortId }) => sortId);

  return (
    <Card
      key={statusId}
      ref={setNodeRef}
      className={`w-full sm:flex-1 ${isOver ? "bg-green-200/50" : ""}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{statusName}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 max-h-96 lg:max-h-none overflow-y-auto lg:overflow-visible">
        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map(
            ({ id: taskId, sortId, title, description, workspaceId }) => {
              return (
                <TaskCard
                  key={taskId}
                  sortId={sortId}
                  taskId={taskId}
                  workspaceId={workspaceId}
                  title={title}
                  description={description}
                  nextStatusId={nextStatusId}
                />
              );
            },
          )}
        </SortableContext>
      </CardContent>
    </Card>
  );
}
