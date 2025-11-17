import { Card, CardContent } from "@/components/ui/card";
import { CreateTaskDialog } from "../components/CreateWorkspaceDialog";

export default function Page() {
  return (
    <Card>
      <CardContent>
        <CreateTaskDialog />
      </CardContent>
    </Card>
  );
}
