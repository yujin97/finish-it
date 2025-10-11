import { auth } from "@clerk/nextjs/server";

import { WorkspaceView } from "../../components/WorkspaceView";

type PageParams = {
  workspaceId: string;
  taskId: string;
};

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { workspaceId, taskId } = await params;

  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) return <div>Please Signin</div>;

  const workspaceIdNumber = Number(workspaceId);
  const taskIdNumber = Number(taskId);

  return (
    <WorkspaceView
      workspaceId={workspaceIdNumber}
      taskId={taskIdNumber}
      userId={userId}
    />
  );
}
