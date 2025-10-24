"use client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSortable } from "@dnd-kit/react/sortable";
import { useEffect, useState } from "react";

import { TaskActionButton } from "./TaskActionButton";

type Props = {
  workspaceId: number;
  taskId: number;
  statusId: string;
  title: string;
  description: string;
  nextStatusId?: number;
  index: number;
};

export function TaskCard({
  workspaceId,
  taskId,
  statusId,
  title,
  description,
  nextStatusId,
  index,
}: Props) {
  const [shouldPreventClick, setShouldPreventClick] = useState<boolean>(false);

  const { ref, isDragging } = useSortable({
    id: `task${taskId}`,
    index,
    type: "item",
    accept: "item",
    group: statusId,
  });

  useEffect(() => {
    if (isDragging) {
      setShouldPreventClick(true);
    } else if (shouldPreventClick) {
      const timer = setTimeout(() => setShouldPreventClick(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging, shouldPreventClick]);

  return (
    <Link
      ref={ref}
      data-dragging={isDragging}
      href={`/workspaces/${workspaceId}/tasks/${taskId}`}
      onClickCapture={(event) => {
        if (shouldPreventClick) {
          event.preventDefault();
        }
      }}
    >
      <Card className={`hover:shadow-md transition-shadow duration-200`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium truncate">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground line-clamp-3 break-words">
            {description}
          </div>
        </CardContent>
        {!!nextStatusId && (
          <CardFooter>
            <TaskActionButton
              label="NEXT"
              taskId={taskId}
              workspaceId={workspaceId}
              nextStatusId={nextStatusId}
            />
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
