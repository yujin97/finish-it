import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { TaskActionButton } from "./TaskActionButton";

type Props = {
  workspaceId: number;
  taskId: number;
  statusId: number;
  title: string;
  description: string;
  nextStatusId?: number;
};

export function TaskCard({
  workspaceId,
  taskId,
  title,
  description,
  nextStatusId,
}: Props) {
  return (
    <Link href={`/workspaces/${workspaceId}/tasks/${taskId}`}>
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium truncate">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground line-clamp-3 break-words">
            {description}
          </div>
        </CardContent>
        {!!nextStatusId && (
          <CardFooter>
            <TaskActionButton
              label="NEXT"
              taskId={taskId}
              workspaceId={workspaceId}
              nextStatusId={nextStatusId}
            />
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
