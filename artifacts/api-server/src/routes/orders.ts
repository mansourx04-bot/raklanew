import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import mongoose from "mongoose";
import { CreateOrderBody, CreateOrderResponse, GetMyOrdersResponse, GetOrderParams, GetOrderResponse } from "@workspace/api-zod";
import { requireAuth } from "../lib/auth";
import { mongoReady } from "../lib/mongo";
import { OrderModel, ProductModel } from "../lib/models";

const router: IRouter = Router();
const FREE_DELIVERY_OVER = 15;
const DELIVERY_FEE = 1.5;
const BUNDLE_ID = "bundle-matchday";
const BUNDLE_PRICE = 27.9;
const BUNDLE_PARTS = [
  { id: "strike-fg", index: 0 },
  { id: "grip-socks", index: 1 },
  { id: "shin", index: 2 },
];

router.use("/orders", requireAuth);

function serviceUnavailable(res: Parameters<Parameters<IRouter["get"]>[1]>[1]) {
  res.status(503).json({ error: process.env.MONGODB_URI ? "MongoDB Atlas is temporarily unavailable." : "MONGODB_URI is not configured." });
}

function publicOrder(order: Record<string, any>) {
  return {
    id: String(order._id),
    userId: String(order.userId),
    orderNumber: order.orderNumber,
    items: order.items.map((item: Record<string, any>) => ({
      productId: item.productId,
      name: item.name,
      size: item.size,
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

router.get("/orders", async (req, res): Promise<void> => {
  if (!mongoReady()) { serviceUnavailable(res); return; }
  const records = await OrderModel.find({ userId: req.authUserId }).sort({ createdAt: -1 }).lean();
  res.json(GetMyOrdersResponse.parse(records.map(publicOrder)));
});

router.post("/orders", async (req, res): Promise<void> => {
  if (!mongoReady()) { serviceUnavailable(res); return; }
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Order details are invalid." }); return; }

  const productIds = [...new Set(parsed.data.items.filter((item) => item.productId !== BUNDLE_ID).map((item) => item.productId))];
  const products = await ProductModel.find({ id: { $in: productIds } }).lean();
  const byId = new Map(products.map((product) => [product.id, product]));
  const orderItems: Array<{ productId: string; name: { ar: string; en: string }; size: string; quantity: number; price: number }> = [];
  for (const line of parsed.data.items) {
    if (line.productId === BUNDLE_ID) {
      const sizes = line.size.split(" / ");
      if (sizes.length !== 3) { res.status(400).json({ error: "Choose all bundle sizes before checkout." }); return; }
      const bundleProducts = BUNDLE_PARTS.map(({ id }) => byId.get(id));
      if (bundleProducts.some((product) => !product)) {
        const stored = await ProductModel.find({ id: { $in: BUNDLE_PARTS.map(({ id }) => id) } }).lean();
        for (const p of stored) byId.set(p.id, p);
      }
      const parts = BUNDLE_PARTS.map(({ id }) => byId.get(id));
      if (parts.some((p, i) => !p || !p.sizes.includes(sizes[i]))) {
        res.status(400).json({ error: "One or more match-day bundle sizes are unavailable." });
        return;
      }
      orderItems.push({
        productId: BUNDLE_ID,
        name: { ar: "طقم يوم المباراة", en: "Match-Day Bundle" },
        size: line.size,
        quantity: line.quantity,
        price: BUNDLE_PRICE,
      });
      continue;
    }
    const product = byId.get(line.productId);
    if (!product) { res.status(400).json({ error: "An item in this order is unavailable." }); return; }
    const size = line.size;
    if (product.sizes.length > 0 && !product.sizes.includes(size)) {
      res.status(400).json({ error: "One or more selected sizes are unavailable." });
      return;
    }
    orderItems.push({ productId: product.id, name: product.name, size, quantity: line.quantity, price: product.price });
  }

  const subtotal = Math.round(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0) * 1000) / 1000;
  const delivery = subtotal > FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const document = await OrderModel.create({
    userId: req.authUserId,
    orderNumber: `RK-${randomUUID().slice(0, 8).toUpperCase()}`,
    items: orderItems,
    subtotal,
    delivery,
    total: Math.round((subtotal + delivery) * 1000) / 1000,
    customerName: parsed.data.customerName.trim(),
    phone: parsed.data.phone.trim(),
    area: parsed.data.area,
    paymentMethod: parsed.data.paymentMethod,
    status: "processing",
  });
  res.status(201).json(CreateOrderResponse.parse(publicOrder(document.toObject())));
});

router.get("/orders/:orderId", async (req, res): Promise<void> => {
  if (!mongoReady()) { serviceUnavailable(res); return; }
  const params = GetOrderParams.safeParse(req.params);
  if (!params.success || !mongoose.isValidObjectId(params.data.orderId)) { res.status(404).json({ error: "Order not found." }); return; }
  const order = await OrderModel.findById(params.data.orderId).lean();
  if (!order) { res.status(404).json({ error: "Order not found." }); return; }
  if (String(order.userId) !== req.authUserId) { res.status(403).json({ error: "You are not allowed to access this order." }); return; }
  res.json(GetOrderResponse.parse(publicOrder(order)));
});

export default router;
