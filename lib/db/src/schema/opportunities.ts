import { pgTable, text, serial, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const opportunitiesTable = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  // fight | sponsor
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  date: text("date"),
  weightClass: text("weight_class"),
  compensation: text("compensation"),
  // draft | under_review | verified | published | closed | archived
  // A new opportunity is created as "draft" by default. Only "verified"
  // and "published" are ever visible publicly (enforced in the public
  // API route, not just the admin UI) — draft/under_review/closed/
  // archived stay admin-only.
  status: text("status").notNull().default("draft"),
  // Opportunities past this date are automatically hidden from the
  // public API regardless of status. Nullable — an opportunity without
  // an expiration date never auto-hides on that basis.
  expirationDate: date("expiration_date"),
  // extended fields
  country: text("country"),
  city: text("city"),
  sport: text("sport"),
  level: text("level"),
  purse: text("purse"),
  travelIncluded: boolean("travel_included"),
  accommodationIncluded: boolean("accommodation_included"),

  // --- Added for the real-opportunities-only admin workflow ---
  // All nullable/optional — additive, staged migration, not yet run
  // against production.
  promoterOrganization: text("promoter_organization"),
  gender: text("gender"),
  requiredExperience: text("required_experience"),
  applicationDeadline: text("application_deadline"),
  travelAccommodationDetails: text("travel_accommodation_details"),
  // Gated content — only ever returned to confirmed paid members by the
  // API (see opportunities.ts route), same principle as compensation/purse.
  memberOnlyDetails: text("member_only_details"),
  applicationInstructions: text("application_instructions"),
  // Admin/internal only — never returned by any public or member-facing
  // API response, regardless of payment status.
  adminVerificationNotes: text("admin_verification_notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertOpportunitySchema = createInsertSchema(
  opportunitiesTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunitiesTable.$inferSelect;
