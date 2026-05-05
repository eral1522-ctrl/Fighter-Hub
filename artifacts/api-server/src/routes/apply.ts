import { Router } from "express";
import { db, fighterApplicationsTable } from "@workspace/db";
import { SubmitFighterApplicationBody } from "@workspace/api-zod";

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
    return res.status(201).json(application);
  } catch (err) {
    req.log.error({ err }, "Apply: failed to save fighter application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
