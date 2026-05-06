import {
  pgTable,
  serial,
  integer,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { fighterApplicationsTable } from "./fighter-applications";

export const emailLogTable = pgTable("email_log", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").references(
    () => fighterApplicationsTable.id,
    { onDelete: "cascade" },
  ),
  emailType: text("email_type").notNull(),
  recipientEmail: text("recipient_email").notNull(),
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export type EmailLogEntry = typeof emailLogTable.$inferSelect;
