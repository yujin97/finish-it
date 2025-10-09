import { auth } from "@clerk/nextjs/server";

import { WorkspaceView } from "./components/WorkspaceView";

type PageParams = {
  workspaceId: string;
};

export default async function Page({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { workspaceId } = await params;

  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) return <div>Please Signin</div>;

  const workspaceIdNumber = Number(workspaceId);

  return <WorkspaceView workspaceId={workspaceIdNumber} userId={userId} />;
}
