import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  migrated: boolean;
};

const globalCache = globalThis as typeof globalThis & { raklaMongoose?: MongooseCache };
const cache = globalCache.raklaMongoose ??= { connection: null, promise: null, migrated: false };

async function migrateExistingDocuments() {
  await Promise.all([
    User.collection.updateMany(
      { name: { $exists: false }, displayName: { $type: 'string' } },
      [{ $set: { name: '$displayName' } }],
    ),
    Product.collection.updateMany(
      { description: { $exists: false }, desc: { $exists: true } },
      [{ $set: { description: '$desc' } }],
    ),
    Order.collection.updateMany(
      { user: { $exists: false }, userId: { $exists: true } },
      [{ $set: { user: '$userId' } }],
    ),
    Order.collection.updateMany({ status: 'processing' }, { $set: { status: 'pending' } }),
  ]);
  cache.migrated = true;
}

export async function dbConnect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is missing. Add it in Replit Secrets.');

  if (cache.connection?.connection.readyState === 1) {
    if (!cache.migrated) await migrateExistingDocuments();
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
    }).then(async (connection) => {
      await migrateExistingDocuments();
      cache.connection = connection;
      return connection;
    }).catch((error) => {
      cache.promise = null;
      throw error;
    });
  }

  return cache.promise;
}
