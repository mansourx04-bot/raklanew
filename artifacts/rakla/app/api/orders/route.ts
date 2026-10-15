import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { apiError } from '../../../lib/api-error';
import { dbConnect } from '../../../lib/db';
import { readSessionUserId } from '../../../lib/session';
import { getStripe, toStripeKwd } from '../../../lib/stripe';
import { Order } from '../../../models/Order';
import { Product } from '../../../models/Product';

export const runtime = 'nodejs';

const FREE_DELIVERY_OVER = 15;
const DELIVERY_FEE = 1.5;
const BUNDLE_ID = 'bundle-matchday';
const BUNDLE_PRICE = 27.9;
const BUNDLE_PARTS = ['strike-fg', 'grip-socks', 'shin'];

const inputSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[4569]\d{7}$/),
  area: z.string().trim().min(1).max(80),
  paymentMethod: z.enum(['cod', 'knet', 'card', 'apple']),
  items: z.array(z.object({
    productId: z.string().min(1).max(100),
    size: z.string().max(40).optional().default(''),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(30),
});

function publicOrder(order: Record<string, any>) {
  return {
    id: String(order._id),
    userId: String(order.user ?? order.userId),
    orderNumber: order.orderNumber,
    items: (order.items ?? []).map((item: Record<string, any>) => ({
      productId: item.productId ?? item.product,
      name: item.name,
      size: item.size ?? '',
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    delivery: order.delivery,
    total: order.total,
    customerName: order.customerName,
    phone: order.phone,
    area: order.area,
    paymentMethod: order.paymentMethod,
    status: order.status,
    createdAt: order.createdAt,
  };
}

export async function GET(request: NextRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return NextResponse.json({ error: 'A valid session is required.' }, { status: 401 });
  try {
    await dbConnect();
    const records = await Order.find({ user: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(records.map((order) => publicOrder(order)));
  } catch (error) {
    return apiError(error, 'Could not load your orders.');
  }
}

export async function POST(request: NextRequest) {
  const userId = readSessionUserId(request);
  if (!userId) return NextResponse.json({ error: 'A valid session is required.' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Order details are invalid.' }, { status: 400 });
  }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Order details are invalid.' }, { status: 400 });

  try {
    await dbConnect();
    const productIds = [...new Set(parsed.data.items.filter((item) => item.productId !== BUNDLE_ID).map((item) => item.productId))];
    const products = await Product.find({ id: { $in: productIds } }).lean();
    const byId = new Map(products.map((product) => [product.id, product]));
    const orderItems: Array<{ product: string; productId: string; name: unknown; size: string; quantity: number; price: number }> = [];

    for (const line of parsed.data.items) {
      if (line.productId === BUNDLE_ID) {
        const sizes = line.size.split(' / ');
        if (sizes.length !== 3) return NextResponse.json({ error: 'Choose all bundle sizes before checkout.' }, { status: 400 });
        const bundleProducts = await Product.find({ id: { $in: BUNDLE_PARTS } }).lean();
        const bundleMap = new Map(bundleProducts.map((product) => [product.id, product]));
        const valid = BUNDLE_PARTS.every((id, index) => {
          const product = bundleMap.get(id);
          return product && product.sizes.includes(sizes[index]);
        });
        if (!valid) return NextResponse.json({ error: 'One or more match-day bundle sizes are unavailable.' }, { status: 400 });
        orderItems.push({
          product: BUNDLE_ID,
          productId: BUNDLE_ID,
          name: { ar: 'طقم يوم المباراة', en: 'Match-Day Bundle' },
          size: line.size,
          quantity: line.quantity,
          price: BUNDLE_PRICE,
        });
        continue;
      }

      const product = byId.get(line.productId);
      if (!product) return NextResponse.json({ error: 'An item in this order is unavailable.' }, { status: 400 });
      if ((product.sizes?.length ?? 0) > 0 && !product.sizes.includes(line.size)) {
        return NextResponse.json({ error: 'One or more selected sizes are unavailable.' }, { status: 400 });
      }
      orderItems.push({
        product: product.id,
        productId: product.id,
        name: product.name,
        size: line.size,
        quantity: line.quantity,
        price: product.price,
      });
    }

    const subtotal = Math.round(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1000) / 1000;
    const delivery = subtotal > FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
    const saved = await Order.create({
      user: new mongoose.Types.ObjectId(userId),
      orderNumber: `RK-${randomUUID().slice(0, 8).toUpperCase()}`,
      items: orderItems,
      subtotal,
      delivery,
      total: Math.round((subtotal + delivery) * 1000) / 1000,
      customerName: parsed.data.customerName.trim(),
      phone: parsed.data.phone.trim(),
      area: parsed.data.area,
      paymentMethod: parsed.data.paymentMethod,
      status: 'pending',
    });

    // Card and Apple Pay go through Stripe Checkout; the webhook marks the order paid.
    if (parsed.data.paymentMethod === 'card' || parsed.data.paymentMethod === 'apple') {
      try {
        const origin = request.nextUrl.origin;
        const lineItems = orderItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: 'kwd',
            unit_amount: toStripeKwd(item.price),
            product_data: {
              name: (item.name as { en?: string } | undefined)?.en ?? item.productId,
              ...(item.size ? { description: `Size: ${item.size}` } : {}),
            },
          },
        }));
        if (delivery > 0) {
          lineItems.push({
            quantity: 1,
            price_data: { currency: 'kwd', unit_amount: toStripeKwd(delivery), product_data: { name: 'Delivery' } },
          });
        }
        const orderId = String(saved._id);
        const session = await getStripe().checkout.sessions.create({
          mode: 'payment',
          line_items: lineItems,
          client_reference_id: orderId,
          metadata: { orderId, orderNumber: saved.orderNumber },
          success_url: `${origin}/orders?paid=${encodeURIComponent(saved.orderNumber)}`,
          cancel_url: `${origin}/cart`,
        });
        await Order.updateOne({ _id: saved._id }, { $set: { stripeSessionId: session.id } });
        return NextResponse.json({ ...publicOrder(saved.toObject()), checkoutUrl: session.url }, { status: 201 });
      } catch (error) {
        await Order.deleteOne({ _id: saved._id });
        throw error;
      }
    }

    return NextResponse.json(publicOrder(saved.toObject()), { status: 201 });
  } catch (error) {
    return apiError(error, 'Could not save the order.');
  }
}
