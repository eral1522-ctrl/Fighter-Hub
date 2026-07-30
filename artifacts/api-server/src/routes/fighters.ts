import { Router } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { db, fightersTable, fighterApplicationsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";
import {
  CreateMyProfileBody,
  UpdateMyProfileBody,
} from "@workspace/api-zod";

const router = Router();

// Middleware: require authentication
function requireAuth(req: any, res: any, next: any) {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.clerkUserId = userId;
  next();
}

// GET /api/fighters/me/prefill — return latest application data for profile pre-fill
router.get("/me/prefill", requireAuth, async (req: any, res: any) => {
  try {
    const user = await clerkClient.users.getUser(req.clerkUserId);
    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return res.status(404).json({ error: "No email found" });
    }

    const [application] = await db
      .select()
      .from(fighterApplicationsTable)
      .where(eq(fighterApplicationsTable.email, email))
      .orderBy(desc(fighterApplicationsTable.createdAt))
      .limit(1);

    if (!application) {
      return res.status(404).json({ error: "No application found" });
    }

    return res.json({
      name: application.name,
      email: application.email,
      country: application.country,
      discipline: application.discipline,
      weightClass: application.weightClass,
      record: application.record,
      bio: application.bio ?? null,
      boxrecLink: application.boxrecLink ?? null,
      whatsapp: application.whatsapp ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get profile prefill data");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/fighters/me — get current fighter's profile
router.get("/me", requireAuth, async (req: any, res: any) => {
  try {
    const [fighter] = await db
      .select()
      .from(fightersTable)
      .where(eq(fightersTable.clerkUserId, req.clerkUserId))
      .limit(1);

    if (!fighter) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json(fighter);
  } catch (err) {
    req.log.error({ err }, "Failed to get fighter profile");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/fighters/me — create fighter profile
router.post("/me", requireAuth, async (req: any, res: any) => {
  const parsed = CreateMyProfileBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  try {
    // Check if profile already exists
    const [existing] = await db
      .select()
      .from(fightersTable)
      .where(eq(fightersTable.clerkUserId, req.clerkUserId))
      .limit(1);

    if (existing) {
      return res.status(400).json({ error: "Profile already exists" });
    }

    // Canonical gate: fighter_applications is the source of truth for
    // application/approval/payment. A member profile can only be
    // activated once there's an approved application for this person's
    // email — otherwise anyone who signs in could self-create a profile
    // without ever having gone through /apply and admin review.
    const user = await clerkClient.users.getUser(req.clerkUserId);
    const email = user.emailAddresses.find(
      (e: any) => e.id === user.primaryEmailAddressId,
    )?.emailAddress;

    if (!email) {
      return res.status(400).json({ error: "No verified email found on your account" });
    }

    const [approvedApplication] = await db
      .select({ id: fighterApplicationsTable.id })
      .from(fighterApplicationsTable)
      .where(
        and(
          eq(fighterApplicationsTable.email, email),
          eq(fighterApplicationsTable.status, "approved"),
        ),
      )
      .limit(1);

    if (!approvedApplication) {
      return res.status(403).json({
        error: "No approved IFA application found for this email. Apply at /apply and wait for approval first.",
        code: "NO_APPROVED_APPLICATION",
      });
    }

    const [fighter] = await db
      .insert(fightersTable)
      .values({
        ...parsed.data,
        clerkUserId: req.clerkUserId,
        approvalStatus: "pending",
        membershipStatus: "inactive",
      })
      .returning();

    return res.status(201).json(fighter);
  } catch (err) {
    req.log.error({ err }, "Failed to create fighter profile");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/fighters/me — update fighter profile
router.patch("/me", requireAuth, async (req: any, res: any) => {
  const parsed = UpdateMyProfileBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.message });
  }

  try {
    const [fighter] = await db
      .update(fightersTable)
      .set(parsed.data)
      .where(eq(fightersTable.clerkUserId, req.clerkUserId))
      .returning();

    if (!fighter) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json(fighter);
  } catch (err) {
    req.log.error({ err }, "Failed to update fighter profile");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
