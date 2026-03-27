import { currentUser } from "@clerk/nextjs/server";
import { Lock } from "lucide-react";

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary" />
          <span className="text-xs tracking-[0.25em] uppercase text-primary">
            Dashboard
          </span>
        </div>
        <h1 className="font-heading text-5xl md:text-6xl tracking-wider uppercase">
          Welcome back.
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Signed in as{" "}
          <span className="text-foreground">
            {user?.emailAddresses[0]?.emailAddress}
          </span>
        </p>
      </div>

      {/* Status placeholder — replaced in Stage 3 */}
      <div className="border border-border p-8 relative bg-card max-w-md">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-border" />
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs tracking-widest uppercase text-muted-foreground">
            Screen Time Status
          </span>
        </div>
        <p className="font-heading text-3xl tracking-wider uppercase text-muted-foreground">
          Not set up yet
        </p>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Complete onboarding to lock your Screen Time password.
        </p>
      </div>
    </div>
  );
}
