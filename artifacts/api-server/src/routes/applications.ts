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
    return res.status(400).json({ error: parsed.error.message });
  }

  try {
    const [fighter] = await db
      .select()
      .from(fightersTable)
      .where(eq(fightersTable.clerkUserId, req.clerkUserId))
      .limit(1);

    if (!fighter) {
      return res
        .status(400)
        .json({ error: "You must create a fighter profile first" });
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

    return res.status(201).json({
      ...application,
      fighterName: fighter.fullName,
      opportunityTitle: null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
