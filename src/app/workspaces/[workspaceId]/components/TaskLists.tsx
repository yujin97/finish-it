"use client";
import { useState } from "react";
import { Task, Status } from "@prisma-generated/client";
import { DragDropProvider, PointerSensor } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { arrayMove } from "@dnd-kit/helpers";

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
  const pointerSensor = PointerSensor.configure({
    activationConstraints: {
      delay: { value: 150, tolerance: 0 },
    },
  });

  const [sortableTasksByStatusList, setSortableTasksByStatusList] = useState(
    tasksByStatusList.reduce<Record<string, ClientTask[]>>(
      (result, { id, tasks }) => {
        result[`taskList${id}`] = tasks;
        return result;
      },
      {},
    ),
  );

  return (
    <DragDropProvider
      sensors={[pointerSensor]}
      onDragEnd={(event) => {
        const {
          operation: { source },
        } = event;
        if (isSortable(source)) {
          const {
            sortable: { initialIndex, index, initialGroup, group },
          } = source;
          // must exist in this use case
          if (!initialGroup || !group) {
            return;
          }
          setSortableTasksByStatusList((tasksList) => {
            const newTaskList = Object.entries(tasksList).reduce<
              Record<string, ClientTask[]>
            >((list, [status, tasks]) => {
              list[status] = [...tasks];
              return list;
            }, {});

            if (initialGroup === group) {
              const newTasks = newTaskList[group];
              newTaskList[group] = arrayMove(newTasks, initialIndex, index);
              return newTaskList;
            }

            const newSourceTasks = newTaskList[initialGroup];
            const newTargetTasks = newTaskList[group];
            const [draggedTask] = newSourceTasks.splice(initialIndex, 1);
            newTargetTasks.splice(index, 0, draggedTask);
            newTaskList[initialGroup] = newSourceTasks;
            newTaskList[group] = newTargetTasks;
            return newTaskList;
          });
        } else {
          return;
        }
      }}
    >
      <div className="flex flex-1 flex-col sm:flex-row gap-4 lg:gap-6">
        {Object.entries(sortableTasksByStatusList).map(
          ([statusId, tasks], statusIdx) => (
            <TaskList
              key={statusId}
              statusId={statusId}
              statusName={tasksByStatusList[statusIdx].name}
              tasks={tasks.map((task) => ({
                ...task,
                sortOrder: task.sortOrder.toString(),
              }))}
              nextStatusId={statuses[statusIdx + 1]?.id}
            />
          ),
        )}
      </div>
    </DragDropProvider>
  );
}
