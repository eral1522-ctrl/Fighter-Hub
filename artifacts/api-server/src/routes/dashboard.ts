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

// GET /api/dashboard/stats — get dashboard summary for current fighter
router.get("/stats", requireAuth, async (req: any, res: any) => {
  try {
    const [fighter] = await db
      .select()
      .from(fightersTable)
      .where(eq(fightersTable.clerkUserId, req.clerkUserId))
      .limit(1);

    const [oppCount] = await db
      .select({ count: count() })
      .from(opportunitiesTable);
    const [fightOppCount] = await db
      .select({ count: count() })
      .from(opportunitiesTable)
      .where(eq(opportunitiesTable.type, "fight"));
    const [sponsorOppCount] = await db
      .select({ count: count() })
      .from(opportunitiesTable)
      .where(eq(opportunitiesTable.type, "sponsor"));
    const [eventCount] = await db.select({ count: count() }).from(eventsTable);

    let myApps = 0;
    let pendingApps = 0;
    let approvedApps = 0;

    if (fighter) {
      const [myTotal] = await db
        .select({ count: count() })
        .from(applicationsTable)
        .where(eq(applicationsTable.fighterId, fighter.id));
      const [myPending] = await db
        .select({ count: count() })
        .from(applicationsTable)
        .where(eq(applicationsTable.fighterId, fighter.id))
        // @ts-ignore
        .where(eq(applicationsTable.status, "pending"));
      const [myApproved] = await db
        .select({ count: count() })
        .from(applicationsTable)
        .where(eq(applicationsTable.fighterId, fighter.id))
        // @ts-ignore
        .where(eq(applicationsTable.status, "approved"));
      myApps = Number(myTotal.count);
      pendingApps = Number(myPending.count);
      approvedApps = Number(myApproved.count);
    }

    let paymentStatus: "not_paid" | "paid" = "not_paid";
    let paymentLink: string | null = null;

    if (fighter?.email) {
      const [application] = await db
        .select({
          paymentStatus: fighterApplicationsTable.paymentStatus,
          paymentLink: fighterApplicationsTable.paymentLink,
        })
        .from(fighterApplicationsTable)
        .where(eq(fighterApplicationsTable.email, fighter.email))
        .limit(1);

      if (application) {
        paymentStatus = (application.paymentStatus as "not_paid" | "paid") ?? "not_paid";
        paymentLink = application.paymentLink ?? null;
      }
    }

    return res.json({
      totalOpportunities: Number(oppCount.count),
      totalFightOpportunities: Number(fightOppCount.count),
      totalSponsorOpportunities: Number(sponsorOppCount.count),
      totalEvents: Number(eventCount.count),
      myApplications: myApps,
      pendingApplications: pendingApps,
      approvedApplications: approvedApps,
      membershipStatus: fighter?.membershipStatus ?? "inactive",
      approvalStatus: fighter?.approvalStatus ?? "none",
      paymentStatus,
      paymentLink,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard stats");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
