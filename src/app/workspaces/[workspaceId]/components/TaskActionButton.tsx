"use client";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { updateTaskStatus } from "../actions/updateTaskStatus";

type Props = {
  label: string;
  taskId: number;
  nextStatusId: number;
  workspaceId: number;
};

export function TaskActionButton({
  label,
  taskId,
  nextStatusId,
  workspaceId,
}: Props) {
  const actionWithIds = updateTaskStatus
    .bind(null, taskId)
    .bind(null, nextStatusId)
    .bind(null, workspaceId);
  const [, formAction, isPending] = useActionState(actionWithIds, null);

  return (
    <form action={formAction}>
      <Button
        disabled={isPending}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {label}
      </Button>
    </form>
  );
}
