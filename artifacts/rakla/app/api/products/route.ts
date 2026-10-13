import { NextResponse } from 'next/server';
import { dbConnect } from '../../../lib/db';
import { apiError } from '../../../lib/api-error';
import { Product } from '../../../models/Product';
import { PRODUCTS } from '../../../src/lib/catalog';

export const runtime = 'nodejs';

async function seedIfEmpty() {
  if (await Product.exists({})) return;
  await Product.insertMany(PRODUCTS.map((product, sortOrder) => ({
    ...product,
    image: product.image.replace(/^\/+/, ''),
    description: product.desc,
    sortOrder,
  })));
}

export async function GET() {
  try {
    await dbConnect();
    await seedIfEmpty();
    const products = await Product.find().sort({ sortOrder: 1, createdAt: 1 }).lean();
    return NextResponse.json(products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      desc: product.desc ?? product.description,
      price: product.price,
      oldPrice: product.oldPrice ?? null,
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
      tag: product.tag ?? null,
      surfaces: product.surfaces ?? [],
      sizes: product.sizes ?? [],
      image: product.image,
    })));
  } catch (error) {
    return apiError(error, 'Could not load products.');
  }
}
