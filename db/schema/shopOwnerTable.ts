import { int, mysqlTable, primaryKey, varchar } from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";

export const shopOwnerTable = mysqlTable(
  "shop_owner",
  {
    shopId: int()
      .notNull()
      .references(() => shopsTable.id)
      .notNull(),
    ownerId: varchar({ length: 255 }) // id from clerk
      .notNull()
  },
  (t) => [primaryKey({ columns: [t.shopId, t.ownerId] })]
);

export const shopOwnerRelations = relations(shopOwnerTable, ({ one }) => ({
  shop: one(shopsTable, {
    fields: [shopOwnerTable.shopId],
    references: [shopsTable.id],
  })
}));
