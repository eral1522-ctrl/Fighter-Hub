import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { fightersTable } from "./fighters";
import { opportunitiesTable } from "./opportunities";
import { eventsTable } from "./events";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  fighterId: integer("fighter_id")
    .notNull()
    .references(() => fightersTable.id),
  opportunityId: integer("opportunity_id").references(
    () => opportunitiesTable.id,
  ),
  eventId: integer("event_id").references(() => eventsTable.id),
  // pending | approved | rejected
  status: text("status").notNull().default("pending"),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertApplicationSchema = createInsertSchema(
  applicationsTable,
).omit({ id: true, createdAt: true, updatedAt: true, status: true });

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
