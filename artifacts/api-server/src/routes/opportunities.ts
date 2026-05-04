import { Router } from "express";
import { db, opportunitiesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { ListOpportunitiesQueryParams } from "@workspace/api-zod";

const router = Router();

// GET /api/opportunities — list all opportunities
router.get("/", async (req: any, res: any) => {
  try {
    const parsed = ListOpportunitiesQueryParams.safeParse(req.query);
    let query = db.select().from(opportunitiesTable);

    const conditions = [];
    if (parsed.success) {
      if (parsed.data.type) {
        conditions.push(eq(opportunitiesTable.type, parsed.data.type));
      }
      if (parsed.data.status) {
        conditions.push(eq(opportunitiesTable.status, parsed.data.status));
      }
    }

    const opportunities =
      conditions.length > 0
        ? await db
            .select()
            .from(opportunitiesTable)
            .where(and(...conditions))
            .orderBy(opportunitiesTable.createdAt)
        : await db
            .select()
            .from(opportunitiesTable)
            .orderBy(opportunitiesTable.createdAt);

    return res.json(opportunities);
  } catch (err) {
    req.log.error({ err }, "Failed to list opportunities");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/opportunities/:id — get opportunity by ID
router.get("/:id", async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const [opportunity] = await db
      .select()
      .from(opportunitiesTable)
      .where(eq(opportunitiesTable.id, id))
      .limit(1);

    if (!opportunity) {
      return res.status(404).json({ error: "Opportunity not found" });
    }

    return res.json(opportunity);
  } catch (err) {
    req.log.error({ err }, "Failed to get opportunity");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
