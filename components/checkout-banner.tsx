"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

export function CheckoutBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const checkout = searchParams.get("checkout");

  useEffect(() => {
    if (checkout === "success") {
      setVisible(true);
      // Clean the URL
      const timer = setTimeout(() => {
        router.replace("/dashboard", { scroll: false });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [checkout, router]);

  if (!visible) return null;

  return (
    <div className="border border-primary/30 bg-primary/5 p-4 mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Check className="h-4 w-4 text-primary" />
        <p className="text-sm text-primary">
          Payment successful — you&apos;re all set!
        </p>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-primary/50 hover:text-primary transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
