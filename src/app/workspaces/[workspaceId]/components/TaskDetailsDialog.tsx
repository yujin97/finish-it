"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
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
import { taskSchema, CreateTaskFormData } from "../schemas/createTaskFormData";
import { updateTask } from "../db/updateTask";

import { Task } from "@prisma-generated/client";

type Props = {
  task?: Omit<Task, "sortOrder">;
  viewPath?: string;
};

export function TaskDetailsDialog({ task, viewPath }: Props) {
  const router = useRouter();
  const { signOut } = useClerk();
  const [isEditMode, setIsEditMode] = useState(false);
  const open = !!task;

  const { register, handleSubmit, reset, formState } =
    useForm<CreateTaskFormData>({
      resolver: zodResolver(taskSchema),
      defaultValues: {
        name: task?.title || "",
        description: task?.description || "",
      },
    });

  const { errors, isSubmitting, isDirty } = formState;

  if (!open) return null;

  const onSubmit = async (data: CreateTaskFormData) => {
    const result = await updateTask({
      taskId: task.id,
      workspaceId: task.workspaceId,
      data,
    });

    if (result.success) {
      setIsEditMode(false);
      reset({
        name: result.data.title,
        description: result.data.description,
      });
      toast.success("Task updated successfully!", { duration: 3000 });
    } else {
      // Map error codes to user-friendly messages with appropriate actions
      switch (result.error) {
        case "SESSION_EXPIRED":
          toast.error(
            <div>
              Your session has expired.{" "}
              <button
                onClick={() => signOut({ redirectUrl: window.location.href })}
                className="underline font-semibold"
              >
                Sign in again
              </button>
            </div>,
            { duration: 10000 },
          );
          break;
        case "WORKSPACE_ACCESS_DENIED":
          toast.error("You don't have access to this workspace.", {
            duration: 5000,
          });
          break;
        case "TASK_NOT_FOUND":
          toast.error("This task was not found or has been deleted.", {
            duration: 5000,
          });
          break;
        case "VALIDATION_ERROR":
          toast.error("Please check the form for errors.", { duration: 5000 });
          break;
        case "UNKNOWN_ERROR":
        default:
          toast.error("Something went wrong. Please try again.", {
            duration: 5000,
          });
          break;
      }
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        "You have unsaved changes. Are you sure you want to cancel?",
      );
      if (!confirmed) return;
    }

    reset({
      name: task.title,
      description: task.description,
    });
    setIsEditMode(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Check for unsaved changes only when in edit mode
      if (isEditMode && isDirty) {
        const confirmed = window.confirm(
          "You have unsaved changes. Are you sure you want to close?",
        );
        if (!confirmed) return;
      }

      // Navigate back
      if (viewPath) {
        router.push(viewPath);
      } else {
        router.back();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        {!isEditMode ? (
          <>
            <DialogHeader>
              <DialogTitle>Task Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 p-6">
              <div>
                <label className="font-semibold text-sm text-muted-foreground">
                  Title
                </label>
                <p className="mt-1">{task.title}</p>
              </div>
              <div>
                <label className="font-semibold text-sm text-muted-foreground">
                  Description
                </label>
                <p className="mt-1 whitespace-pre-wrap">{task.description}</p>
              </div>
            </div>

            <DialogFooter>
              <DeleteTaskButton
                workspaceId={task.workspaceId}
                taskId={task.id}
              />
              <Button onClick={() => setIsEditMode(true)}>Edit</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 p-6"
              id="edit-task-form"
            >
              <div className="flex flex-1 w-full gap-3 flex-col items-start">
                <label htmlFor="name" className="font-semibold text-sm">
                  Title
                </label>
                <Input
                  id="name"
                  placeholder="A very cool task"
                  {...register("name")}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-1 w-full gap-3 flex-col items-start">
                <label htmlFor="description" className="font-semibold text-sm">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Doing cool stuffs"
                  {...register("description")}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </form>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-task-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
