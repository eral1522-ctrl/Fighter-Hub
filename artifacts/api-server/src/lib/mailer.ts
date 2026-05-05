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

export async function sendApplicationConfirmation(to: string, name: string): Promise<void> {
  const transport = createTransport();
  if (!transport) {
    return;
  }

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="background:#0d0d0d;color:#f5f5f5;font-family:Arial,sans-serif;padding:40px 20px;margin:0;">
  <div style="max-width:560px;margin:0 auto;">
    <div style="font-size:28px;font-weight:900;color:#f5c518;letter-spacing:4px;text-transform:uppercase;margin-bottom:8px;">IFA</div>
    <div style="font-size:11px;color:#888;text-transform:uppercase;letter-spacing:3px;margin-bottom:32px;">International Fighters Association</div>

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

    <div style="border-top:1px solid #222;padding-top:20px;">
      <p style="color:#555;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin:0;">
        IFA – International Fighters Association · contact@ifa-fighters.org
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  await transport.sendMail({
    from: SMTP_FROM,
    to,
    subject: "IFA Application Received / Solicitud Recibida",
    html,
  });
}
