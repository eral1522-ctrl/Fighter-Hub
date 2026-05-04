import { Router } from "express";
import { getAuth } from "@clerk/express";
import { SubscribeMembershipBody } from "@workspace/api-zod";

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

// Membership plans configuration
// TODO: Replace stripePriceId values with real Stripe Price IDs from your Stripe dashboard
const MEMBERSHIP_PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 19,
    currency: "EUR",
    interval: "month",
    stripePriceId: process.env.STRIPE_PRICE_BASIC || null, // Add STRIPE_PRICE_BASIC to your env
    features: [
      "Access to fight opportunities",
      "Basic fighter profile",
      "Event listings",
      "Community access",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    currency: "EUR",
    interval: "month",
    stripePriceId: process.env.STRIPE_PRICE_PRO || null, // Add STRIPE_PRICE_PRO to your env
    features: [
      "Everything in Basic",
      "Sponsor opportunities",
      "Priority profile placement",
      "Direct manager contact",
      "Stats & analytics",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: 299,
    currency: "EUR",
    interval: "year",
    stripePriceId: process.env.STRIPE_PRICE_ANNUAL || null, // Add STRIPE_PRICE_ANNUAL to your env
    features: [
      "Everything in Pro",
      "2 months free",
      "Featured fighter badge",
      "Brand campaign access",
      "Global fight booking",
      "Dedicated account manager",
    ],
  },
];

// GET /api/membership/plans — list membership plans
router.get("/plans", async (_req: any, res: any) => {
  return res.json(MEMBERSHIP_PLANS);
});

// POST /api/membership/subscribe — create Stripe checkout session
router.post("/subscribe", requireAuth, async (req: any, res: any) => {
  const parsed = SubscribeMembershipBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  const plan = MEMBERSHIP_PLANS.find((p) => p.id === parsed.data.planId);
  if (!plan) {
    return res.status(400).json({ error: "Plan not found" });
  }

  // TODO: Integrate Stripe here.
  // 1. Install stripe: pnpm --filter @workspace/api-server add stripe
  // 2. Add STRIPE_SECRET_KEY to your environment secrets
  // 3. Create a Stripe checkout session like this:
  //
  // import Stripe from 'stripe';
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // const session = await stripe.checkout.sessions.create({
  //   mode: 'subscription',
  //   payment_method_types: ['card'],
  //   line_items: [{ price: plan.stripePriceId, quantity: 1 }],
  //   success_url: `${process.env.APP_URL}/dashboard?subscription=success`,
  //   cancel_url: `${process.env.APP_URL}/pricing`,
  //   metadata: { clerkUserId: req.clerkUserId, planId: plan.id },
  // });
  // return res.json({ url: session.url, sessionId: session.id });

  // For now, return a placeholder response
  return res.json({
    url: `/dashboard?plan=${plan.id}&demo=true`,
    sessionId: null,
  });
});

export default router;
