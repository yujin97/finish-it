"use client";
import { useState, useEffect } from "react";
import { Task, Status } from "@prisma-generated/client";
import {
  DndContext,
  PointerSensor,
  useSensor,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/helpers";

import { TaskList } from "./TaskList";

type ClientTask = Omit<Task, "sortOrder"> & {
  sortOrder: string;
  status: Status;
};

type SortableTask = ClientTask & {
  sortId: string;
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

const mapTasksBystatusListToSortableList = (
  tasksByStatusList: TasksByStatus[],
) =>
  tasksByStatusList.reduce<Record<string, SortableTask[]>>(
    (result, { id, tasks }) => {
      const sortableTasks = tasks.map((task) => ({
        ...task,
        sortId: `$task${task.id}`,
      }));
      result[`taskList${id}`] = sortableTasks;
      return result;
    },
    {},
  );

export function TaskLists({ tasksByStatusList, statuses }: Props) {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      delay: 150,
      tolerance: 0,
    },
  });

  const [sortableTasksByStatusList, setSortableTasksByStatusList] = useState(
    mapTasksBystatusListToSortableList(tasksByStatusList),
  );

  useEffect(() => {
    setSortableTasksByStatusList(
      mapTasksBystatusListToSortableList(tasksByStatusList),
    );
  }, [tasksByStatusList]);

  function findContainer(id: string) {
    if (id in sortableTasksByStatusList) {
      return id;
    }

    let containerId: string | null = null;

    for (const [parentId, tasks] of Object.entries(sortableTasksByStatusList)) {
      if (tasks.some(({ sortId }) => sortId === id)) {
        containerId = parentId;
        break;
      }
    }

    return containerId;
  }
  return (
    <DndContext
      id="taskLists"
      sensors={[pointerSensor]}
      collisionDetection={closestCorners}
      onDragOver={(event) => {
        const { active, over } = event;

        if (!over) return;

        const { id } = active;
        const { id: overId } = over;

        if (typeof id !== "string" || typeof overId !== "string") return;

        // Find the containers
        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
          !activeContainer ||
          !overContainer ||
          activeContainer === overContainer
        ) {
          return;
        }

        setSortableTasksByStatusList((prev) => {
          const activeItems = prev[activeContainer];
          const overItems = prev[overContainer];

          // Find the indexes for the items
          const activeIndex = activeItems.findIndex(
            ({ sortId }) => sortId === id,
          );
          const overIndex = overItems.findIndex(
            ({ sortId }) => sortId === overId,
          );

          let newIndex;
          if (overId in prev) {
            // We're at the root droppable of a container
            newIndex = overItems.length + 1;
          } else {
            const isBelowLastItem =
              (over &&
                overIndex === overItems.length - 1 &&
                active.rect.current?.translated?.top) ||
              0 > over.rect.top + over.rect.height;

            const modifier = isBelowLastItem ? 1 : 0;

            newIndex =
              overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
          }

          return {
            ...prev,
            [activeContainer]: [
              ...prev[activeContainer].filter(
                ({ sortId }) => sortId !== active.id,
              ),
            ],
            [overContainer]: [
              ...prev[overContainer].slice(0, newIndex),
              sortableTasksByStatusList[activeContainer][activeIndex],
              ...prev[overContainer].slice(
                newIndex,
                prev[overContainer].length,
              ),
            ],
          };
        });
      }}
      onDragEnd={(event) => {
        const { active, over } = event;
        const { id } = active;
        if (!over) return;
        const { id: overId } = over;
        if (typeof id !== "string" || typeof overId !== "string") return;

        const activeContainer = findContainer(id);
        const overContainer = findContainer(overId);

        if (
          !activeContainer ||
          !overContainer ||
          activeContainer !== overContainer
        ) {
          return;
        }

        setSortableTasksByStatusList((prev) => {
          const activeIndex = prev[activeContainer].findIndex(
            ({ sortId }) => sortId === id,
          );
          const overIndex = prev[overContainer].findIndex(
            ({ sortId }) => sortId === overId,
          );
          if (activeIndex !== overIndex) {
            return {
              ...prev,
              [overContainer]: arrayMove(
                prev[overContainer],
                activeIndex,
                overIndex,
              ),
            };
          }
          return prev;
        });
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
    </DndContext>
  );
}
