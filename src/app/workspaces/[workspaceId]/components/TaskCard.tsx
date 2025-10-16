"use client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useDraggable } from "@dnd-kit/core";
import { useEffect, useState } from "react";

import { TaskActionButton } from "./TaskActionButton";

type Props = {
  workspaceId: number;
  taskId: number;
  statusId: number;
  title: string;
  description: string;
  nextStatusId?: number;
};

export function TaskCard({
  workspaceId,
  taskId,
  title,
  description,
  nextStatusId,
}: Props) {
  const [shouldPreventClick, setShouldPreventClick] = useState<boolean>(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `task${taskId}`,
    });

  useEffect(() => {
    if (isDragging) {
      setShouldPreventClick(true);
    } else if (shouldPreventClick) {
      const timer = setTimeout(() => setShouldPreventClick(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging, shouldPreventClick]);

  const transformStyle = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};

  return (
    <Link
      href={`/workspaces/${workspaceId}/tasks/${taskId}`}
      onClickCapture={(event) => {
        if (shouldPreventClick) {
          event.preventDefault();
        }
      }}
    >
      <Card
        className={`hover:shadow-md transition-shadow duration-200 ${isDragging ? "cursor-move" : "cursor-pointer"}`}
        style={{
          ...transformStyle,
        }}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
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
