import {
  pgTable,
  text,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const fighterApplicationsTable = pgTable("fighter_applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  country: text("country").notNull(),
  discipline: text("discipline").notNull(),
  weightClass: text("weight_class").notNull(),
  record: text("record").notNull(),
  bio: text("bio"),
  // pending | approved | rejected
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  // not_paid | paid
  paymentStatus: text("payment_status").notNull().default("not_paid"),
  paymentLink: text("payment_link"),
  boxrecLink: text("boxrec_link"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertFighterApplicationSchema = createInsertSchema(
  fighterApplicationsTable,
).omit({ id: true, createdAt: true, updatedAt: true, status: true, adminNotes: true });

export type InsertFighterApplication = z.infer<typeof insertFighterApplicationSchema>;
export type FighterApplication = typeof fighterApplicationsTable.$inferSelect;
