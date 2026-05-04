import { Router } from "express";
import { db, eventsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// GET /api/events — list all events
router.get("/", async (req: any, res: any) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .orderBy(eventsTable.date);
    return res.json(events);
  } catch (err) {
    req.log.error({ err }, "Failed to list events");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/events/:id — get event by ID
router.get("/:id", async (req: any, res: any) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const [event] = await db
      .select()
      .from(eventsTable)
      .where(eq(eventsTable.id, id))
      .limit(1);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.json(event);
  } catch (err) {
    req.log.error({ err }, "Failed to get event");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
