import { auth } from "@clerk/nextjs/server";
import { stripe, PRICE_IDS, type PlanKey } from "@/lib/stripe";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allowed } = rateLimit(`checkout:${userId}`, { maxRequests: 5, windowMs: 60_000 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const plan =
      typeof body === "object" && body !== null && "plan" in body
        ? (body as Record<string, unknown>).plan
        : undefined;

    if (typeof plan !== "string" || !PRICE_IDS[plan as PlanKey]) {
      return NextResponse.json(
        { error: `Invalid plan. Available: ${Object.keys(PRICE_IDS).join(", ")}` },
        { status: 400 }
      );
    }
    const validPlan = plan as PlanKey;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Reuse existing Stripe customer if they have one
    const existing = await db.subscription.findUnique({ where: { userId } });
    let customerId = existing?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { clerkUserId: userId },
      });
      customerId = customer.id;
    }

    const isLifetime = validPlan === "lifetime";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isLifetime ? "payment" : "subscription",
      line_items: [{ price: PRICE_IDS[validPlan], quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=canceled`,
      metadata: { clerkUserId: userId, plan: validPlan },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Checkout error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
