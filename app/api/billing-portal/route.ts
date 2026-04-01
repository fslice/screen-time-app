import { auth } from "@clerk/nextjs/server";
import { createPortalSession } from "@/lib/subscription";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = rateLimit(`portal:${userId}`, { maxRequests: 5, windowMs: 60_000 });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const url = await createPortalSession(
    userId,
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
  );

  if (!url) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  return NextResponse.json({ url });
}
