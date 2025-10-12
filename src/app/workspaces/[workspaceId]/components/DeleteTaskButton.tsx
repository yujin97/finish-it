"use client";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { deleteTask } from "../db/deleteTask";

type Props = {
  workspaceId: number;
  taskId: number;
};

export function DeleteTaskButton({ workspaceId, taskId }: Props) {
  const deleteTaskWithIds = deleteTask
    .bind(null, workspaceId)
    .bind(null, taskId);

  const [, formAction, isPending] = useActionState(deleteTaskWithIds, null);

  return (
    <form action={formAction}>
      <Button type="submit" variant="destructive" disabled={isPending}>
        Delete
      </Button>
    </form>
  );
}
