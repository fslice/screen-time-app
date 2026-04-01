import { db } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

/**
 * Returns the user's active subscription or null.
 */
export async function getSubscription(userId: string) {
  return db.subscription.findUnique({ where: { userId } });
}

/**
 * Returns true if the user has an active or lifetime subscription.
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  if (!sub) return false;
  return sub.status === "active" || sub.status === "lifetime";
}

/**
 * Creates a Stripe billing portal session for managing subscription.
 */
export async function createPortalSession(userId: string, returnUrl: string) {
  const sub = await getSubscription(userId);
  if (!sub?.stripeCustomerId) return null;

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: returnUrl,
  });

  return session.url;
}
