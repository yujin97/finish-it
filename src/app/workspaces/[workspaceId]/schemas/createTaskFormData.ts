import * as z from "zod";

export const taskSchema = z.object({
  name: z.string().max(100, "name can be at most 100 characters"),
  description: z.string(),
});

export type CreateTaskFormData = z.infer<typeof taskSchema>;
