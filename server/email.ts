/**
 * server/email.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dual-provider transactional email:
 *   1. Mailchimp Transactional (Mandrill) — primary
 *   2. HubSpot Transactional Email API   — fallback
 *   3. Console mock                      — dev / no credentials
 *
 * Required env vars:
 *   MAILCHIMP_TRANSACTIONAL_KEY  — Mandrill API key (starts with "md-")
 *   MAILCHIMP_FROM_EMAIL         — verified sender email
 *   HUBSPOT_ACCESS_TOKEN         — HubSpot Private App token (fallback)
 *   HUBSPOT_FROM_EMAIL           — verified HubSpot sender (fallback)
 *   APP_URL                      — public URL for verify links
 */

const MANDRILL_KEY  = process.env.MAILCHIMP_TRANSACTIONAL_KEY ?? "";
const MANDRILL_FROM = process.env.MAILCHIMP_FROM_EMAIL ?? "noreply@tarifberater24.de";
const HS_TOKEN      = process.env.HUBSPOT_ACCESS_TOKEN ?? "";
const HS_FROM       = process.env.HUBSPOT_FROM_EMAIL ?? "noreply@tarifberater24.de";
const APP_URL       = process.env.APP_URL ?? "https://tarifber24-4njaedqq.manus.space";
const FROM_NAME     = "Tarifberater24";

// ─── Core send ────────────────────────────────────────────────────────────────

interface EmailPayload {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}

async function sendViaMandrill(p: EmailPayload): Promise<void> {
  const res = await fetch("https://mandrillapp.com/api/1.0/messages/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key: MANDRILL_KEY,
      message: {
        html: p.html,
        subject: p.subject,
        from_email: MANDRILL_FROM,
        from_name: FROM_NAME,
        to: [{ email: p.to, name: p.toName ?? "", type: "to" }],
        track_opens: true,
        track_clicks: true,
        tags: ["tarifberater24", "transactional"],
      },
    }),
  });
  if (!res.ok) throw new Error(`Mandrill error: ${await res.text()}`);
  const data = (await res.json()) as Array<{ status: string; reject_reason?: string }>;
  if (data[0]?.status === "rejected") {
    throw new Error(`Mandrill rejected: ${data[0].reject_reason}`);
  }
}

async function sendViaHubSpot(p: EmailPayload): Promise<void> {
  const res = await fetch("https://api.hubapi.com/marketing/v3/transactional/single-email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HS_TOKEN}`,
    },
    body: JSON.stringify({
      emailId: 0, // inline send — no template required
      message: {
        to: p.to,
        from: HS_FROM,
        subject: p.subject,
      },
      customProperties: { html_body: p.html },
      contactProperties: { firstname: p.toName ?? "" },
    }),
  });
  if (!res.ok) throw new Error(`HubSpot email error: ${await res.text()}`);
}

export async function sendEmail(p: EmailPayload): Promise<void> {
  if (MANDRILL_KEY) {
    return sendViaMandrill(p);
  }
  if (HS_TOKEN) {
    return sendViaHubSpot(p);
  }
  // Dev mock
  console.log(`[EMAIL MOCK] To: ${p.to} | Subject: ${p.subject}`);
  console.log(`[EMAIL MOCK] ${p.html.slice(0, 200)}…`);
}

// ─── Bulgarian welcome + verify template ──────────────────────────────────────

export async function sendWelcomeVerificationEmail(opts: {
  to: string;
  name: string;
  verifyToken: string;
}): Promise<void> {
  const verifyUrl = `${APP_URL}/verify-email?token=${opts.verifyToken}`;
  const firstName = opts.name.split(" ")[0] ?? opts.name;

  const html = `<!DOCTYPE html>
<html lang="bg">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0a0b1a;font-family:'Helvetica Neue',Arial,sans-serif;color:#e8eaf0;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0b1a;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#111228;border-radius:16px;border:1px solid rgba(255,255,255,0.08);max-width:560px;width:100%;">

  <!-- Header -->
  <tr><td style="padding:28px 36px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
    <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#343755;">TARIFBERATER24</p>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:32px 36px;">
    <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#fff;">Добре дошъл, ${firstName}! 👋</h1>
    <p style="margin:0 0 20px;font-size:14px;line-height:1.7;color:#9ea3b8;">
      Радваме се, че се присъедини към <strong style="color:#fff;">Tarifberater24</strong> — твоята платформа за управление на застраховки, банкиране, комунални услуги и правна помощ в Германия, на <strong style="color:#fff;">български език</strong>.
    </p>

    <!-- How it works -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.07);margin-bottom:24px;">
    <tr><td style="padding:20px;">
      <p style="margin:0 0 12px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#343755;">КАК РАБОТИ</p>
      <table>
        <tr><td style="padding:4px 0;font-size:15px;width:24px;">🔍</td><td style="padding:4px 0 4px 8px;font-size:12px;color:#9ea3b8;"><strong style="color:#fff;">Сравняваш</strong> оферти от водещи немски доставчици</td></tr>
        <tr><td style="padding:4px 0;font-size:15px;">📋</td><td style="padding:4px 0 4px 8px;font-size:12px;color:#9ea3b8;"><strong style="color:#fff;">Заявяваш</strong> безплатно с 1 клик</td></tr>
        <tr><td style="padding:4px 0;font-size:15px;">🤝</td><td style="padding:4px 0 4px 8px;font-size:12px;color:#9ea3b8;"><strong style="color:#fff;">Получаваш</strong> отговор до 24 часа</td></tr>
        <tr><td style="padding:4px 0;font-size:15px;">✅</td><td style="padding:4px 0 4px 8px;font-size:12px;color:#9ea3b8;"><strong style="color:#fff;">Спестяваш</strong> без скрити комисионни</td></tr>
      </table>
    </td></tr></table>

    <p style="margin:0 0 16px;font-size:13px;color:#9ea3b8;">За да активираш акаунта си, потвърди имейл адреса си:</p>
    <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr><td style="border-radius:10px;background:#343755;">
      <a href="${verifyUrl}" style="display:inline-block;padding:13px 28px;font-size:13px;font-weight:700;color:#fff;text-decoration:none;letter-spacing:0.03em;">
        Потвърди имейла →
      </a>
    </td></tr></table>

    <p style="margin:0;font-size:11px;color:#4b5563;">Линкът е валиден <strong style="color:#9ea3b8;">24 часа</strong>. Ако не си се регистрирал, игнорирай.</p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:16px 36px;border-top:1px solid rgba(255,255,255,0.06);">
    <p style="margin:0;font-size:10px;color:#4b5563;line-height:1.6;">
      © 2026 Tarifberater24 · Hospitalstraße 30, 66798 Wallerfangen<br/>
      <a href="${APP_URL}/privacy-settings" style="color:#343755;">Отпиши се</a>
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>`;

  await sendEmail({
    to: opts.to,
    toName: opts.name,
    subject: "Добре дошъл в Tarifberater24 — потвърди имейла си",
    html,
  });
}
