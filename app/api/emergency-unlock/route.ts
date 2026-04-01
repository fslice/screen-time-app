import { auth } from "@clerk/nextjs/server";
import { stripe, EMERGENCY_UNLOCK_PRICE } from "@/lib/stripe";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allowed } = rateLimit(`emergency:${userId}`, { maxRequests: 3, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const deviceId =
      typeof body === "object" && body !== null && "deviceId" in body
        ? (body as Record<string, unknown>).deviceId
        : undefined;

    if (typeof deviceId !== "string" || deviceId.length === 0 || deviceId.length > 100) {
      return NextResponse.json({ error: "Invalid device ID" }, { status: 400 });
    }

    // Verify device belongs to user
    const device = await db.device.findFirst({
      where: { id: deviceId, userId },
    });
    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 });
    }

    // Verify user has an active subscription
    const subscription = await db.subscription.findUnique({ where: { userId } });
    if (!subscription || (subscription.status !== "active" && subscription.status !== "lifetime")) {
      return NextResponse.json({ error: "Active subscription required" }, { status: 403 });
    }

    // Reuse existing Stripe customer
    const customerId = subscription.stripeCustomerId;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      line_items: [{ price: EMERGENCY_UNLOCK_PRICE, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/unlock/${deviceId}?emergency=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/unlock/${deviceId}?emergency=canceled`,
      metadata: { clerkUserId: userId, deviceId, type: "emergency_unlock" },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Emergency unlock checkout error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
