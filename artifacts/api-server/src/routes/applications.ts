import { Router } from "express";
import { getAuth } from "@clerk/express";
import {
  db,
  applicationsTable,
  fightersTable,
  opportunitiesTable,
  fighterApplicationsTable,
} from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { CreateApplicationBody } from "@workspace/api-zod";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.clerkUserId = userId;
  next();
}

// GET /api/applications — list my applications
router.get("/", requireAuth, async (req: any, res: any) => {
  try {
    const [fighter] = await db
      .select()
      .from(fightersTable)
      .where(eq(fightersTable.clerkUserId, req.clerkUserId))
      .limit(1);

    if (!fighter) {
      return res.json([]);
    }

    const applications = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.fighterId, fighter.id))
      .orderBy(applicationsTable.createdAt);

    const enriched = await Promise.all(
      applications.map(async (app) => {
        let opportunityTitle = app.opportunityTitle ?? null;
        if (!opportunityTitle && app.opportunityId) {
          const [opp] = await db
            .select()
            .from(opportunitiesTable)
            .where(eq(opportunitiesTable.id, app.opportunityId))
            .limit(1);
          opportunityTitle = opp?.title ?? null;
        }
        return {
          ...app,
          fighterName: fighter.fullName,
          opportunityTitle,
        };
      }),
    );

    return res.json(enriched);
  } catch (err) {
    req.log.error({ err }, "Failed to list applications");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/applications — apply to an opportunity or event
router.post("/", requireAuth, async (req: any, res: any) => {
  const parsed = CreateApplicationBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ zodError: parsed.error.issues, body: req.body }, "Invalid application request body");
    return res.status(400).json({
      error: "Invalid request: " + parsed.error.issues.map((i: any) => i.message).join(", "),
    });
  }

  if (!parsed.data.opportunityId && !parsed.data.eventId) {
    req.log.warn({ body: req.body }, "Application submitted without opportunityId or eventId");
    return res.status(400).json({ error: "You must provide an opportunityId or eventId." });
  }

  try {
    // 1. Resolve fighter profile
    const [fighter] = await db
      .select()
      .from(fightersTable)
      .where(eq(fightersTable.clerkUserId, req.clerkUserId))
      .limit(1);

    if (!fighter) {
      req.log.warn({ clerkUserId: req.clerkUserId }, "Application attempt with no fighter profile");
      return res.status(400).json({ error: "Please complete your fighter profile before applying." });
    }

    // 2. Payment check — must be paid via fighter_applications
    const [fighterApp] = await db
      .select({ id: fighterApplicationsTable.id, paymentStatus: fighterApplicationsTable.paymentStatus })
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.email, fighter.email))
      .limit(1);

    if (!fighterApp || fighterApp.paymentStatus !== "paid") {
      req.log.warn({ clerkUserId: req.clerkUserId, fighterId: fighter.id, paymentStatus: fighterApp?.paymentStatus ?? "none" }, "Application blocked — membership not paid");
      return res.status(403).json({ error: "Activate your IFA Membership to apply for opportunities." });
    }

    // 3. Duplicate check
    if (parsed.data.opportunityId) {
      const [existing] = await db
        .select({ id: applicationsTable.id })
        .from(applicationsTable)
        .where(
          and(
            eq(applicationsTable.fighterId, fighter.id),
            eq(applicationsTable.opportunityId, parsed.data.opportunityId),
          ),
        )
        .limit(1);

      if (existing) {
        req.log.info({ fighterId: fighter.id, opportunityId: parsed.data.opportunityId }, "Duplicate application blocked");
        return res.status(409).json({ error: "You have already applied to this opportunity." });
      }
    }

    if (parsed.data.eventId) {
      const [existing] = await db
        .select({ id: applicationsTable.id })
        .from(applicationsTable)
        .where(
          and(
            eq(applicationsTable.fighterId, fighter.id),
            eq(applicationsTable.eventId, parsed.data.eventId),
          ),
        )
        .limit(1);

      if (existing) {
        req.log.info({ fighterId: fighter.id, eventId: parsed.data.eventId }, "Duplicate event application blocked");
        return res.status(409).json({ error: "You have already applied to this event." });
      }
    }

    // 4. Resolve opportunity details for denormalization
    let opportunityTitle: string | null = null;
    let opportunityType: string | null = null;

    if (parsed.data.opportunityId) {
      const [opp] = await db
        .select({ title: opportunitiesTable.title, type: opportunitiesTable.type })
        .from(opportunitiesTable)
        .where(eq(opportunitiesTable.id, parsed.data.opportunityId))
        .limit(1);
      if (opp) {
        opportunityTitle = opp.title;
        opportunityType = opp.type;
      }
    }

    // 5. Create application
    const [application] = await db
      .insert(applicationsTable)
      .values({
        fighterId: fighter.id,
        clerkUserId: req.clerkUserId,
        fighterApplicationId: fighterApp.id,
        opportunityId: parsed.data.opportunityId ?? null,
        opportunityTitle,
        opportunityType: opportunityType ?? (parsed.data.opportunityId ? "fight" : null),
        eventId: parsed.data.eventId ?? null,
        message: parsed.data.message ?? null,
        status: "submitted",
      })
      .returning();

    req.log.info(
      { applicationId: application.id, fighterId: fighter.id, opportunityId: parsed.data.opportunityId, eventId: parsed.data.eventId },
      "Application created successfully",
    );

    return res.status(201).json({
      ...application,
      fighterName: fighter.fullName,
      opportunityTitle,
    });
  } catch (err: any) {
    req.log.error(
      { err, errMessage: err?.message, errCode: err?.code, clerkUserId: req.clerkUserId, body: req.body },
      "Failed to create application",
    );
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
