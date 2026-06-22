/* Powiększanie obrazków w przewodniku — klik w obrazek otwiera go na pełnym ekranie. */
(function () {
  function open(src, alt) {
    var ov = document.createElement("div");
    ov.className = "lightbox";
    var img = document.createElement("img"); img.src = src; img.alt = alt || "";
    var btn = document.createElement("button"); btn.className = "lb-close"; btn.setAttribute("aria-label", "Zamknij"); btn.textContent = "✕";
    ov.appendChild(img); ov.appendChild(btn);
    function esc(e) { if (e.key === "Escape") { ov.remove(); document.removeEventListener("keydown", esc); } }
    ov.addEventListener("click", function () { ov.remove(); document.removeEventListener("keydown", esc); });
    document.addEventListener("keydown", esc);
    document.body.appendChild(ov);
  }
  document.querySelectorAll("figure img").forEach(function (img) {
    img.addEventListener("click", function () { open(img.currentSrc || img.src, img.alt); });
  });
})();
