import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || "IFA – International Fighters Association <no-reply@ifa-fighters.org>";

function createTransport() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
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

export async function sendApplicationConfirmation(to: string, name: string): Promise<void> {
  const transport = createTransport();
  if (!transport) return;

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
        Thank you for applying to IFA – International Fighters Association, <strong style="color:#f5f5f5;">${name}</strong>.
      </p>
      <p style="color:#ccc;line-height:1.7;margin-bottom:24px;">
        Your profile is under review. If selected, you will receive the next steps to activate your membership.
      </p>
      <div style="border-left:3px solid #f5c518;padding-left:16px;margin-bottom:24px;">
        <p style="color:#999;font-style:italic;line-height:1.7;margin:0;">
          Gracias por aplicar a IFA – International Fighters Association.<br/>
          Tu perfil está en revisión. Si eres seleccionado, recibirás los siguientes pasos para activar tu membresía.
        </p>
      </div>
    </div>
    ${footer()}
  </div>
</body>
</html>`.trim();

  await transport.sendMail({
    from: SMTP_FROM,
    to,
    subject: "IFA Application Received / Solicitud Recibida",
    html,
  });
}

export async function sendPaymentLink(to: string, name: string, paymentLink: string): Promise<void> {
  const transport = createTransport();
  if (!transport) {
    throw new Error("SMTP not configured. Add SMTP_HOST, SMTP_USER and SMTP_PASS environment variables.");
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

  await transport.sendMail({
    from: SMTP_FROM,
    to,
    subject: "IFA Membership Payment Link / Enlace de Pago IFA",
    html,
  });
}
