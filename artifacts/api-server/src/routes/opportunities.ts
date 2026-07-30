import { Router } from "express";
import { db, opportunitiesTable, fightersTable, fighterApplicationsTable, type Opportunity } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { ListOpportunitiesQueryParams } from "@workspace/api-zod";

const router = Router();

// Compensation/purse is a paid-member benefit. It must never leave the
// server for a request that isn't confirmed paid — blurring it in the UI
// is not real access control, since the raw API response is still
// inspectable by anyone (logged in or not) via the network tab.
async function isRequestFromPaidMember(req: any): Promise<boolean> {
  try {
    const auth = getAuth(req);
    const clerkUserId = (auth?.sessionClaims?.userId as string | undefined) || auth?.userId;
    if (!clerkUserId) return false;

    const [fighter] = await db
      .select({ email: fightersTable.email })
      .from(fightersTable)
      .where(eq(fightersTable.clerkUserId, clerkUserId))
      .limit(1);
    if (!fighter?.email) return false;

    const [application] = await db
      .select({ paymentStatus: fighterApplicationsTable.paymentStatus })
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.email, fighter.email))
      .limit(1);

    return application?.paymentStatus === "paid";
  } catch {
    // Fail closed: any error resolving payment status means treat the
    // requester as unpaid rather than risk leaking gated data.
    return false;
  }
}

function redactIfUnpaid<T extends { compensation: unknown; purse: unknown }>(
  opp: T,
  paid: boolean,
): T {
  if (paid) return opp;
  return { ...opp, compensation: null, purse: null };
}

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

    const paid = await isRequestFromPaidMember(req);
    return res.json(opportunities.map((o: Opportunity) => redactIfUnpaid(o, paid)));
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

    const paid = await isRequestFromPaidMember(req);
    return res.json(redactIfUnpaid(opportunity, paid));
  } catch (err) {
    req.log.error({ err }, "Failed to get opportunity");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
