import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { fighterApplicationsTable } from "./fighter-applications";

// Records every Stripe checkout.session.completed / invoice.payment_succeeded
// event the webhook receives. When the payer's email matches an existing
// fighter_applications row, that row is auto-marked as paid and resolved
// is set to true. When no match is found, the row stays unresolved so it
// shows up as an actionable alert in the admin panel instead of only being
// visible in server logs (which nobody checks day-to-day).
export const unmatchedPaymentsTable = pgTable("unmatched_payments", {
  id: serial("id").primaryKey(),
  stripeSessionId: text("stripe_session_id").notNull(),
  payerEmail: text("payer_email"),
  amountTotal: integer("amount_total"), // in cents, as Stripe reports it
  currency: text("currency"),
  resolved: boolean("resolved").notNull().default(false),
  // Set if/when an admin manually links this payment to an application.
  linkedApplicationId: integer("linked_application_id").references(
    () => fighterApplicationsTable.id,
    { onDelete: "set null" },
  ),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type UnmatchedPayment = typeof unmatchedPaymentsTable.$inferSelect;
