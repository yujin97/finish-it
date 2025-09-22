import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
};

export function TaskCard({ title, description }: Props) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-xs text-muted-foreground line-clamp-3 break-words">
          {description}
        </div>
      </CardContent>
    </Card>
  );
}
