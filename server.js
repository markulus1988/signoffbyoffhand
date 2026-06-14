/* SignOff by Offhand — serwer: statyczne pliki aplikacji + API kopii w chmurze.
   API przyjmuje WYŁĄCZNIE zaszyfrowane bloby (E2E, AES-256-GCM po stronie klienta) —
   serwer nigdy nie widzi danych osobowych w postaci jawnej (privacy by design, art. 25 RODO). */
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const DATA = path.join(ROOT, "cloud-data");
const PORT = process.env.PORT || 4290;
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA);

/* Klucz dostępu do API — generowany przy pierwszym starcie, do wpisania w aplikacji (Ustawienia → Chmura) */
const keyFile = path.join(DATA, "sync-key.txt");
if (!fs.existsSync(keyFile)) fs.writeFileSync(keyFile, crypto.randomBytes(12).toString("hex"));
const SYNC_KEY = (process.env.SYNC_KEY || fs.readFileSync(keyFile, "utf8")).trim();

const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".ttf": "font/ttf", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json", ".ico": "image/x-icon" };
const MAX_BODY = 100 * 1024 * 1024; // 100 MB
const safeId = (s) => /^[a-zA-Z0-9-]{1,64}$/.test(s || "");

/* Konfiguracja SMTP — najpierw ze zmiennych środowiskowych (działa na darmowym hostingu,
   przetrwa restart), w ostateczności z pliku cloud-data/smtp.json (tryb lokalny). */
function smtpConfig() {
  if (process.env.SMTP_HOST) {
    return {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
    };
  }
  const smtpFile = path.join(DATA, "smtp.json");
  if (fs.existsSync(smtpFile)) return JSON.parse(fs.readFileSync(smtpFile, "utf8"));
  return null;
}

function api(req, res, url) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Sync-Key");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
  const json = (code, obj) => { res.writeHead(code, { "Content-Type": "application/json" }); res.end(JSON.stringify(obj)); };

  if ((req.headers["x-sync-key"] || "") !== SYNC_KEY) return json(401, { error: "Nieprawidłowy klucz synchronizacji." });

  if (req.method === "POST" && url.pathname === "/api/sync") {
    let body = "", size = 0;
    req.on("data", (c) => { size += c.length; if (size > MAX_BODY) { req.destroy(); return; } body += c; });
    req.on("end", () => {
      try {
        const { deviceId, deviceName, payload } = JSON.parse(body);
        if (!safeId(deviceId) || !payload) return json(400, { error: "Brak deviceId/payload." });
        const rec = { deviceId, deviceName: String(deviceName || "").slice(0, 80), updatedAt: new Date().toISOString(), payload };
        const file = path.join(DATA, `dev-${deviceId}.json`);
        // kopia historyczna (ostatnie 10 wersji) — ochrona przed nadpisaniem złą wersją
        if (fs.existsSync(file)) {
          fs.copyFileSync(file, path.join(DATA, `dev-${deviceId}.${Date.now()}.bak.json`));
          const baks = fs.readdirSync(DATA).filter(f => f.startsWith(`dev-${deviceId}.`) && f.endsWith(".bak.json")).sort();
          while (baks.length > 10) fs.unlinkSync(path.join(DATA, baks.shift()));
        }
        fs.writeFileSync(file, JSON.stringify(rec));
        json(200, { ok: true, updatedAt: rec.updatedAt });
      } catch (e) { json(400, { error: "Błędne dane: " + e.message }); }
    });
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/email") {
    let body = "", size = 0;
    req.on("data", (c) => { size += c.length; if (size > MAX_BODY) { req.destroy(); return; } body += c; });
    req.on("end", () => {
      try {
        const { to, subject, text, filename, pdfBase64, smtp } = JSON.parse(body);
        if (!to) return json(400, { error: "Brak adresata." });
        // dane nadawcy: najpierw z aplikacji (wpisane przez administratora), w ostateczności z serwera
        const cfg = (smtp && smtp.host && smtp.user && smtp.pass) ? smtp : smtpConfig();
        if (!cfg) return json(501, { error: "Brak konfiguracji nadawcy — uzupełnij e-mail i hasło w aplikacji (Ustawienia → Wysyłka e-mail)." });
        let nodemailer;
        try { nodemailer = require("nodemailer"); } catch { return json(501, { error: "Brak modułu nodemailer — uruchom: npm install" }); }
        const port = Number(cfg.port) || 465;
        const tr = nodemailer.createTransport({ host: cfg.host, port, secure: port === 465, auth: { user: cfg.user, pass: cfg.pass } });
        const mail = { from: cfg.from || cfg.user, to, subject: subject || "Kopia podpisanej zgody", text: text || "" };
        if (pdfBase64) mail.attachments = [{ filename: filename || "zgoda.pdf", content: Buffer.from(pdfBase64, "base64") }];
        tr.sendMail(mail).then(() => json(200, { ok: true })).catch(e => json(500, { error: "Poczta odrzuciła wysyłkę: " + e.message }));
      } catch (e) { json(400, { error: "Błędne dane: " + e.message }); }
    });
    return;
  }
  if (req.method === "GET" && url.pathname === "/api/devices") {
    const list = fs.readdirSync(DATA).filter(f => /^dev-[a-zA-Z0-9-]+\.json$/.test(f)).map(f => {
      const d = JSON.parse(fs.readFileSync(path.join(DATA, f), "utf8"));
      return { deviceId: d.deviceId, deviceName: d.deviceName, updatedAt: d.updatedAt };
    });
    return json(200, { devices: list });
  }
  if (req.method === "GET" && url.pathname === "/api/sync") {
    const id = url.searchParams.get("device");
    if (!safeId(id)) return json(400, { error: "Błędny identyfikator." });
    const file = path.join(DATA, `dev-${id}.json`);
    if (!fs.existsSync(file)) return json(404, { error: "Brak kopii dla tego urządzenia." });
    res.writeHead(200, { "Content-Type": "application/json" });
    return fs.createReadStream(file).pipe(res);
  }
  json(404, { error: "Nieznany endpoint." });
}

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname.startsWith("/api/")) return api(req, res, url);
  let p = decodeURIComponent(url.pathname);
  if (p === "/") p = "/index.html";
  const file = path.join(ROOT, path.normalize(p));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end("404"); return;
  }
  res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`SignOff by Offhand: http://localhost:${PORT}`);
  console.log(`Klucz synchronizacji (Ustawienia -> Chmura): ${SYNC_KEY}`);
});
