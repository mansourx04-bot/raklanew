import { createInsertSchema } from "drizzle-zod";
import { index, jsonb, pgTable, text, timestamp, uuid, numeric } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { usersTable } from "./users";

export type OrderItemSnapshot = {
  productId: string;
  name: { ar: string; en: string };
  size: string;
  quantity: number;
  unitPrice: number;
};

export const ordersTable = pgTable("rakla_orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  items: jsonb("items").$type<OrderItemSnapshot[]>().notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 3 }).notNull(),
  delivery: numeric("delivery", { precision: 10, scale: 3 }).notNull(),
  total: numeric("total", { precision: 10, scale: 3 }).notNull(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  area: text("area").notNull(),
  status: text("status").notNull().default("processing"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [index("rakla_orders_user_created_idx").on(table.userId, table.createdAt)]);

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
