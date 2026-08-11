import {
  pgTable,
  text,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";

// Submissions from the three Global Boxing Summit interest forms
// (Register Interest / Partner / Speaker). Public, no auth.
export const gbsInterestSubmissionsTable = pgTable("gbs_interest_submissions", {
  id: serial("id").primaryKey(),
  // "attendee" | "partner" | "speaker"
  category: text("category").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization"),
  message: text("message"),
  // Set server-side when the request arrives with consent=true — never
  // trusted from a client-supplied timestamp.
  consentAcceptedAt: timestamp("consent_accepted_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type GbsInterestSubmission = typeof gbsInterestSubmissionsTable.$inferSelect;
