import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default async function Home() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    redirect("/workspaces");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground">
            Finish it.
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A calm, focused space to organize your work and actually get things done.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SignUpButton>
            <Button size="lg" className="min-w-[160px] text-base">
              Get Started
            </Button>
          </SignUpButton>
          <SignInButton>
            <Button variant="outline" size="lg" className="min-w-[160px] text-base">
              Sign In
            </Button>
          </SignInButton>
        </div>

        <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
          <FeatureItem text="Organize tasks by workspace" />
          <FeatureItem text="Track progress with status boards" />
          <FeatureItem text="Collaborate with your team" />
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="size-5 text-primary mt-0.5 shrink-0" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}
