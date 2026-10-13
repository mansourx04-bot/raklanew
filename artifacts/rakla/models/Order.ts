import mongoose, { Schema } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    product: { type: String, required: true },
    productId: { type: String },
    name: { type: Schema.Types.Mixed },
    size: { type: String, default: '' },
    quantity: { type: Number, required: true, min: 1, max: 20 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User', index: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending', required: true },
    createdAt: { type: Date, default: Date.now },
    // Retain checkout details used by the existing store and its order history.
    orderNumber: { type: String, required: true, unique: true },
    subtotal: { type: Number, required: true, min: 0 },
    delivery: { type: Number, required: true, min: 0 },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    area: { type: String, required: true },
    paymentMethod: { type: String, required: true },
  },
  { collection: 'orders', strict: false, timestamps: { createdAt: true, updatedAt: false } },
);

export const Order = mongoose.models.Order ?? mongoose.model('Order', OrderSchema, 'orders');
