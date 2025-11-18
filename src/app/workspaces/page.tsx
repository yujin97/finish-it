import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import { prisma } from "@/utils/prismaClient";

export default async function Page() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) return <div>Please Login</div>;

  const workspaces = await prisma.userWorkspace.findMany({
    include: {
      workspace: true,
    },
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-6 lg:gap-8">
      <div className="text-2xl font-bold text-center sm:text-left">
        Your workspaces
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Workspace</TableHead>
            <TableHead className="w-[200px]">Updated at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workspaces.map(({ workspaceId, workspace: { name, updatedAt } }) => (
            <TableRow key={workspaceId}>
              <TableCell className="font-medium">{name}</TableCell>
              <TableCell>{updatedAt.toLocaleString()}</TableCell>
              <TableCell>
                <Link href={`/workspaces/${workspaceId}`}>
                  <Button variant="secondary" type="button">
                    Go To Workspace
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
