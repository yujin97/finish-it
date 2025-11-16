import * as z from "zod";

export const workspaceSchema = z.object({
  name: z.string().max(50, "name can be at most 50 characters"),
});

export type CreateWorkspaceFormData = z.infer<typeof workspaceSchema>;
