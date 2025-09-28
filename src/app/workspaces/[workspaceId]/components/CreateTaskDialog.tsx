"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskSchema, CreateTaskFormData } from "../schemas/createTaskFormData";
import { createTask } from "../db/createTask";

type Props = {
  workspaceId: number;
};

export function CreateTaskDialog({ workspaceId }: Props) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    console.log("submitting...");
    createTask({ data, workspaceId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="max-w-fit">Create new task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
        </DialogHeader>
        <form
          className="p-6 flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-1 w-full max-w-sm gap-3 flex-col items-start">
            <label htmlFor="name">Name:</label>
            <Input
              id="name"
              placeholder="A very cool task"
              {...register("name")}
            />
          </div>
          <div className="flex flex-1 w-full max-w-sm gap-3 flex-col items-start">
            <label htmlFor="description">Description:</label>
            <Textarea
              id="description"
              placeholder="Doing cool stuffs"
              {...register("description")}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
