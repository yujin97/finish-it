import { Card, CardContent } from "@/components/ui/card";
import { CreateTaskDialog } from "./components/CreateWorkspaceDialog";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <>
      <Card>
        <CardContent>
          <CreateTaskDialog />
        </CardContent>
      </Card>
      {children}
    </>
  );
}
