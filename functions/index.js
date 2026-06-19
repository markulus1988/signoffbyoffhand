/* SignOff by Offhand — Cloud Function wysyłki maila (Resend).
   Klucz API Resend trzymany jako sekret Firebase (RESEND_KEY) — nigdy nie trafia
   do przeglądarki. Adres nadawcy w sekrecie MAIL_FROM (np. "SignOff <zgody@twojadomena.pl>").
   Przeglądarka wysyła tylko: to, subject, text, filename, pdfBase64.
   Region europe-west1 (UE, RODO) — musi zgadzać się z FN_EMAIL_URL w app.js. */
const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const RESEND_KEY = defineSecret("RESEND_KEY");
const MAIL_FROM = defineSecret("MAIL_FROM");

exports.sendEmail = onRequest(
  { region: "europe-west1", secrets: [RESEND_KEY, MAIL_FROM], cors: true, maxInstances: 5 },
  async (req, res) => {
    if (req.method !== "POST") return res.status(405).json({ error: "Tylko POST." });
    try {
      const { to, subject, text, filename, pdfBase64 } = req.body || {};
      if (!to || !pdfBase64) return res.status(400).json({ error: "Brak adresata lub pliku." });

      const from = (MAIL_FROM.value() || "").trim() || "SignOff <onboarding@resend.dev>";
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + RESEND_KEY.value(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          subject: subject || "Kopia podpisanej zgody",
          text: text || "",
          attachments: [{ filename: filename || "zgoda.pdf", content: pdfBase64 }],
        }),
      });
      const out = await r.json().catch(() => ({}));
      if (!r.ok) return res.status(502).json({ error: (out && out.message) || ("Resend " + r.status) });
      return res.json({ ok: true, id: out.id });
    } catch (e) {
      return res.status(500).json({ error: String((e && e.message) || e) });
    }
  }
);
