"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ManageSubscription({
  status,
  planType,
}: {
  status: string;
  planType: string | null;
}) {
  const [loading, setLoading] = useState(false);

  async function handleManage() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setLoading(false);
    }
  }

  const label =
    status === "lifetime"
      ? "Lifetime"
      : status === "active"
      ? planType === "annual"
        ? "Annual"
        : "Monthly"
      : status === "past_due"
      ? "Past Due"
      : "No Plan";

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div
          className={`h-2 w-2 rounded-full ${
            status === "active" || status === "lifetime"
              ? "bg-green-500"
              : status === "past_due"
              ? "bg-yellow-500"
              : "bg-border"
          }`}
        />
        <span className="text-xs tracking-widest uppercase text-muted-foreground">
          {label}
        </span>
      </div>
      {status !== "lifetime" && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleManage}
          disabled={loading}
          className="rounded-none text-xs tracking-widest uppercase"
        >
          {loading ? "Loading..." : "Manage Billing"}
        </Button>
      )}
    </div>
  );
}
