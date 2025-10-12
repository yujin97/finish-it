"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DeleteTaskButton } from "../components/DeleteTaskButton";

import { Task } from "@prisma-generated/client";

type Props = {
  task?: Omit<Task, "sortOrder">;
  viewPath: string;
};

export function TaskDetailsDialog({ task, viewPath }: Props) {
  const router = useRouter();
  const open = !!task;

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          router.push(viewPath);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 w-full max-w-sm gap-3 flex-col items-start">
          <label htmlFor="name">Name:</label>
          <Input
            id="name"
            placeholder="A very cool task"
            defaultValue={task.title}
          />
        </div>
        <div className="flex flex-1 w-full max-w-sm gap-3 flex-col items-start">
          <label htmlFor="description">Description:</label>
          <Textarea
            id="description"
            placeholder="Doing cool stuffs"
            defaultValue={task.description}
          />
        </div>
        <DialogFooter>
          <DeleteTaskButton workspaceId={task.workspaceId} taskId={task.id} />
          <Button type="submit">Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
