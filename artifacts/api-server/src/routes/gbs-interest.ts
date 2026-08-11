import { Router } from "express";
import { db, gbsInterestSubmissionsTable } from "@workspace/db";
import { sendGbsInterestNotification } from "../lib/mailer";

const router = Router();

const CATEGORIES = ["attendee", "partner", "speaker"] as const;
type Category = (typeof CATEGORIES)[number];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// POST /api/gbs-interest — public, no auth required
router.post("/", async (req: any, res: any) => {
  const body = req.body ?? {};
  const { category, name, email, organization, message, consent, website } = body;

  // Honeypot: real users never fill the hidden "website" field. Bots do.
  // Rejected outright — nothing is stored or emailed, and no success is
  // ever claimed for a discarded submission.
  if (isNonEmptyString(website)) {
    return res.status(400).json({ error: "Invalid submission" });
  }

  if (!CATEGORIES.includes(category as Category)) {
    return res.status(400).json({ error: "Invalid category" });
  }
  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!isNonEmptyString(email) || !isValidEmail(email.trim())) {
    return res.status(400).json({ error: "A valid email address is required" });
  }
  if (consent !== true) {
    return res.status(400).json({ error: "Consent to the privacy policy is required" });
  }

  try {
    const [saved] = await db
      .insert(gbsInterestSubmissionsTable)
      .values({
        category,
        name: name.trim(),
        email: email.trim(),
        organization: isNonEmptyString(organization) ? organization.trim() : null,
        message: isNonEmptyString(message) ? message.trim() : null,
        // Server-side timestamp — the request arrived with consent=true.
        consentAcceptedAt: new Date(),
      })
      .returning();

    // Notification email — non-blocking; the submission is already saved,
    // so an email failure must not turn a real success into an error.
    sendGbsInterestNotification({
      category,
      name: name.trim(),
      email: email.trim(),
      organization: isNonEmptyString(organization) ? organization.trim() : null,
      message: isNonEmptyString(message) ? message.trim() : null,
    }).catch((err) => {
      req.log.warn({ err, submissionId: saved.id }, "GBS interest: failed to send notification email (check SMTP env vars)");
    });

    return res.status(201).json({ success: true, id: saved.id });
  } catch (err) {
    req.log.error({ err }, "GBS interest: failed to save submission");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
