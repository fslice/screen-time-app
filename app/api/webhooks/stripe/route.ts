import { stripe } from "@/lib/stripe";
import { db } from "@/lib/prisma";
import type Stripe from "stripe";

/**
 * Extract the period end from a subscription's first item.
 * In Stripe API 2026-03-25, current_period_end lives on the item, not the subscription.
 */
function getPeriodEnd(sub: Stripe.Subscription): Date | null {
  const item = sub.items.data[0];
  if (!item?.current_period_end) return null;
  return new Date(item.current_period_end * 1000);
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  // Idempotency: skip events we've already processed
  const existing = await db.stripeEvent.findUnique({ where: { id: event.id } });
  if (existing) {
    return new Response("Already processed", { status: 200 });
  }
  await db.stripeEvent.create({ data: { id: event.id } });

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const clerkUserId = session.metadata?.clerkUserId;
      const checkoutType = session.metadata?.type;

      // Handle emergency unlock
      if (checkoutType === "emergency_unlock") {
        const deviceId = session.metadata?.deviceId;
        if (clerkUserId && deviceId) {
          // Verify device belongs to user
          const device = await db.device.findFirst({
            where: { id: deviceId, userId: clerkUserId },
          });
          if (device) {
            // Create a completed willpower session so revealPasscode works
            await db.willpowerSession.create({
              data: {
                deviceId,
                wordsRequired: device.wordsRequired,
                wordsCompleted: device.wordsRequired,
                currentWord: null,
                completedAt: new Date(),
              },
            });
          }
        }
        break;
      }

      const plan = session.metadata?.plan as
        | "monthly"
        | "annual"
        | "lifetime"
        | undefined;

      if (!clerkUserId || !plan) break;

      if (plan === "lifetime") {
        await db.subscription.upsert({
          where: { userId: clerkUserId },
          create: {
            userId: clerkUserId,
            stripeCustomerId: session.customer as string,
            status: "lifetime",
            planType: "lifetime",
          },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: null,
            stripePriceId: null,
            status: "lifetime",
            planType: "lifetime",
            currentPeriodEnd: null,
          },
        });
      } else {
        const subscriptionId = session.subscription as string;
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        const periodEnd = getPeriodEnd(sub);

        await db.subscription.upsert({
          where: { userId: clerkUserId },
          create: {
            userId: clerkUserId,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: sub.items.data[0]?.price.id,
            status: "active",
            planType: plan,
            currentPeriodEnd: periodEnd,
          },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: sub.items.data[0]?.price.id,
            status: "active",
            planType: plan,
            currentPeriodEnd: periodEnd,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const existing = await db.subscription.findUnique({
        where: { stripeSubscriptionId: sub.id },
      });

      if (!existing) break;

      const status =
        sub.status === "active"
          ? "active"
          : sub.status === "past_due"
          ? "past_due"
          : "canceled";

      const periodEnd = getPeriodEnd(sub);

      await db.subscription.update({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status,
          ...(periodEnd ? { currentPeriodEnd: periodEnd } : {}),
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subDetails = invoice.parent?.subscription_details;
      const subRef = subDetails?.subscription;
      const subId = typeof subRef === "string" ? subRef : subRef?.id ?? null;
      if (!subId) break;

      await db.subscription.updateMany({
        where: { stripeSubscriptionId: subId },
        data: { status: "past_due" },
      });
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
