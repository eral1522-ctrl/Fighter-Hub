import { Router } from "express";
import { db, fighterApplicationsTable } from "@workspace/db";
import { sendApplicationConfirmation, sendAdminNewApplicationNotification } from "../lib/mailer";

const router = Router();

// Manual validation, not the generated SubmitFighterApplicationBody — that
// schema predates the professional/amateur form fields (athleteType,
// ringName, city, instagram, currentGym, careerObjective, currentManager,
// competitionExperience, sportingProfileUrl) and would silently strip
// them via zod's default unknown-key stripping, meaning anything a
// fighter filled in would be accepted by the request but never saved.
function validateApplication(body: any): { data?: Record<string, unknown>; error?: string } {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be an object" };
  }

  const requiredStrings = ["name", "email", "country", "city", "discipline", "weightClass", "record", "dateOfBirth"];
  for (const field of requiredStrings) {
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return { error: `${field} is required` };
    }
  }

  if (body.athleteType !== undefined && body.athleteType !== null) {
    if (!["professional", "amateur"].includes(body.athleteType)) {
      return { error: "athleteType must be 'professional' or 'amateur'" };
    }
  }

  // Amateurs are never required to provide a professional-style
  // sportingProfileUrl / currentManager — those stay fully optional
  // regardless of athleteType. Only `record` above is required for both,
  // interpreted contextually (amateur record vs professional record).

  const optionalStrings = [
    "bio", "whatsapp", "instagram", "ringName", "sportingProfileUrl",
    "currentGym", "coach", "careerObjective", "currentManager", "competitionExperience",
  ];
  const data: Record<string, unknown> = {};
  for (const field of requiredStrings) data[field] = body[field].trim();
  if (body.athleteType) data.athleteType = body.athleteType;
  for (const field of optionalStrings) {
    if (typeof body[field] === "string" && body[field].trim()) {
      data[field] = body[field].trim();
    }
  }

  // Backward-compat: keep writing the legacy boxrecLink column too, so
  // existing admin views that still read it keep working, alongside the
  // new generalized sportingProfileUrl.
  if (data.sportingProfileUrl) {
    data.boxrecLink = data.sportingProfileUrl;
  } else if (typeof body.boxrecLink === "string" && body.boxrecLink.trim()) {
    data.boxrecLink = body.boxrecLink.trim();
    data.sportingProfileUrl = body.boxrecLink.trim();
  }

  // --- Minor applicants: guardian details required when under 18 ---
  // Age is computed server-side from dateOfBirth; never trusted from a
  // client-supplied "isMinor" flag.
  const dobStr = String(data.dateOfBirth);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobStr)) {
    return { error: "dateOfBirth must be a valid date (YYYY-MM-DD)" };
  }
  const dob = new Date(`${dobStr}T00:00:00Z`);
  // Reject impossible calendar dates (e.g. 2012-02-31), which Date()
  // would silently normalize into March.
  if (isNaN(dob.getTime()) || dob.toISOString().slice(0, 10) !== dobStr) {
    return { error: "dateOfBirth must be a valid date (YYYY-MM-DD)" };
  }
  const now = new Date();
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - dob.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < dob.getUTCDate())) {
    age--;
  }
  if (age < 0 || age > 120) {
    return { error: "dateOfBirth is out of the accepted range" };
  }

  if (age < 18) {
    const guardianRequired = [
      "guardianName", "guardianRelationship", "guardianEmail", "guardianPhone", "guardianCountry",
    ];
    for (const field of guardianRequired) {
      if (typeof body[field] !== "string" || !body[field].trim()) {
        return { error: `${field} is required for applicants under 18` };
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.guardianEmail.trim())) {
      return { error: "guardianEmail must be a valid email address" };
    }
    const guardianConfirmations = [
      "guardianAuthorizesApplication",
      "guardianAcceptsTerms",
      "guardianAuthorizesDataProcessing",
      "guardianAcknowledgesLicenses",
    ];
    for (const field of guardianConfirmations) {
      if (body[field] !== true) {
        return { error: "All guardian confirmations are required for applicants under 18" };
      }
    }
    for (const field of guardianRequired) data[field] = body[field].trim();
    // Server-side timestamp: all four confirmations arrived true.
    data.guardianConsentAcceptedAt = new Date();
  }

  // Consent timestamp is set server-side from the fact that this request
  // arrived with consent=true, never trusted from a client-supplied
  // timestamp (which could be spoofed).
  if (body.consent === true) {
    data.consentAcceptedAt = new Date();
  } else {
    return { error: "Consent to terms and privacy policy is required" };
  }

  return { data };
}

// POST /api/apply — public, no auth required
router.post("/", async (req: any, res: any) => {
  const parsed = validateApplication(req.body);
  if (parsed.error) {
    return res.status(400).json({ error: parsed.error });
  }

  try {
    const [application] = await db
      .insert(fighterApplicationsTable)
      .values({ ...(parsed.data as any), status: "pending" })
      .returning();

    const appId = application.id;

    // Fire fighter confirmation email — non-blocking, failure doesn't affect response
    sendApplicationConfirmation(parsed.data as any, appId).catch((err) => {
      req.log.warn({ err }, "Apply: failed to send fighter confirmation email (check SMTP env vars)");
    });

    // Fire admin notification email — non-blocking, failure doesn't affect response
    sendAdminNewApplicationNotification(parsed.data as any, appId).catch((err) => {
      req.log.warn({ err }, "Apply: failed to send admin notification email (check SMTP/ADMIN_EMAIL env vars)");
    });

    return res.status(201).json(application);
  } catch (err) {
    req.log.error({ err }, "Apply: failed to save fighter application");
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
