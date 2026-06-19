/* SignOff by Offhand — Cloud Function wysyłki maila przez SMTP (np. Gmail / Google Workspace).
   Dane nadawcy (adres + hasło aplikacji) przychodzą z aplikacji w polu `smtp` i są
   używane tylko do jednorazowego wysłania — funkcja ich nie zapisuje.
   Region europe-west1 (UE) — musi zgadzać się z FN_EMAIL_URL w app.js. */
const { onRequest } = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");

exports.sendEmail = onRequest(
  { region: "europe-west1", cors: true, maxInstances: 5 },
  async (req, res) => {
    if (req.method !== "POST") return res.status(405).json({ error: "Tylko POST." });
    try {
      const { to, subject, text, filename, pdfBase64, smtp } = req.body || {};
      if (!to) return res.status(400).json({ error: "Brak adresata." });
      if (!smtp || !smtp.host || !smtp.user || !smtp.pass) {
        return res.status(400).json({ error: "Brak danych nadawcy — uzupełnij w aplikacji: Ustawienia → Wysyłka e-mail." });
      }
      const port = Number(smtp.port) || 465;
      const transport = nodemailer.createTransport({
        host: smtp.host,
        port,
        secure: port === 465,
        auth: { user: smtp.user, pass: smtp.pass },
      });
      const mail = {
        from: smtp.from || smtp.user,
        to,
        subject: subject || "Kopia podpisanej zgody",
        text: text || "",
      };
      if (pdfBase64) {
        mail.attachments = [{ filename: filename || "zgoda.pdf", content: Buffer.from(pdfBase64, "base64") }];
      }
      await transport.sendMail(mail);
      return res.json({ ok: true });
    } catch (e) {
      return res.status(502).json({ error: "Poczta odrzuciła wysyłkę: " + String((e && e.message) || e) });
    }
  }
);
