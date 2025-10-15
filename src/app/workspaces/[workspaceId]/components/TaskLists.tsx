"use client";
import { Task, Status } from "@prisma-generated/client";
import { DndContext, useSensor, MouseSensor, TouchSensor } from "@dnd-kit/core";

import { TaskList } from "./TaskList";

type ClientTask = Omit<Task, "sortOrder"> & {
  sortOrder: string;
  status: Status;
};

type TasksByStatus = {
  id: number;
  name: string;
  tasks: ClientTask[];
};

type Props = {
  tasksByStatusList: TasksByStatus[];
  statuses: Status[];
};

export function TaskLists({ tasksByStatusList, statuses }: Props) {
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 0,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 0,
    },
  });

  return (
    <DndContext id="task-lists" sensors={[mouseSensor, touchSensor]}>
      <div className="flex flex-1 flex-col sm:flex-row gap-4 lg:gap-6">
        {tasksByStatusList.map(({ id: statusId, name, tasks }, statusIdx) => (
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
    </DndContext>
  );
}
