import { Router } from "express";
import { sendContactMessage } from "../lib/mailer";

const router = Router();

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// POST /api/contact — public, no auth required
router.post("/", async (req: any, res: any) => {
  const { name, email, subject, message } = req.body ?? {};

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(subject) || !isNonEmptyString(message)) {
    return res.status(400).json({ error: "Name, email, subject, and message are all required." });
  }

  if (!isValidEmail(email.trim())) {
    return res.status(400).json({ error: "Please provide a valid email address." });
  }

  try {
    await sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Contact: failed to send contact form email (check SMTP env vars)");
    return res.status(502).json({ error: "We couldn't send your message right now. Please try again or email us directly." });
  }
});

export default router;
