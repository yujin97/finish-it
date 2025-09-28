"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  label: string;
  taskId: number;
  nextStatusId: number;
  workspaceId: number;
  action: (
    userId: number,
    statusId: number,
    workspaceId: number,
  ) => Promise<void>;
};

export function TaskActionButton({
  label,
  taskId,
  nextStatusId,
  workspaceId,
  action,
}: Props) {
  const actionWithIds = action
    .bind(null, taskId)
    .bind(null, nextStatusId)
    .bind(null, workspaceId);
  const [, formAction, isPending] = useActionState(actionWithIds, null);

  return (
    <form action={formAction}>
      <Button disabled={isPending}>{label}</Button>
    </form>
  );
}
