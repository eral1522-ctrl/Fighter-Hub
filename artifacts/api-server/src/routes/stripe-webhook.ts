import { Router } from "express";
import Stripe from "stripe";
import { db, fighterApplicationsTable, unmatchedPaymentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

// POST /api/stripe/webhook — Stripe sends payment events here.
// IMPORTANT: this route must receive the RAW request body (not JSON-parsed)
// because Stripe verifies the signature against the exact byte payload.
// It is mounted in app.ts BEFORE express.json() for that reason.
router.post("/webhook", async (req: any, res: any) => {
  if (!stripe || !webhookSecret) {
    logger.error(
      "Stripe webhook received but STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET is not configured",
    );
    return res.status(500).json({ error: "Stripe is not configured on this server" });
  }

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).json({ error: "Missing Stripe signature" });
  }

  let event: Stripe.Event;
  try {
    // req.body must be a raw Buffer here — see express.raw() in app.ts
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err: any) {
    logger.error({ err: err?.message }, "Stripe webhook signature verification failed");
    return res.status(400).json({ error: `Webhook signature verification failed` });
  }

  try {
    switch (event.type) {
      // Fired when a Stripe Checkout Session or Payment Link purchase completes.
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await markApplicationPaid({
          email: session.customer_details?.email ?? session.customer_email ?? null,
          stripeSessionId: session.id,
          amountTotal: session.amount_total ?? null,
          currency: session.currency ?? null,
        });
        break;
      }

      // Covers subscriptions whose first invoice payment succeeds
      // (useful if/when membership moves to recurring subscriptions).
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const email = invoice.customer_email ?? null;
        await markApplicationPaid({
          email,
          stripeSessionId: invoice.id ?? `invoice_${invoice.number ?? "unknown"}`,
          amountTotal: invoice.amount_paid ?? null,
          currency: invoice.currency ?? null,
        });
        break;
      }

      default:
        // Ignore all other event types — acknowledge receipt so Stripe stops retrying.
        break;
    }

    return res.json({ received: true });
  } catch (err: any) {
    logger.error({ err: err?.message, eventType: event.type }, "Failed to process Stripe webhook event");
    // Returning 500 tells Stripe to retry the event later.
    return res.status(500).json({ error: "Internal error processing webhook" });
  }
});

async function markApplicationPaid(params: {
  email: string | null;
  stripeSessionId: string;
  amountTotal: number | null;
  currency: string | null;
}) {
  const { email, stripeSessionId, amountTotal, currency } = params;

  if (!email) {
    logger.warn(
      { stripeSessionId },
      "Stripe payment completed but no email was present on the session — cannot match to a fighter application",
    );
    await recordUnmatchedPayment({ stripeSessionId, payerEmail: null, amountTotal, currency });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const [application] = await db
    .select({ id: fighterApplicationsTable.id, paymentStatus: fighterApplicationsTable.paymentStatus })
    .from(fighterApplicationsTable)
    .where(eq(fighterApplicationsTable.email, normalizedEmail))
    .limit(1);

  if (!application) {
    logger.warn(
      { email: normalizedEmail, stripeSessionId },
      "Stripe payment completed for an email with no matching fighter application — manual review needed",
    );
    await recordUnmatchedPayment({ stripeSessionId, payerEmail: normalizedEmail, amountTotal, currency });
    return;
  }

  if (application.paymentStatus === "paid") {
    logger.info({ applicationId: application.id }, "Stripe webhook: application already marked paid, skipping");
    return;
  }

  await db
    .update(fighterApplicationsTable)
    .set({ paymentStatus: "paid" })
    .where(eq(fighterApplicationsTable.id, application.id));

  logger.info(
    { applicationId: application.id, email: normalizedEmail, stripeSessionId },
    "Fighter application automatically marked as paid via Stripe webhook",
  );
}

async function recordUnmatchedPayment(params: {
  stripeSessionId: string;
  payerEmail: string | null;
  amountTotal: number | null;
  currency: string | null;
}) {
  try {
    await db.insert(unmatchedPaymentsTable).values({
      stripeSessionId: params.stripeSessionId,
      payerEmail: params.payerEmail,
      amountTotal: params.amountTotal,
      currency: params.currency,
    });
  } catch (err) {
    // Never let a logging failure mask the original webhook error.
    logger.error({ err, stripeSessionId: params.stripeSessionId }, "Failed to record unmatched payment");
  }
}

export default router;
