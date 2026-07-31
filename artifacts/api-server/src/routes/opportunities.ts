import { Router } from "express";
import { db, opportunitiesTable, fightersTable, fighterApplicationsTable, type Opportunity } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { ListOpportunitiesQueryParams } from "@workspace/api-zod";

const router = Router();

// Short in-memory cache for the public (redacted/unpaid) opportunities
// list. This is the overwhelming majority of traffic (anonymous visitors
// and unpaid members) and the data doesn't need to be real-time-fresh to
// the second. Paid requests always skip the cache and hit the DB fresh —
// never risk serving a cached unpaid (redacted) response to a paid
// request or vice versa.
// NOTE: this reduces per-request DB round-trip time once the server is
// warm. It does NOT fix container cold-start (the first request after
// the deployment has been idle) — that's a hosting/infrastructure
// setting (e.g. a minimum instance count) outside what application code
// can control, flagged separately in the report.
let publicListCache: { data: Opportunity[]; expiresAt: number } | null = null;
const PUBLIC_CACHE_TTL_MS = 30_000;

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
    const hasFilters = parsed.success && (parsed.data.type || parsed.data.status);

    const paid = await isRequestFromPaidMember(req);

    // Fast path: unfiltered request from an unpaid/anonymous requester —
    // by far the most common case — can be served from cache.
    if (!hasFilters && !paid && publicListCache && publicListCache.expiresAt > Date.now()) {
      return res.json(publicListCache.data);
    }

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

    const redacted = opportunities.map((o: Opportunity) => redactIfUnpaid(o, paid));

    if (!hasFilters && !paid) {
      publicListCache = { data: redacted, expiresAt: Date.now() + PUBLIC_CACHE_TTL_MS };
    }

    return res.json(redacted);
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
