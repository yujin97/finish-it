import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <Spinner className="size-8 text-yellow-500" />
    </div>
  );
}
