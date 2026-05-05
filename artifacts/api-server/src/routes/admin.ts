import { Router } from "express";
import { getAuth } from "@clerk/express";
import {
  db,
  fightersTable,
  opportunitiesTable,
  eventsTable,
  applicationsTable,
  fighterApplicationsTable,
} from "@workspace/db";
import { eq, count } from "drizzle-orm";
import {
  AdminCreateOpportunityBody,
  AdminCreateEventBody,
  AdminUpdateFighterApplicationBody,
} from "@workspace/api-zod";

const router = Router();

// Admin middleware: checks for a special admin claim or hardcoded admin user IDs
// TODO: Replace with your real admin Clerk user IDs or implement a proper role system
const ADMIN_CLERK_IDS = (process.env.ADMIN_CLERK_IDS || "").split(",").filter(Boolean);

function requireAdmin(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Allow if userId is in admin list OR if no admins configured (dev mode)
  if (ADMIN_CLERK_IDS.length > 0 && !ADMIN_CLERK_IDS.includes(userId)) {
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
router.get("/fighter-applications", requireAdmin, async (req: any, res: any) => {
  try {
    const applications = await db
      .select()
      .from(fighterApplicationsTable)
      .orderBy(fighterApplicationsTable.createdAt);
    return res.json(applications);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to list fighter applications");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/fighter-applications/:id — update status and/or notes
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

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    const [application] = await db
      .update(fighterApplicationsTable)
      .set(updates)
      .where(eq(fighterApplicationsTable.id, id))
      .returning();

    if (!application) return res.status(404).json({ error: "Application not found" });
    return res.json(application);
  } catch (err) {
    req.log.error({ err }, "Admin: failed to update fighter application");
    return res.status(500).json({ error: "Internal server error" });
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
