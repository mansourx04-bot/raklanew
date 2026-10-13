import { createInsertSchema } from "drizzle-zod";
import { pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const favoritesTable = pgTable("rakla_favorites", {
  userId: uuid("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.userId, table.productId] })]);

export const insertFavoriteSchema = createInsertSchema(favoritesTable).omit({ createdAt: true });
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favoritesTable.$inferSelect;
