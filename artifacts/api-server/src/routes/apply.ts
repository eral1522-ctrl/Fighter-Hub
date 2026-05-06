import { Router } from "express";
import { db, fighterApplicationsTable } from "@workspace/db";
import { SubmitFighterApplicationBody } from "@workspace/api-zod";
import { sendApplicationConfirmation, sendAdminNewApplicationNotification } from "../lib/mailer";

const router = Router();

// POST /api/apply — public, no auth required
router.post("/", async (req: any, res: any) => {
  const parsed = SubmitFighterApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  try {
    const [application] = await db
      .insert(fighterApplicationsTable)
      .values(parsed.data)
      .returning();

    const appId = application.id;

    // Fire fighter confirmation email — non-blocking, failure doesn't affect response
    sendApplicationConfirmation(parsed.data, appId).catch((err) => {
      req.log.warn({ err }, "Apply: failed to send fighter confirmation email (check SMTP env vars)");
    });

    // Fire admin notification email — non-blocking, failure doesn't affect response
    sendAdminNewApplicationNotification(parsed.data, appId).catch((err) => {
      req.log.warn({ err }, "Apply: failed to send admin notification email (check SMTP/ADMIN_EMAIL env vars)");
    });

    return res.status(201).json(application);
  } catch (err) {
    req.log.error({ err }, "Apply: failed to save fighter application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
