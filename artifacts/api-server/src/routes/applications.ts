import { Router } from "express";
import { getAuth } from "@clerk/express";
import {
  db,
  applicationsTable,
  fightersTable,
  opportunitiesTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
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

    // Enrich with opportunity title and fighter name
    const enriched = await Promise.all(
      applications.map(async (app) => {
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
    return res.status(400).json({ error: "Invalid request: " + parsed.error.issues.map((i: any) => i.message).join(", ") });
  }

  if (!parsed.data.opportunityId && !parsed.data.eventId) {
    req.log.warn({ body: req.body }, "Application submitted without opportunityId or eventId");
    return res.status(400).json({ error: "You must provide an opportunityId or eventId." });
  }

  try {
    const [fighter] = await db
      .select()
      .from(fightersTable)
      .where(eq(fightersTable.clerkUserId, req.clerkUserId))
      .limit(1);

    if (!fighter) {
      req.log.warn({ clerkUserId: req.clerkUserId }, "Application attempt with no fighter profile");
      return res
        .status(400)
        .json({ error: "Please complete your fighter profile before applying." });
    }

    const [application] = await db
      .insert(applicationsTable)
      .values({
        fighterId: fighter.id,
        opportunityId: parsed.data.opportunityId ?? null,
        eventId: parsed.data.eventId ?? null,
        message: parsed.data.message ?? null,
        status: "pending",
      })
      .returning();

    req.log.info({ applicationId: application.id, fighterId: fighter.id }, "Application created");

    return res.status(201).json({
      ...application,
      fighterName: fighter.fullName,
      opportunityTitle: null,
    });
  } catch (err: any) {
    req.log.error({ err, clerkUserId: req.clerkUserId, body: req.body, errMessage: err?.message, errCode: err?.code }, "Failed to create application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
