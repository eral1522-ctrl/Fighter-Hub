import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import {
  db,
  fightersTable,
  opportunitiesTable,
  eventsTable,
  applicationsTable,
  fighterApplicationsTable,
  emailLogTable,
} from "@workspace/db";
import { eq, count, ilike, and, or, desc, SQL } from "drizzle-orm";
import {
  AdminCreateOpportunityBody,
  AdminCreateEventBody,
  AdminUpdateFighterApplicationBody,
} from "@workspace/api-zod";
import {
  getSmtpDiagnostics,
  sendPaymentLink as mailerSendPaymentLink,
  sendTestEmail,
  SmtpDeliveryError,
  sendApplicationApproved,
  sendApplicationRejected,
} from "../lib/mailer";

const router = Router();

// Admin middleware: checks for a special admin claim or hardcoded admin user IDs
// TODO: Replace with your real admin Clerk user IDs or implement a proper role system
const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || "").split(",").filter(Boolean);

function requireAdmin(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = (auth?.sessionClaims?.userId as string | undefined) || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Allow if userId is in admin list OR if no admins configured (dev mode)
  if (ADMIN_CLERK_IDS.length > 0 && !ADMIN_CLERK_IDS.includes(userId as string)) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  req.clerkUserId = userId;
  next();
}

// GET /api/admin/fighters — list all fighters
router.get("/fighters", requireAdmin, async (req: any, res: any) => {
  try {
    const fighters = await db
      .select()
      .from(fightersTable)
      .orderBy(fightersTable.createdAt);
    return res.json(fighters);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to list fighters");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/fighters/:id/approve
router.patch("/fighters/:id/approve", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [fighter] = await db
      .update(fightersTable)
      .set({ approvalStatus: "approved" })
      .where(eq(fightersTable.id, id))
      .returning();

    if (!fighter) return res.status(404).json({ error: "Fighter not found" });
    return res.json(fighter);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to approve fighter");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/fighters/:id/reject
router.patch("/fighters/:id/reject", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [fighter] = await db
      .update(fightersTable)
      .set({ approvalStatus: "rejected" })
      .where(eq(fightersTable.id, id))
      .returning();

    if (!fighter) return res.status(404).json({ error: "Fighter not found" });
    return res.json(fighter);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to reject fighter");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/opportunities — create opportunity
router.post("/opportunities", requireAdmin, async (req: any, res: any) => {
  const parsed = AdminCreateOpportunityBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  try {
    const [opportunity] = await db
      .insert(opportunitiesTable)
      .values(parsed.data)
      .returning();
    return res.status(201).json(opportunity);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to create opportunity");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/events — create event
router.post("/events", requireAdmin, async (req: any, res: any) => {
  const parsed = AdminCreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  try {
    const [event] = await db.insert(eventsTable).values(parsed.data).returning();
    return res.status(201).json(event);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to create event");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/applications — list all applications
router.get("/applications", requireAdmin, async (req: any, res: any) => {
  try {
    const applications = await db
      .select()
      .from(applicationsTable)
      .orderBy(applicationsTable.createdAt);

    // Enrich with fighter name and opportunity title
    const enriched = await Promise.all(
      applications.map(async (app) => {
        const [fighter] = await db
          .select()
          .from(fightersTable)
          .where(eq(fightersTable.id, app.fighterId))
          .limit(1);
        let opportunityTitle = null;
        if (app.opportunityId) {
          const [opp] = await db
            .select()
            .from(opportunitiesTable)
            .where(eq(opportunitiesTable.id, app.opportunityId))
            .limit(1);
          opportunityTitle = opp?.title ?? null;
        }
        return {
          ...app,
          fighterName: fighter?.fullName ?? "Unknown",
          opportunityTitle,
        };
      }),
    );

    return res.json(enriched);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to list applications");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/applications/:id/approve
router.patch("/applications/:id/approve", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [app] = await db
      .update(applicationsTable)
      .set({ status: "approved" })
      .where(eq(applicationsTable.id, id))
      .returning();

    if (!app) return res.status(404).json({ error: "Application not found" });

    const [fighter] = await db
      .select()
      .from(fightersTable)
      .where(eq(fightersTable.id, app.fighterId))
      .limit(1);

    return res.json({
      ...app,
      fighterName: fighter?.fullName ?? "Unknown",
      opportunityTitle: null,
    });
  } catch (err) {
    req.log.error({ err }, "Admin: failed to approve application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/applications/:id/reject
router.patch("/applications/:id/reject", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [app] = await db
      .update(applicationsTable)
      .set({ status: "rejected" })
      .where(eq(applicationsTable.id, id))
      .returning();

    if (!app) return res.status(404).json({ error: "Application not found" });

    const [fighter] = await db
      .select()
      .from(fightersTable)
      .where(eq(fightersTable.id, app.fighterId))
      .limit(1);

    return res.json({
      ...app,
      fighterName: fighter?.fullName ?? "Unknown",
      opportunityTitle: null,
    });
  } catch (err) {
    req.log.error({ err }, "Admin: failed to reject application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/fighter-applications — list all public fighter applications
// Supports query params: q (search name/email), status, discipline
router.get("/fighter-applications", requireAdmin, async (req: any, res: any) => {
  try {
    const { q, status, discipline } = req.query as {
      q?: string;
      status?: string;
      discipline?: string;
    };

    const conditions: SQL[] = [];

    if (q && q.trim()) {
      const term = `%${q.trim()}%`;
      conditions.push(
        or(
          ilike(fighterApplicationsTable.name, term),
          ilike(fighterApplicationsTable.email, term),
        )!,
      );
    }

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      conditions.push(eq(fighterApplicationsTable.status, status));
    }

    if (discipline && discipline.trim()) {
      conditions.push(ilike(fighterApplicationsTable.discipline, discipline.trim()));
    }

    const applications = await db
      .select()
      .from(fighterApplicationsTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(fighterApplicationsTable.createdAt);

    return res.json(applications);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to list fighter applications");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/fighter-applications/:id — update status, notes, paymentStatus, paymentLink
router.patch("/fighter-applications/:id", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const parsed = AdminUpdateFighterApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  const updates: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) updates.status = parsed.data.status;
  if (parsed.data.adminNotes !== undefined) updates.adminNotes = parsed.data.adminNotes;
  if (parsed.data.paymentStatus !== undefined) updates.paymentStatus = parsed.data.paymentStatus;
  if (parsed.data.paymentLink !== undefined) updates.paymentLink = parsed.data.paymentLink;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    // Capture prior status before update so we only send an email on a real transition
    let priorStatus: string | undefined;
    if (parsed.data.status !== undefined) {
      const [prior] = await db
        .select({ status: fighterApplicationsTable.status })
        .from(fighterApplicationsTable)
        .where(eq(fighterApplicationsTable.id, id))
        .limit(1);
      if (!prior) return res.status(404).json({ error: "Application not found" });
      priorStatus = prior.status ?? undefined;
    }

    const [application] = await db
      .update(fighterApplicationsTable)
      .set(updates)
      .where(eq(fighterApplicationsTable.id, id))
      .returning();

    if (!application) return res.status(404).json({ error: "Application not found" });

    // Fire status-change email only when the status genuinely transitions
    const newStatus = parsed.data.status;
    if (newStatus !== undefined && newStatus !== priorStatus) {
      if (newStatus === "approved") {
        sendApplicationApproved(application.name, application.email, id).catch((err) => {
          req.log.warn({ err, id }, "Admin: failed to send approval email");
        });
      } else if (newStatus === "rejected") {
        sendApplicationRejected(application.name, application.email, id).catch((err) => {
          req.log.warn({ err, id }, "Admin: failed to send rejection email");
        });
      }
    }

    return res.json(application);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to update fighter application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/fighter-applications/:id/send-payment-link — save link and email fighter
router.post("/fighter-applications/:id/send-payment-link", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const { AdminSendPaymentLinkBody } = await import("@workspace/api-zod");
  const parsed = AdminSendPaymentLinkBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  try {
    // Save the payment link to the application
    const [application] = await db
      .update(fighterApplicationsTable)
      .set({ paymentLink: parsed.data.paymentLink })
      .where(eq(fighterApplicationsTable.id, id))
      .returning();

    if (!application) return res.status(404).json({ error: "Application not found" });

    // Send bilingual payment email — surfaces real SMTP error to caller
    await mailerSendPaymentLink(application.email, application.name, parsed.data.paymentLink, id);

    req.log.info({ id, email: application.email }, "Admin: payment link email sent");
    return res.json(application);
  } catch (err: any) {
    const message: string = err?.message ?? "Unknown error";
    const errorType: string = err instanceof SmtpDeliveryError ? err.errorType : "Unknown SMTP error";
    const diag = getSmtpDiagnostics();
    req.log.error(
      { errorType, err: message, smtpConfig: diag },
      "Admin: failed to send payment link",
    );
    return res.status(502).json({ error: message, errorType, smtpConfig: diag });
  }
});

// GET /api/admin/fighter-applications/:id/email-log — fetch email delivery history for an application
router.get("/fighter-applications/:id/email-log", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const logs = await db
      .select()
      .from(emailLogTable)
      .where(eq(emailLogTable.applicationId, id))
      .orderBy(desc(emailLogTable.sentAt));

    return res.json(logs);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to fetch email log");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/test-email — send a test email to the logged-in admin
router.post("/test-email", requireAdmin, async (req: any, res: any) => {
  const diag = getSmtpDiagnostics();
  req.log.info({ smtpConfig: diag }, "Admin: test-email requested");

  try {
    // Look up admin's primary email via Clerk
    const user = await clerkClient.users.getUser(req.clerkUserId);
    const adminEmail = user.emailAddresses.find(
      (e: any) => e.id === user.primaryEmailAddressId,
    )?.emailAddress;

    if (!adminEmail) {
      return res.status(400).json({
        error: "Could not find your email address in Clerk.",
        smtpConfig: diag,
      });
    }

    await sendTestEmail(adminEmail);
    req.log.info({ adminEmail }, "Admin: test email sent successfully");
    return res.json({ success: true, sentTo: adminEmail, smtpConfig: diag });
  } catch (err: any) {
    const message: string = err?.message ?? "Unknown error";
    const errorType: string = err instanceof SmtpDeliveryError ? err.errorType : "Unknown SMTP error";
    req.log.error({ errorType, err: message, smtpConfig: diag }, "Admin: test email failed");
    return res.status(502).json({ error: message, errorType, smtpConfig: diag });
  }
});

// GET /api/admin/stats — admin overview stats
router.get("/stats", requireAdmin, async (req: any, res: any) => {
  try {
    const [totalFighters] = await db
      .select({ count: count() })
      .from(fightersTable);
    const [pendingApproval] = await db
      .select({ count: count() })
      .from(fightersTable)
      .where(eq(fightersTable.approvalStatus, "pending"));
    const [approvedFighters] = await db
      .select({ count: count() })
      .from(fightersTable)
      .where(eq(fightersTable.approvalStatus, "approved"));
    const [totalOpportunities] = await db
      .select({ count: count() })
      .from(opportunitiesTable);
    const [totalEvents] = await db
      .select({ count: count() })
      .from(eventsTable);
    const [totalApplications] = await db
      .select({ count: count() })
      .from(applicationsTable);
    const [pendingApplications] = await db
      .select({ count: count() })
      .from(applicationsTable)
      .where(eq(applicationsTable.status, "pending"));

    return res.json({
      totalFighters: Number(totalFighters.count),
      pendingApproval: Number(pendingApproval.count),
      approvedFighters: Number(approvedFighters.count),
      totalOpportunities: Number(totalOpportunities.count),
      totalEvents: Number(totalEvents.count),
      totalApplications: Number(totalApplications.count),
      pendingApplications: Number(pendingApplications.count),
    });
  } catch (err) {
    req.log.error({ err }, "Admin: failed to get stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
