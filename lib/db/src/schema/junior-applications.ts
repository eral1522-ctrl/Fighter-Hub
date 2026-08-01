import { pgTable, text, serial, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ============================================================================
// NOT LIVE. Prepared for legal/safeguarding review only.
//
// No API route, admin panel, or public form references this table. It is
// not exported from any client-facing code path. "Junior Fighter" must
// not appear as a selectable option anywhere on the public site or
// application form until minor-safeguarding, privacy, and junior
// membership terms have been reviewed by qualified legal counsel — per
// explicit instruction, this schema is the extent of what should exist
// until that review happens.
//
// Design choices driving the shape of this table:
// - No email/phone/WhatsApp/Instagram field for the athlete. Only the
//   guardian has a contact method. The minor does not get their own
//   contact info collected or published, per instruction.
// - No clerkUserId / portal login for the minor. Juniors do not get an
//   independent member-portal account in this design — communication
//   about opportunities is guardian/coach/gym-mediated, never direct
//   contact between a promoter/third party and the minor, per
//   instruction. If a junior portal experience is ever built, that's a
//   deliberate future decision, not a default here.
// - Consent fields belong to the guardian, not the athlete — the minor
//   cannot personally accept the membership contract; the guardian does,
//   and pays.
// - isPrivateProfile defaults to true and there is intentionally no API
//   in this codebase that would let anything make a junior profile
//   public. Keep it that way until reviewed.
// ============================================================================

export const juniorApplicationsTable = pgTable("junior_applications", {
  id: serial("id").primaryKey(),

  // --- Athlete (minor) ---
  athleteFullName: text("athlete_full_name").notNull(),
  athleteDateOfBirth: date("athlete_date_of_birth").notNull(),
  discipline: text("discipline").notNull(),
  weightClass: text("weight_class"),
  country: text("country").notNull(),
  city: text("city").notNull(),
  gym: text("gym"),
  coach: text("coach"),
  competitionExperience: text("competition_experience"),

  // --- Parent / Legal Guardian ---
  guardianFullName: text("guardian_full_name").notNull(),
  guardianEmail: text("guardian_email").notNull(),
  guardianPhone: text("guardian_phone").notNull(),
  guardianRelationship: text("guardian_relationship").notNull(),

  // --- Consent — given by the guardian, never the athlete ---
  parentalConsentGiven: boolean("parental_consent_given").notNull().default(false),
  consentAcceptedAt: timestamp("consent_accepted_at", { withTimezone: true }),
  privacyPolicyAccepted: boolean("privacy_policy_accepted").notNull().default(false),
  juniorTermsAccepted: boolean("junior_terms_accepted").notNull().default(false),

  // --- Privacy & review ---
  // Always true. No code path in this repo can currently set this to
  // false — that's intentional, not an oversight, until reviewed.
  isPrivateProfile: boolean("is_private_profile").notNull().default(true),
  // pending | approved | rejected — mirrors the adult fighter_applications
  // review workflow (submit -> admin review -> approve/reject).
  status: text("status").notNull().default("pending"),
  // not_paid | paid — payment is made by the guardian, never the athlete.
  paymentStatus: text("payment_status").notNull().default("not_paid"),
  adminNotes: text("admin_notes"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertJuniorApplicationSchema = createInsertSchema(
  juniorApplicationsTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertJuniorApplication = z.infer<typeof insertJuniorApplicationSchema>;
export type JuniorApplication = typeof juniorApplicationsTable.$inferSelect;
