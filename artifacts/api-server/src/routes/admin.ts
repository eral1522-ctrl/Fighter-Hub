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
  unmatchedPaymentsTable,
  teamMembersTable,
} from "@workspace/db";
import { eq, count, ilike, and, or, desc, asc, SQL } from "drizzle-orm";
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

// Admin middleware: only Clerk user IDs listed in ADMIN_CLERK_IDS may access
// admin routes. If ADMIN_CLERK_IDS is not configured, admin access is
// disabled for everyone (fail closed) rather than open to any signed-in
// user, to avoid accidentally exposing fighter applications, emails, and
// payment status to the public.
const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);

function requireAdmin(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = (auth?.sessionClaims?.userId as string | undefined) || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (ADMIN_CLERK_IDS.length === 0) {
    req.log.error(
      "Admin route blocked: ADMIN_CLERK_IDS is not configured. Set it in Secrets to grant admin access — see admin.ts.",
    );
    return res.status(403).json({ error: "Forbidden: admin access is not configured on this server" });
  }

  if (!ADMIN_CLERK_IDS.includes(userId as string)) {
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

// GET /api/admin/opportunities — list ALL opportunities regardless of
// status (draft/verified included) so admins can see and manage the
// full pipeline, not just what's public.
router.get("/opportunities", requireAdmin, async (req: any, res: any) => {
  try {
    const opportunities = await db
      .select()
      .from(opportunitiesTable)
      .orderBy(desc(opportunitiesTable.createdAt));
    return res.json(opportunities);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to list opportunities");
    return res.status(500).json({ error: "Internal server error" });
  }
});

const OPPORTUNITY_STATUSES = ["draft", "under_review", "verified", "published", "closed", "archived"];
const OPPORTUNITY_TYPES = ["fight", "sponsor"];
// Fields PATCH is allowed to touch. Anything not listed here is ignored
// rather than erroring, so unrelated request-body noise can't slip through.
const OPPORTUNITY_EDITABLE_FIELDS = [
  "status", "title", "type", "description", "location", "date", "weightClass",
  "compensation", "purse", "country", "city", "sport", "level",
  "travelIncluded", "accommodationIncluded", "promoterOrganization", "gender",
  "requiredExperience", "applicationDeadline", "travelAccommodationDetails",
  "memberOnlyDetails", "applicationInstructions", "adminVerificationNotes",
  "expirationDate",
];

function validateOpportunityUpdate(body: any): { data?: Record<string, unknown>; error?: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be an object" };
  }
  const data: Record<string, unknown> = {};
  for (const key of OPPORTUNITY_EDITABLE_FIELDS) {
    if (!(key in body)) continue;
    const value = body[key];
    if (key === "status" && value !== undefined && !OPPORTUNITY_STATUSES.includes(value)) {
      return { error: `status must be one of: ${OPPORTUNITY_STATUSES.join(", ")}` };
    }
    if (key === "type" && value !== undefined && !OPPORTUNITY_TYPES.includes(value)) {
      return { error: `type must be one of: ${OPPORTUNITY_TYPES.join(", ")}` };
    }
    if ((key === "travelIncluded" || key === "accommodationIncluded") && value !== null && value !== undefined && typeof value !== "boolean") {
      return { error: `${key} must be a boolean or null` };
    }
    data[key] = value;
  }
  return { data };
}

// PATCH /api/admin/opportunities/:id — update status/fields.
// This was the missing piece: there was previously no way at all,
// through any API, to move an opportunity from draft to verified to
// published (or to edit it after creation) — only creation existed.
router.patch("/opportunities/:id", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  const parsed = validateOpportunityUpdate(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }
  if (!parsed.data || Object.keys(parsed.data).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    const [opportunity] = await db
      .update(opportunitiesTable)
      .set(parsed.data)
      .where(eq(opportunitiesTable.id, id))
      .returning();

    if (!opportunity) return res.status(404).json({ error: "Opportunity not found" });
    return res.json(opportunity);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to update opportunity");
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

const TEAM_CATEGORIES = ["board", "founding_fighter", "advisory", "legal", "medical", "partner"];

// GET /api/admin/team — list ALL team members (active and inactive)
router.get("/team", requireAdmin, async (req: any, res: any) => {
  try {
    const members = await db
      .select()
      .from(teamMembersTable)
      .orderBy(asc(teamMembersTable.category), asc(teamMembersTable.sortOrder), asc(teamMembersTable.id));
    return res.json(members);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to list team members");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/team — create a team member profile
router.post("/team", requireAdmin, async (req: any, res: any) => {
  const { name, role, category } = req.body ?? {};
  if (typeof name !== "string" || !name.trim()) return res.status(400).json({ error: "name is required" });
  if (typeof role !== "string" || !role.trim()) return res.status(400).json({ error: "role is required" });
  if (!TEAM_CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${TEAM_CATEGORIES.join(", ")}` });
  }

  try {
    const [member] = await db
      .insert(teamMembersTable)
      .values({
        name: name.trim(),
        role: role.trim(),
        category,
        photoUrl: typeof req.body.photoUrl === "string" ? req.body.photoUrl.trim() || null : null,
        bio: typeof req.body.bio === "string" ? req.body.bio.trim() || null : null,
        country: typeof req.body.country === "string" ? req.body.country.trim() || null : null,
        disciplineOrArea: typeof req.body.disciplineOrArea === "string" ? req.body.disciplineOrArea.trim() || null : null,
        externalUrl: typeof req.body.externalUrl === "string" ? req.body.externalUrl.trim() || null : null,
        active: req.body.active === false ? false : true,
        sortOrder: typeof req.body.sortOrder === "number" ? req.body.sortOrder : 0,
      })
      .returning();
    return res.status(201).json(member);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to create team member");
    return res.status(500).json({ error: "Internal server error" });
  }
});

const TEAM_EDITABLE_FIELDS = [
  "name", "role", "category", "photoUrl", "bio", "country",
  "disciplineOrArea", "externalUrl", "active", "sortOrder",
];

// PATCH /api/admin/team/:id — update a team member profile
router.patch("/team/:id", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  if (req.body?.category !== undefined && !TEAM_CATEGORIES.includes(req.body.category)) {
    return res.status(400).json({ error: `category must be one of: ${TEAM_CATEGORIES.join(", ")}` });
  }

  const data: Record<string, unknown> = {};
  for (const key of TEAM_EDITABLE_FIELDS) {
    if (key in (req.body ?? {})) data[key] = req.body[key];
  }
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    const [member] = await db
      .update(teamMembersTable)
      .set(data)
      .where(eq(teamMembersTable.id, id))
      .returning();
    if (!member) return res.status(404).json({ error: "Team member not found" });
    return res.json(member);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to update team member");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/admin/team/:id — remove a team member profile entirely
// (as opposed to just setting active=false, for genuine mistakes/test
// entries that should never have existed)
router.delete("/team/:id", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [deleted] = await db
      .delete(teamMembersTable)
      .where(eq(teamMembersTable.id, id))
      .returning({ id: teamMembersTable.id });
    if (!deleted) return res.status(404).json({ error: "Team member not found" });
    return res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Admin: failed to delete team member");
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
    // Enforce "approval before payment" server-side, not just via UI flow —
    // an admin should not be able to send a payment link to an application
    // that hasn't been approved yet.
    const [existing] = await db
      .select({ status: fighterApplicationsTable.status })
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.id, id))
      .limit(1);

    if (!existing) return res.status(404).json({ error: "Application not found" });
    if (existing.status !== "approved") {
      return res.status(400).json({
        error: `Cannot send a payment link to an application with status "${existing.status}". Approve it first.`,
      });
    }

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

// POST /api/admin/fighter-applications/:id/resend-notification — resend approval or rejection email
router.post("/fighter-applications/:id/resend-notification", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });

  try {
    const [application] = await db
      .select()
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.id, id))
      .limit(1);

    if (!application) return res.status(404).json({ error: "Application not found" });

    const status = application.status;
    if (status !== "approved" && status !== "rejected") {
      return res.status(400).json({ error: "No notification to resend: application is still pending" });
    }

    if (status === "approved") {
      sendApplicationApproved(application.name, application.email, id).catch((err) => {
        req.log.warn({ err, id }, "Admin: failed to resend approval email");
      });
    } else {
      sendApplicationRejected(application.name, application.email, id).catch((err) => {
        req.log.warn({ err, id }, "Admin: failed to resend rejection email");
      });
    }

    req.log.info({ id, status }, "Admin: resend notification triggered");
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Admin: failed to resend notification");
    return res.status(500).json({ error: "Internal server error" });
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
    // Legacy fields — unchanged queries, kept for AdminPage.tsx (the
    // fighters/applications tables it reads from) which already renders
    // these exact field names. Do not rename/remove without updating
    // that page too.
    const [totalFighters] = await db
      .select({ count: count() })
      .from(fightersTable);
    const [pendingApproval] = await db
      .select({ count: count() })
      .from(fightersTable)
      .where(eq(fightersTable.approvalStatus, "pending"));
    const [legacyTotalApplications] = await db
      .select({ count: count() })
      .from(applicationsTable);
    const [pendingApplications] = await db
      .select({ count: count() })
      .from(applicationsTable)
      .where(or(eq(applicationsTable.status, "pending"), eq(applicationsTable.status, "submitted")));

    // Canonical fields — fighter_applications is the real source of
    // truth for registration/approval/payment (see apply.ts, admin
    // fighter-applications routes). Used by the new admin dashboard.
    const [totalApplications] = await db
      .select({ count: count() })
      .from(fighterApplicationsTable);
    const [pendingReview] = await db
      .select({ count: count() })
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.status, "pending"));
    const [approved] = await db
      .select({ count: count() })
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.status, "approved"));
    const [rejected] = await db
      .select({ count: count() })
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.status, "rejected"));
    const [paidMembers] = await db
      .select({ count: count() })
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.paymentStatus, "paid"));
    const [approvedUnpaid] = await db
      .select({ count: count() })
      .from(fighterApplicationsTable)
      .where(and(eq(fighterApplicationsTable.status, "approved"), eq(fighterApplicationsTable.paymentStatus, "not_paid")));

    const [totalOpportunities] = await db
      .select({ count: count() })
      .from(opportunitiesTable);
    const [publishedOpportunities] = await db
      .select({ count: count() })
      .from(opportunitiesTable)
      .where(or(
        eq(opportunitiesTable.status, "published"),
        eq(opportunitiesTable.status, "closing_soon"),
        eq(opportunitiesTable.status, "matched"),
        eq(opportunitiesTable.status, "closed"),
      ));
    const [draftOpportunities] = await db
      .select({ count: count() })
      .from(opportunitiesTable)
      .where(or(eq(opportunitiesTable.status, "draft"), eq(opportunitiesTable.status, "verified")));
    const [totalEvents] = await db
      .select({ count: count() })
      .from(eventsTable);

    return res.json({
      // legacy (kept for AdminPage.tsx)
      totalFighters: Number(totalFighters.count),
      pendingApproval: Number(pendingApproval.count),
      totalApplications: Number(legacyTotalApplications.count),
      pendingApplications: Number(pendingApplications.count),
      totalEvents: Number(totalEvents.count),
      // canonical (fighter_applications-based, used by the new dashboard)
      canonicalTotalApplications: Number(totalApplications.count),
      canonicalPendingReview: Number(pendingReview.count),
      canonicalApproved: Number(approved.count),
      canonicalRejected: Number(rejected.count),
      canonicalPaidMembers: Number(paidMembers.count),
      canonicalApprovedUnpaid: Number(approvedUnpaid.count),
      totalOpportunities: Number(totalOpportunities.count),
      publishedOpportunities: Number(publishedOpportunities.count),
      draftOpportunities: Number(draftOpportunities.count),
    });
  } catch (err) {
    req.log.error({ err }, "Admin: failed to get stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/unmatched-payments — Stripe payments the webhook couldn't
// auto-match to a fighter application by email. Surfaced here so a real
// payment never silently goes unnoticed in server logs.
router.get("/unmatched-payments", requireAdmin, async (req: any, res: any) => {
  try {
    const payments = await db
      .select()
      .from(unmatchedPaymentsTable)
      .where(eq(unmatchedPaymentsTable.resolved, false))
      .orderBy(desc(unmatchedPaymentsTable.createdAt));
    return res.json(payments);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to list unmatched payments");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/unmatched-payments/:id — manually link an unmatched
// payment to a fighter application and mark that application as paid.
router.patch("/unmatched-payments/:id", requireAdmin, async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  const applicationId = parseInt(req.body?.applicationId);

  if (!Number.isFinite(id) || !Number.isFinite(applicationId)) {
    return res.status(400).json({ error: "A valid applicationId is required" });
  }

  try {
    const [application] = await db
      .select({ id: fighterApplicationsTable.id })
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.id, applicationId))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: "Fighter application not found" });
    }

    await db
      .update(fighterApplicationsTable)
      .set({ paymentStatus: "paid" })
      .where(eq(fighterApplicationsTable.id, applicationId));

    await db
      .update(unmatchedPaymentsTable)
      .set({ resolved: true, linkedApplicationId: applicationId })
      .where(eq(unmatchedPaymentsTable.id, id));

    req.log.info({ unmatchedPaymentId: id, applicationId }, "Admin: manually resolved unmatched payment");
    return res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Admin: failed to resolve unmatched payment");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
