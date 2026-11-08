// ===== PT / EN =====
// Qualquer elemento com data-en="..." troca o seu HTML. O resto (JS) ouve o evento "langchange".
(function () {
  const KEY = "orbita-lang";
  let stored = null;
  try { stored = localStorage.getItem(KEY); } catch {}
  let lang = stored || ((navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en");

  function apply() {
    document.documentElement.lang = lang === "en" ? "en" : "pt-PT";
    document.querySelectorAll("[data-en]").forEach(el => {
      if (el.dataset.pt === undefined) el.dataset.pt = el.innerHTML;
      el.innerHTML = lang === "en" ? el.dataset.en : el.dataset.pt;
    });
    document.querySelectorAll("[data-en-label]").forEach(el => {
      if (el.dataset.ptLabel === undefined) el.dataset.ptLabel = el.getAttribute("aria-label") || "";
      el.setAttribute("aria-label", lang === "en" ? el.dataset.enLabel : el.dataset.ptLabel);
    });
    const t = document.querySelector("title");
    if (t?.dataset.en) { t.dataset.pt ??= t.textContent; document.title = lang === "en" ? t.dataset.en : t.dataset.pt; }
    document.querySelectorAll(".lang button").forEach(b => b.setAttribute("aria-pressed", b.dataset.lang === lang));
    dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  window.i18n = {
    get lang() { return lang; },
    set(l) { lang = l; try { localStorage.setItem(KEY, l); } catch {} apply(); },
    t(o) { return o == null ? "" : typeof o === "object" ? (o[lang] ?? o.pt) : String(o); },
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => window.i18n.set(b.dataset.lang)));
    apply();
  });
})();
