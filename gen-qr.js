const QRCode = require("qrcode");
const URL = "https://signoffbyoffhand.github.io/";
const opt = { errorCorrectionLevel: "M", margin: 1, color: { dark: "#0f1b2d", light: "#ffffff" } };
(async () => {
  const svg = await QRCode.toString(URL, { ...opt, type: "svg" });
  require("fs").writeFileSync("qr-signoff.svg", svg);
  await QRCode.toFile("qr-signoff.png", URL, { ...opt, width: 512 });
  await QRCode.toFile("qr-signoff-druk.png", URL, { ...opt, width: 1024, margin: 2 });
  await QRCode.toFile("docs/img/qr.png", URL, { ...opt, width: 512 });
  console.log("QR wygenerowane dla", URL);
})().catch(e => { console.error(e); process.exit(1); });
