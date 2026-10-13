import mongoose, { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: Schema.Types.Mixed, required: true },
    description: { type: Schema.Types.Mixed },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    // Preserve the current shop catalogue's bilingual descriptions, sizes, tags and pitch surfaces.
    desc: { type: Schema.Types.Mixed },
    oldPrice: { type: Number, default: null },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviews: { type: Number, min: 0, default: 0 },
    tag: { type: String, default: null },
    surfaces: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
  },
  { collection: 'products', strict: false, timestamps: { createdAt: true, updatedAt: false } },
);

export const Product = mongoose.models.Product ?? mongoose.model('Product', ProductSchema, 'products');
