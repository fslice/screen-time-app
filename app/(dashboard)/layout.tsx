import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock, LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="border-b border-border bg-background/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Lock className="h-4 w-4 text-primary" strokeWidth={2.5} />
            <span className="font-heading text-2xl tracking-widest">SHUTOUT</span>
          </Link>

          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground hidden md:block">
              {user.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-12">
        {children}
      </main>
    </div>
  );
}
