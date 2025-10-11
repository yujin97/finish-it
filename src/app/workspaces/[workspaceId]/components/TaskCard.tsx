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
  title: string;
  description: string;
  nextAction?: {
    label: string;
    taskId: number;
    nextStatusId: number;
    workspaceId: number;
    onNextActionClick: (
      taskId: number,
      statusId: number,
      workspaceId: number,
    ) => Promise<void>;
  };
};

export function TaskCard({
  workspaceId,
  taskId,
  title,
  description,
  nextAction,
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
        {!!nextAction && (
          <CardFooter>
            <TaskActionButton
              label={nextAction.label}
              taskId={nextAction.taskId}
              workspaceId={nextAction.workspaceId}
              nextStatusId={nextAction.nextStatusId}
              action={nextAction.onNextActionClick}
            />
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
