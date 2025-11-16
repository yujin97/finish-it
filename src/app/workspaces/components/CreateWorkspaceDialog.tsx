"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";

import {
  workspaceSchema,
  CreateWorkspaceFormData,
} from "../schemas/createWorkspaceFormData";
import { createWorkspace } from "../db/createWorkspace";

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm({
    resolver: zodResolver(workspaceSchema),
  });

  const { isSubmitting } = formState;

  const onSubmit = async (data: CreateWorkspaceFormData) => {
    const newWorkspaceId = await createWorkspace({ data });
    if (!!newWorkspaceId) {
      setOpen(false);
      reset();
      redirect(`/workspaces/${newWorkspaceId}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="max-w-fit">Create Workspace</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
        </DialogHeader>
        <form
          className="p-6 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-1 w-full max-w-sm gap-3 flex-col items-start">
            <label htmlFor="name">Name:</label>
            <Input
              id="name"
              placeholder="A very cool workspace"
              {...register("name")}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
