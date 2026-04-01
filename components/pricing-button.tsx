"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PricingButton({
  plan,
  highlighted,
  children,
}: {
  plan: "monthly" | "annual" | "lifetime";
  highlighted?: boolean;
  children: React.ReactNode;
}) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!isSignedIn) {
      router.push("/sign-up");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (e) {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <Button
        onClick={handleClick}
        disabled={loading}
        variant={highlighted ? "default" : "outline"}
        className={cn("w-full rounded-full text-sm font-medium py-5")}
      >
        {loading ? "Loading..." : children}
      </Button>
      {error && (
        <p className="text-xs text-destructive mt-2 text-center">{error}</p>
      )}
    </div>
  );
}
