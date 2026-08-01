import {
  pgTable,
  text,
  serial,
  timestamp,
  date,
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
  // Deprecated in favor of sportingProfileUrl below — kept (not dropped) so
  // existing data isn't lost. Stage 2 of the migration copies this into
  // sportingProfileUrl; a later stage can drop this column once confirmed
  // unused.
  boxrecLink: text("boxrec_link"),
  whatsapp: text("whatsapp"),

  // --- Added for the professional/amateur application form ---
  // All nullable for now (staged migration, step 1: additive/optional
  // only). None of these are required until existing records have been
  // reviewed and backfilled — see migration plan.

  // "professional" | "amateur" — nullable until backfilled
  athleteType: text("athlete_type"),
  ringName: text("ring_name"),
  dateOfBirth: date("date_of_birth"),
  city: text("city"),
  // Separated from whatsapp per the professional/amateur form redesign
  instagram: text("instagram"),
  currentGym: text("current_gym"),
  coach: text("coach"),
  careerObjective: text("career_objective"),
  // Professional-only, optional even for professionals
  currentManager: text("current_manager"),
  // Amateur-only
  competitionExperience: text("competition_experience"),
  // Generalized replacement for boxrecLink — BoxRec, Tapology, Sherdog,
  // or any other official profile link
  sportingProfileUrl: text("sporting_profile_url"),
  // Timestamp of when the applicant accepted the terms/privacy consent
  // checkbox, for consent auditability
  consentAcceptedAt: timestamp("consent_accepted_at", { withTimezone: true }),

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
