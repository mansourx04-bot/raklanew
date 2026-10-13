import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { usersTable } from "./users";

export type SavedCartLine = { productId: string; size: string; quantity: number };

export const cartsTable = pgTable("rakla_carts", {
  userId: uuid("user_id").primaryKey().references(() => usersTable.id, { onDelete: "cascade" }),
  items: jsonb("items").$type<SavedCartLine[]>().notNull().default(sql`'[]'::jsonb`),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCartSchema = createInsertSchema(cartsTable);
export type InsertCart = z.infer<typeof insertCartSchema>;
export type SavedCart = typeof cartsTable.$inferSelect;
