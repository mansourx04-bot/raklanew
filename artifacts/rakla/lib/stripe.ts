import Stripe from 'stripe';

let client: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is missing. Add your Stripe secret key to the environment variables.');
  }
  client ??= new Stripe(key);
  return client;
}

export function getStripeWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is missing. Add the signing secret from your Stripe webhook endpoint.');
  }
  return secret;
}

// KWD has three decimals (fils), and Stripe requires the last digit to be 0.
export function toStripeKwd(amount: number) {
  return Math.round(amount * 100) * 10;
}
