import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { apiError } from '../../../../lib/api-error';
import { dbConnect } from '../../../../lib/db';
import { getStripe, getStripeWebhookSecret } from '../../../../lib/stripe';
import { Order } from '../../../../models/Order';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing Stripe signature.' }, { status: 400 });

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(payload, signature, getStripeWebhookSecret());
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('STRIPE_')) return apiError(error, 'Stripe is not configured.');
    return NextResponse.json({ error: 'Invalid Stripe signature.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId ?? session.client_reference_id;
    if (session.payment_status === 'paid' && orderId && mongoose.isValidObjectId(orderId)) {
      try {
        await dbConnect();
        await Order.updateOne({ _id: orderId, stripeSessionId: session.id }, { $set: { status: 'paid' } });
      } catch (error) {
        return apiError(error, 'Could not update the order.');
      }
    }
  }

  return NextResponse.json({ received: true });
}
