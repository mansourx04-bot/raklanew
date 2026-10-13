import mongoose from "mongoose";
import { logger } from "./logger";
import { seedProductCollection } from "./product-seed";

export async function connectMongo(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.warn("MONGODB_URI is not set. Atlas-backed features are unavailable; the storefront will still load.");
    return;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000, connectTimeoutMS: 6000 });
    await seedProductCollection();
    logger.info("Connected to MongoDB Atlas; product seed checked.");
  } catch (err) {
    logger.error({ errorName: err instanceof Error ? err.name : "MongoError" }, "MongoDB Atlas connection failed. The API server will remain available.");
  }
}

export function mongoReady(): boolean {
  return mongoose.connection.readyState === 1;
}
