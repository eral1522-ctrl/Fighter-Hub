import { pgTable, text, serial, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// Backing table for the public "THE PEOPLE BEHIND IFA" institutional
// section. Nothing here is seeded or invented — this is infrastructure
// only. The public section reads only rows with active=true and hides
// any category with zero active rows entirely (no "coming soon" cards,
// no placeholder silhouettes).
export const teamMembersTable = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  // e.g. "President", "Board Member", "Head Coach Advisor"
  role: text("role").notNull(),
  // board | founding_fighter | advisory | legal | medical | partner
  category: text("category").notNull(),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  country: text("country"),
  // Discipline or professional area (e.g. "Boxing", "Sports Law")
  disciplineOrArea: text("discipline_or_area"),
  externalUrl: text("external_url"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertTeamMemberSchema = createInsertSchema(teamMembersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembersTable.$inferSelect;
