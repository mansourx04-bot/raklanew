import mongoose, { Schema } from "mongoose";

const BiSchema = new Schema(
  { ar: { type: String, required: true }, en: { type: String, required: true } },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: BiSchema, required: true },
    category: { type: String, required: true, enum: ["boots", "balls", "gk", "wear", "accessories", "training"] },
    desc: { type: BiSchema, required: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviews: { type: Number, required: true, min: 0 },
    tag: { type: String, enum: ["new", "best", null], default: null },
    surfaces: { type: [String], required: true },
    sizes: { type: [String], required: true },
    image: { type: String, required: true },
    sortOrder: { type: Number, required: true },
  },
  { timestamps: true },
);

const UserSchema = new Schema(
  {
    displayName: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "RaklaUser", index: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [{
      productId: { type: String, required: true },
      name: { type: BiSchema, required: true },
      size: { type: String, required: false, default: "" },
      quantity: { type: Number, required: true, min: 1, max: 20 },
      price: { type: Number, required: true, min: 0 },
    }],
    subtotal: { type: Number, required: true, min: 0 },
    delivery: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    area: { type: String, required: true },
    paymentMethod: { type: String, required: true, enum: ["cod", "knet", "card", "apple"] },
    status: { type: String, required: true, enum: ["processing"], default: "processing" },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ProductModel = mongoose.models.RaklaProduct
  ?? mongoose.model("RaklaProduct", ProductSchema, "products");
export const UserModel = mongoose.models.RaklaUser
  ?? mongoose.model("RaklaUser", UserSchema, "users");
export const OrderModel = mongoose.models.RaklaOrder
  ?? mongoose.model("RaklaOrder", OrderSchema, "orders");
