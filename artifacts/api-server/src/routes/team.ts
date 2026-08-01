import { Router } from "express";
import { db, teamMembersTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

// GET /api/team — public. Only active=true, sorted by sortOrder.
// No admin-only fields (there are none sensitive on this table — bios
// and photos are meant to be public), but only active rows are ever
// returned so a profile can be prepared/edited before going live.
router.get("/", async (req: any, res: any) => {
  try {
    const members = await db
      .select()
      .from(teamMembersTable)
      .where(eq(teamMembersTable.active, true))
      .orderBy(asc(teamMembersTable.sortOrder), asc(teamMembersTable.id));
    return res.json(members);
  } catch (err) {
    req.log.error({ err }, "Failed to list team members");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
