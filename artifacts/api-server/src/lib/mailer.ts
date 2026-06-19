import nodemailer from "nodemailer";
import { logger } from "./logger";
import { db, emailLogTable } from "@workspace/db";

// Trim all SMTP variables to remove accidental whitespace/newlines
const SMTP_HOST = (process.env.SMTP_HOST ?? "").trim() || undefined;
const SMTP_PORT = parseInt((process.env.SMTP_PORT ?? "587").trim(), 10);
const SMTP_USER = (process.env.SMTP_USER ?? "").trim() || undefined;
const SMTP_PASS = (process.env.SMTP_PASS ?? "").trim() || undefined;
const SMTP_FROM = (process.env.SMTP_FROM ?? "").trim() || "IFA – International Fighters Association <no-reply@ifa-fighters.org>";

export type SmtpErrorType =
  | "Missing SMTP variable"
  | "Authentication failed"
  | "Connection timeout"
  | "Invalid SMTP host"
  | "Sender rejected"
  | "TLS/SSL error"
  | "Unknown SMTP error";

/** Classifies a raw nodemailer/socket error into one of the 7 known categories. */
export function classifySmtpError(err: unknown): SmtpErrorType {
  const code: string = (err as any)?.code ?? "";
  const msg: string = ((err as any)?.message ?? "").toLowerCase();

  if (code === "EAUTH" || msg.includes("535") || msg.includes("authentication") || msg.includes("invalid login") || msg.includes("username and password")) {
    return "Authentication failed";
  }
  if (code === "ETIMEDOUT" || code === "ECONNABORTED" || msg.includes("timeout") || msg.includes("timed out")) {
    return "Connection timeout";
  }
  if (code === "ECONNREFUSED" || code === "ECONNRESET" || code === "ENOTFOUND" || code === "EDNS" || msg.includes("getaddrinfo") || msg.includes("enotfound")) {
    return "Invalid SMTP host";
  }
  if (code === "EENVELOPE" || msg.includes("sender") || msg.includes("mail from") || msg.includes("from address")) {
    return "Sender rejected";
  }
  if (code.startsWith("ERR_TLS") || code.includes("SSL") || msg.includes("tls") || msg.includes("ssl") || msg.includes("certificate") || msg.includes("self-signed")) {
    return "TLS/SSL error";
  }
  return "Unknown SMTP error";
}

/** Enriched error thrown by deliver() — carries the classified error type. */
export class SmtpDeliveryError extends Error {
  errorType: SmtpErrorType;
  constructor(message: string, errorType: SmtpErrorType) {
    super(message);
    this.name = "SmtpDeliveryError";
    this.errorType = errorType;
  }
}

/** Returns config state for diagnostics — never includes the password value. */
export function getSmtpDiagnostics() {
  return {
    SMTP_HOST: SMTP_HOST || null,
    SMTP_PORT,
    SMTP_USER: SMTP_USER || null,
    SMTP_PASS: SMTP_PASS ? "****hidden****" : "NOT SET",
    SMTP_FROM,
    configured: !!(SMTP_HOST && SMTP_USER && SMTP_PASS),
  };
}

/** Strips the SMTP password from an error message so it is safe to log/return. */
function sanitizeError(err: unknown): string {
  let msg =
    err instanceof Error
      ? `${err.message}${(err as any).code ? ` [${(err as any).code}]` : ""}${(err as any).responseCode ? ` (SMTP ${(err as any).responseCode})` : ""}`
      : String(err);

  // Redact password from message in case the SMTP server echoes credentials
  if (SMTP_PASS) {
    msg = msg.replaceAll(SMTP_PASS, "****hidden****");
  }
  return msg;
}

function buildTransport(authMethod: "LOGIN" | "PLAIN") {
  const secure = SMTP_PORT === 465;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure,                        // true = implicit TLS (465), false = STARTTLS (587)
    requireTLS: SMTP_PORT === 587, // enforce STARTTLS upgrade on port 587
    authMethod,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false }, // tolerate IONOS / self-signed certs
  });
}

/**
 * Returns a verified nodemailer transporter.
 * Tries LOGIN first; falls back to PLAIN if auth fails.
 * Throws SmtpDeliveryError with the exact server message on failure.
 */
async function getVerifiedTransport(): Promise<nodemailer.Transporter> {
  const secure = SMTP_PORT === 465;

  for (const authMethod of ["LOGIN", "PLAIN"] as const) {
    const transport = buildTransport(authMethod);

    logger.info(
      {
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure,
        authMethod,
        userLength: SMTP_USER?.length ?? 0,
        passLength: SMTP_PASS?.length ?? 0,
        from: SMTP_FROM,
      },
      "Using SMTP config",
    );

    try {
      await transport.verify();
      logger.info({ authMethod }, "SMTP verify() succeeded");
      return transport;
    } catch (err) {
      const errorType = classifySmtpError(err);
      const msg = sanitizeError(err);
      logger.warn({ authMethod, errorType, err: msg }, "SMTP verify() failed");

      // Only retry on auth failure; propagate all other errors immediately
      if (errorType !== "Authentication failed") {
        throw new SmtpDeliveryError(msg, errorType);
      }
      // If this was the last method, throw
      if (authMethod === "PLAIN") {
        throw new SmtpDeliveryError(msg, "Authentication failed");
      }
      // Otherwise loop to try PLAIN
    }
  }

  // Unreachable, but satisfies TypeScript
  throw new SmtpDeliveryError("No auth method succeeded", "Authentication failed");
}

/** Verifies connection then sends. Throws SmtpDeliveryError on any failure. */
async function deliver(opts: nodemailer.SendMailOptions) {
  const transport = await getVerifiedTransport();
  try {
    await transport.sendMail(opts);
  } catch (err) {
    throw new SmtpDeliveryError(sanitizeError(err), classifySmtpError(err));
  }
}

function header() {
  return `
    <div style="font-size:28px;font-weight:900;color:#f5c518;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">IFA</div>
    <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:3px;margin-bottom:32px;">International Fighters Association</div>
  `;
}

function footer() {
  return `
    <div style="border-top:1px solid #222;padding-top:20px;margin-top:24px;">
      <p style="color:#555;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0;">
        IFA – International Fighters Association · contact@ifa-fighters.org
      </p>
    </div>
  `;
}


/** Escapes user-provided text for safe interpolation into HTML email bodies. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Best-effort: write an email delivery record to the database.
 * Never throws — failures are silently swallowed so logging never breaks email delivery.
 */
async function logEmail(opts: {
  applicationId?: number | null;
  emailType: string;
  recipientEmail: string;
  success: boolean;
  errorMessage?: string | null;
}): Promise<void> {
  try {
    await db.insert(emailLogTable).values({
      applicationId: opts.applicationId ?? null,
      emailType: opts.emailType,
      recipientEmail: opts.recipientEmail,
      success: opts.success,
      errorMessage: opts.errorMessage ?? null,
    });
  } catch {
    // Logging is best-effort — never propagate errors
  }
}

export async function sendApplicationConfirmation(details: ApplicationDetails, applicationId?: number | null): Promise<void> {
  if (!getSmtpDiagnostics().configured) {
    await logEmail({ applicationId, emailType: "confirmation", recipientEmail: details.email, success: false, errorMessage: "Skipped: SMTP not configured" });
    return;
  }

  const fieldRow = (label: string, value: string) => `
    <tr>
      <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:7px 14px 7px 0;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="color:#f5f5f5;font-size:14px;padding:7px 0;vertical-align:top;">${value}</td>
    </tr>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0d0d0d;color:#f5f5f5;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:560px;margin:0 auto;">
    ${header()}
    <div style="border-top:2px solid #f5c518;padding-top:24px;margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Application Received</h2>
      <p style="color:#ccc;line-height:1.7;margin-bottom:8px;">
        Thank you for applying to IFA – International Fighters Association, <strong style="color:#f5f5f5;">${esc(details.name)}</strong>.
      </p>
      <p style="color:#ccc;line-height:1.7;margin-bottom:20px;">
        Your application is now under review. Our team reviews all applications within <strong style="color:#f5f5f5;">5–7 business days</strong>. If selected, you will receive the next steps to activate your membership.
      </p>

      <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">What you submitted</p>
      <div style="background:#111;border:1px solid #222;border-radius:4px;padding:14px 18px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${fieldRow("Name", esc(details.name))}
          ${fieldRow("Country", esc(details.country))}
          ${fieldRow("Discipline", esc(details.discipline))}
          ${fieldRow("Weight Class", esc(details.weightClass))}
          ${fieldRow("Record", esc(details.record))}
          ${details.bio ? fieldRow("Bio", `<span style="color:#ccc;font-style:italic;">${esc(details.bio)}</span>`) : ""}
        </table>
      </div>

      <div style="border-left:3px solid #f5c518;padding-left:16px;margin-bottom:24px;">
        <p style="color:#999;font-style:italic;line-height:1.7;margin:0;">
          Gracias por aplicar a IFA – International Fighters Association.<br/>
          Tu solicitud está en revisión. Nuestro equipo revisa todas las solicitudes en un plazo de <strong style="color:#ccc;">5–7 días hábiles</strong>. Si eres seleccionado, recibirás los siguientes pasos para activar tu membresía.
        </p>
      </div>
    </div>
    ${footer()}
  </div>
</body>
</html>`.trim();

  try {
    await deliver({
      from: SMTP_FROM,
      to: details.email,
      subject: "IFA Application Received / Solicitud Recibida",
      html,
    });
    await logEmail({ applicationId, emailType: "confirmation", recipientEmail: details.email, success: true });
  } catch (err) {
    await logEmail({
      applicationId,
      emailType: "confirmation",
      recipientEmail: details.email,
      success: false,
      errorMessage: sanitizeError(err),
    });
    throw err;
  }
}

export interface ApplicationDetails {
  name: string;
  email: string;
  country: string;
  discipline: string;
  weightClass: string;
  record: string;
  bio?: string | null;
}

export async function sendAdminNewApplicationNotification(details: ApplicationDetails, applicationId?: number | null): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    await logEmail({ applicationId, emailType: "admin_notification", recipientEmail: "not configured", success: false, errorMessage: "Skipped: ADMIN_EMAIL not configured" });
    return;
  }

  if (!getSmtpDiagnostics().configured) {
    await logEmail({ applicationId, emailType: "admin_notification", recipientEmail: adminEmail, success: false, errorMessage: "Skipped: SMTP not configured" });
    return;
  }

  const fieldRow = (label: string, value: string) => `
    <tr>
      <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:8px 12px 8px 0;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="color:#f5f5f5;font-size:14px;padding:8px 0;vertical-align:top;">${value}</td>
    </tr>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0d0d0d;color:#f5f5f5;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:560px;margin:0 auto;">
    ${header()}
    <div style="border-top:2px solid #f5c518;padding-top:24px;margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">New Application Received</h2>
      <p style="color:#888;font-size:13px;margin:0 0 24px;">A fighter has just submitted an application for review.</p>
      <div style="background:#111;border:1px solid #222;border-radius:4px;padding:16px 20px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${fieldRow("Name", esc(details.name))}
          ${fieldRow("Email", `<a href="mailto:${esc(details.email)}" style="color:#f5c518;text-decoration:none;">${esc(details.email)}</a>`)}
          ${fieldRow("Country", esc(details.country))}
          ${fieldRow("Discipline", esc(details.discipline))}
          ${fieldRow("Weight Class", esc(details.weightClass))}
          ${fieldRow("Record", esc(details.record))}
          ${details.bio ? fieldRow("Bio", `<span style="color:#ccc;font-style:italic;">${esc(details.bio)}</span>`) : ""}
        </table>
      </div>
      <div style="text-align:center;">
        <a href="${esc(process.env.APP_URL || "https://ifa-fighters.org")}/admin"
           style="display:inline-block;background:#f5c518;color:#0d0d0d;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:2px;padding:14px 32px;border-radius:4px;text-decoration:none;">
          Review in Admin Panel
        </a>
      </div>
    </div>
    ${footer()}
  </div>
</body>
</html>`.trim();

  try {
    await deliver({
      from: SMTP_FROM,
      to: adminEmail,
      subject: `IFA – New Application: ${details.name}`,
      html,
    });
    await logEmail({ applicationId, emailType: "admin_notification", recipientEmail: adminEmail, success: true });
  } catch (err) {
    await logEmail({
      applicationId,
      emailType: "admin_notification",
      recipientEmail: adminEmail,
      success: false,
      errorMessage: sanitizeError(err),
    });
    throw err;
  }
}

export async function sendPaymentLink(to: string, name: string, paymentLink: string, applicationId?: number | null): Promise<void> {
  const diag = getSmtpDiagnostics();
  if (!diag.configured) {
    const errorMessage = `Missing SMTP variable: ${[
      !SMTP_HOST && "SMTP_HOST",
      !SMTP_USER && "SMTP_USER",
      !SMTP_PASS && "SMTP_PASS",
    ]
      .filter(Boolean)
      .join(", ")} not set.`;
    await logEmail({ applicationId, emailType: "payment_link", recipientEmail: to, success: false, errorMessage });
    throw new SmtpDeliveryError(errorMessage, "Missing SMTP variable");
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0d0d0d;color:#f5f5f5;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:560px;margin:0 auto;">
    ${header()}
    <div style="border-top:2px solid #f5c518;padding-top:24px;margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">IFA Membership Payment</h2>
      <p style="color:#ccc;line-height:1.7;margin-bottom:6px;">
        <strong style="color:#f5f5f5;">${name}</strong>,
      </p>
      <p style="color:#ccc;line-height:1.7;margin-bottom:24px;">
        Your IFA application has been approved. To activate your membership, please complete your €20/month payment using the link below.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${paymentLink}"
           style="display:inline-block;background:#f5c518;color:#0d0d0d;font-weight:900;font-size:16px;text-transform:uppercase;letter-spacing:2px;padding:16px 40px;border-radius:4px;text-decoration:none;">
          Complete Payment — €20/month
        </a>
      </div>
      <p style="color:#888;font-size:12px;line-height:1.6;margin-bottom:4px;text-align:center;">
        Or copy this link into your browser:
      </p>
      <p style="color:#f5c518;font-size:12px;word-break:break-all;text-align:center;margin-bottom:24px;">
        ${paymentLink}
      </p>
      <div style="border-left:3px solid #f5c518;padding-left:16px;">
        <p style="color:#999;font-style:italic;line-height:1.7;margin:0 0 6px;">
          Tu solicitud para IFA ha sido aprobada.
        </p>
        <p style="color:#999;font-style:italic;line-height:1.7;margin:0;">
          Para activar tu membresía, completa el pago de €20/mes usando el siguiente enlace:
          <br/>
          <a href="${paymentLink}" style="color:#f5c518;word-break:break-all;">${paymentLink}</a>
        </p>
      </div>
    </div>
    ${footer()}
  </div>
</body>
</html>`.trim();

  try {
    await deliver({
      from: SMTP_FROM,
      to,
      subject: "IFA Membership Payment Link / Enlace de Pago IFA",
      html,
    });
    await logEmail({ applicationId, emailType: "payment_link", recipientEmail: to, success: true });
  } catch (err) {
    await logEmail({
      applicationId,
      emailType: "payment_link",
      recipientEmail: to,
      success: false,
      errorMessage: sanitizeError(err),
    });
    throw err;
  }
}

export async function sendApplicationApproved(name: string, email: string, applicationId?: number | null): Promise<void> {
  if (!getSmtpDiagnostics().configured) {
    await logEmail({ applicationId, emailType: "approval", recipientEmail: email, success: false, errorMessage: "Skipped: SMTP not configured" });
    return;
  }

  const loginUrl = esc(`${process.env.APP_URL || "https://ifa-fighters.org"}/sign-in`);

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0d0d0d;color:#f5f5f5;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:560px;margin:0 auto;">
    ${header()}
    <div style="border-top:2px solid #f5c518;padding-top:24px;margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Application Approved</h2>
      <p style="color:#ccc;line-height:1.7;margin-bottom:8px;">
        Congratulations, <strong style="color:#f5f5f5;">${esc(name)}</strong>!
      </p>
      <p style="color:#ccc;line-height:1.7;margin-bottom:24px;">
        Your IFA application has been <strong style="color:#f5c518;">approved</strong>. You now have access to fight opportunities, sponsors, events, and global boxing campaigns. Log in to your account to get started.
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${loginUrl}"
           style="display:inline-block;background:#f5c518;color:#0d0d0d;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:2px;padding:14px 32px;border-radius:4px;text-decoration:none;">
          Log In to Your Account
        </a>
      </div>
      <div style="border-left:3px solid #f5c518;padding-left:16px;margin-top:8px;">
        <p style="color:#999;font-style:italic;line-height:1.7;margin:0;">
          ¡Felicidades, <strong style="color:#ccc;">${esc(name)}</strong>! Tu solicitud ha sido <strong style="color:#f5c518;">aprobada</strong>. Inicia sesión para acceder a peleas, patrocinadores, eventos y campañas internacionales de boxeo.
        </p>
      </div>
    </div>
    ${footer()}
  </div>
</body>
</html>`.trim();

  try {
    await deliver({
      from: SMTP_FROM,
      to: email,
      subject: "IFA Application Approved / Solicitud Aprobada",
      html,
    });
    await logEmail({ applicationId, emailType: "approval", recipientEmail: email, success: true });
  } catch (err) {
    await logEmail({
      applicationId,
      emailType: "approval",
      recipientEmail: email,
      success: false,
      errorMessage: sanitizeError(err),
    });
    throw err;
  }
}

export async function sendApplicationRejected(name: string, email: string, applicationId?: number | null): Promise<void> {
  if (!getSmtpDiagnostics().configured) {
    await logEmail({ applicationId, emailType: "rejection", recipientEmail: email, success: false, errorMessage: "Skipped: SMTP not configured" });
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0d0d0d;color:#f5f5f5;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:560px;margin:0 auto;">
    ${header()}
    <div style="border-top:2px solid #f5c518;padding-top:24px;margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Application Update</h2>
      <p style="color:#ccc;line-height:1.7;margin-bottom:8px;">
        Dear <strong style="color:#f5f5f5;">${esc(name)}</strong>,
      </p>
      <p style="color:#ccc;line-height:1.7;margin-bottom:16px;">
        Thank you for your interest in IFA – International Fighters Association. After careful review, we are unable to approve your application at this time.
      </p>
      <p style="color:#ccc;line-height:1.7;margin-bottom:24px;">
        We encourage you to continue training and to reapply in the future. If you have any questions or would like feedback, please contact us at <a href="mailto:contact@ifa-fighters.org" style="color:#f5c518;text-decoration:none;">contact@ifa-fighters.org</a>.
      </p>
      <div style="border-left:3px solid #f5c518;padding-left:16px;margin-top:8px;">
        <p style="color:#999;font-style:italic;line-height:1.7;margin:0;">
          Estimado/a <strong style="color:#ccc;">${esc(name)}</strong>, tras una revisión cuidadosa, no hemos podido aprobar tu solicitud en este momento. Te animamos a seguir entrenando y a volver a solicitar en el futuro. Para preguntas, escríbenos a <a href="mailto:contact@ifa-fighters.org" style="color:#f5c518;text-decoration:none;">contact@ifa-fighters.org</a>.
        </p>
      </div>
    </div>
    ${footer()}
  </div>
</body>
</html>`.trim();

  try {
    await deliver({
      from: SMTP_FROM,
      to: email,
      subject: "IFA Application Update / Actualización de Solicitud",
      html,
    });
    await logEmail({ applicationId, emailType: "rejection", recipientEmail: email, success: true });
  } catch (err) {
    await logEmail({
      applicationId,
      emailType: "rejection",
      recipientEmail: email,
      success: false,
      errorMessage: sanitizeError(err),
    });
    throw err;
  }
}

export async function sendContactMessage(details: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  if (!getSmtpDiagnostics().configured) {
    await logEmail({ emailType: "contact_form", recipientEmail: details.email, success: false, errorMessage: "Skipped: SMTP not configured" });
    throw new SmtpDeliveryError("SMTP is not configured on this server", "Missing SMTP variable");
  }

  const recipient = (process.env.CONTACT_FORM_RECIPIENT ?? "info@fightersassociation.com").trim();

  const fieldRow = (label: string, value: string) => `
    <tr>
      <td style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:7px 14px 7px 0;white-space:nowrap;vertical-align:top;">${label}</td>
      <td style="color:#f5f5f5;font-size:14px;padding:7px 0;vertical-align:top;">${value}</td>
    </tr>`;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0d0d0d;color:#f5f5f5;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:560px;margin:0 auto;">
    ${header()}
    <div style="border-top:2px solid #f5c518;padding-top:24px;margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">New Contact Form Message</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${fieldRow("Name", esc(details.name))}
        ${fieldRow("Email", `<a href="mailto:${esc(details.email)}" style="color:#f5c518;text-decoration:none;">${esc(details.email)}</a>`)}
        ${fieldRow("Subject", esc(details.subject))}
      </table>
      <div style="background:#111;border:1px solid #333;border-radius:4px;padding:16px;">
        <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 10px;">Message</p>
        <p style="color:#f5f5f5;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${esc(details.message)}</p>
      </div>
      <p style="color:#666;font-size:12px;margin-top:20px;">
        Reply directly to this email to respond to ${esc(details.name)}.
      </p>
    </div>
    ${footer()}
  </div>
</body>
</html>`.trim();

  try {
    await deliver({
      from: SMTP_FROM,
      to: recipient,
      replyTo: details.email,
      subject: `[IFA Contact] ${details.subject} — ${details.name}`,
      html,
    });
    await logEmail({ emailType: "contact_form", recipientEmail: recipient, success: true });
  } catch (err) {
    await logEmail({
      emailType: "contact_form",
      recipientEmail: recipient,
      success: false,
      errorMessage: sanitizeError(err),
    });
    throw err;
  }
}

export async function sendTestEmail(to: string): Promise<void> {
  const diag = getSmtpDiagnostics();
  if (!diag.configured) {
    throw new SmtpDeliveryError(
      `Missing SMTP variable: ${[
        !SMTP_HOST && "SMTP_HOST",
        !SMTP_USER && "SMTP_USER",
        !SMTP_PASS && "SMTP_PASS",
      ]
        .filter(Boolean)
        .join(", ")} not set.`,
      "Missing SMTP variable",
    );
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0d0d0d;color:#f5f5f5;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:560px;margin:0 auto;">
    ${header()}
    <div style="border-top:2px solid #f5c518;padding-top:24px;margin-bottom:24px;">
      <h2 style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 16px;">Email Test — IFA Admin</h2>
      <p style="color:#ccc;line-height:1.7;margin-bottom:8px;">
        This is a test email from the IFA admin panel. If you received this, your SMTP configuration is working correctly.
      </p>
      <div style="background:#111;border:1px solid #333;border-radius:4px;padding:16px;margin-top:16px;">
        <p style="color:#888;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Config used</p>
        <p style="color:#f5c518;font-size:12px;font-family:monospace;margin:0;">
          Host: ${SMTP_HOST}<br/>
          Port: ${SMTP_PORT}<br/>
          User: ${SMTP_USER}<br/>
          From: ${SMTP_FROM}
        </p>
      </div>
    </div>
    ${footer()}
  </div>
</body>
</html>`.trim();

  await deliver({
    from: SMTP_FROM,
    to,
    subject: "IFA Admin — Email Test",
    html,
  });
}
