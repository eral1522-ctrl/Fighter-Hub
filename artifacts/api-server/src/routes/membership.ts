import { Router } from "express";

const router = Router();

// These mirror the plans actually shown on /membership in the app.
// Payment for the Athlete plan is processed via a Stripe Payment Link
// (see artifacts/fighters-room/src/pages/membership.tsx — STRIPE_LINK),
// and confirmed automatically by the webhook at /api/stripe/webhook,
// which marks the matching fighter_applications row as paid.
//
// Club/Gym and Partner/Sponsor plans are sold manually via email
// (info@fightersassociation.com) since pricing is custom per account.
const MEMBERSHIP_PLANS = [
  {
    id: "athlete",
    name: "Athlete",
    price: 20,
    currency: "EUR",
    interval: "month",
  },
  {
    id: "gym",
    name: "Club / Gym",
    price: 99,
    currency: "EUR",
    interval: "month",
  },
  {
    id: "partner",
    name: "Partner / Sponsor",
    price: null,
    currency: "EUR",
    interval: null,
  },
];

// GET /api/membership/plans — list membership plans (informational)
router.get("/plans", async (_req: any, res: any) => {
  return res.json(MEMBERSHIP_PLANS);
});

export default router;
