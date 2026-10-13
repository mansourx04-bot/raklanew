import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';
import { apiError } from '../../../../lib/api-error';
import { dbConnect } from '../../../../lib/db';
import { readSessionUserId } from '../../../../lib/session';
import { Order } from '../../../../models/Order';

export const runtime = 'nodejs';

export async function GET(request: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  const userId = readSessionUserId(request);
  if (!userId) return NextResponse.json({ error: 'A valid session is required.' }, { status: 401 });
  const { orderId } = await context.params;
  if (!mongoose.isValidObjectId(orderId)) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  try {
    await dbConnect();
    const order = await Order.findById(orderId).lean();
    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    if (String(order.user ?? order.userId) !== userId) {
      return NextResponse.json({ error: 'You are not allowed to access this order.' }, { status: 403 });
    }
    return NextResponse.json({
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
    });
  } catch (error) {
    return apiError(error, 'Could not load the order.');
  }
}
