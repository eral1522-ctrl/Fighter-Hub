import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const fightersTable = pgTable("fighters", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  fullName: text("full_name").notNull(),
  country: text("country").notNull(),
  city: text("city").notNull(),
  weightClass: text("weight_class").notNull(),
  record: text("record").notNull(),
  age: integer("age"),
  height: text("height"),
  stance: text("stance"),
  coach: text("coach"),
  manager: text("manager"),
  instagram: text("instagram"),
  whatsapp: text("whatsapp"),
  email: text("email").notNull(),
  videoLinks: text("video_links"),
  bio: text("bio"),
  availableInternationally: boolean("available_internationally")
    .notNull()
    .default(false),
  membershipPlan: text("membership_plan"),
  // active | inactive | pending
  membershipStatus: text("membership_status").notNull().default("inactive"),
  // pending | approved | rejected
  approvalStatus: text("approval_status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertFighterSchema = createInsertSchema(fightersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  approvalStatus: true,
  membershipStatus: true,
});

export type InsertFighter = z.infer<typeof insertFighterSchema>;
export type Fighter = typeof fightersTable.$inferSelect;
