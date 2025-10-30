"use client";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";

import { TaskActionButton } from "./TaskActionButton";

type Props = {
  workspaceId: number;
  taskId: number;
  sortId: string;
  title: string;
  description: string;
  nextStatusId?: number;
};

export function TaskCard({
  workspaceId,
  taskId,
  sortId,
  title,
  description,
  nextStatusId,
}: Props) {
  const [shouldPreventClick, setShouldPreventClick] = useState<boolean>(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: sortId,
  });

  useEffect(() => {
    if (isDragging) {
      setShouldPreventClick(true);
    } else if (shouldPreventClick) {
      const timer = setTimeout(() => setShouldPreventClick(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isDragging, shouldPreventClick]);

  const dragStyles = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Link
      href={`/workspaces/${workspaceId}/tasks/${taskId}`}
      onClickCapture={(event) => {
        if (shouldPreventClick) {
          event.preventDefault();
        }
      }}
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={dragStyles}
      className={`${isDragging ? "cursor-grabbing" : "cursor-pointer"}`}
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
