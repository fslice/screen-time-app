import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return Reflect.get(getStripe(), prop, getStripe());
  },
});

/**
 * Price IDs must be set in env vars after creating products in the Stripe dashboard.
 */
export const PRICE_IDS = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
  lifetime: process.env.STRIPE_PRICE_LIFETIME!,
} as const;

export type PlanKey = keyof typeof PRICE_IDS;
