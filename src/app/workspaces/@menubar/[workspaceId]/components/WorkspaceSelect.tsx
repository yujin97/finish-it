"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Workspace = {
  name: string;
  id: number;
};

type Props = {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
};

export function WorkspaceSelect({ currentWorkspace, workspaces }: Props) {
  const router = useRouter();

  return (
    <Select
      defaultValue={`${currentWorkspace.id}`}
      onValueChange={(workspaceId) => {
        router.push(`/workspaces/${workspaceId}`);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Workspace" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {workspaces.map(({ id, name }) => (
            <SelectItem key={id} value={`${id}`}>
              {name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
