// ===== Campo de estrelas com parallax e estrelas cadentes =====
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
let W, H, stars = [], shooting = [], mouse = { x: 0, y: 0 };

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth; H = innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const n = Math.round((W * H) / 2500);
  stars = Array.from({ length: n }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    z: Math.random() * 0.9 + 0.1,               // profundidade
    r: Math.random() * 1.2 + 0.2,
    t: Math.random() * Math.PI * 2,             // fase do brilho
    hue: Math.random() < 0.15 ? (Math.random() < 0.5 ? 210 : 30) : 0,
  }));
}

function frame(time) {
  ctx.clearRect(0, 0, W, H);
  const sy = scrollY * 0.15;
  for (const s of stars) {
    const tw = reduce ? 1 : 0.6 + Math.sin(time * 0.002 * s.z + s.t) * 0.4;
    let x = s.x + mouse.x * s.z * 12;
    let y = (s.y - sy * s.z) % H; if (y < 0) y += H;
    ctx.globalAlpha = tw * s.z;
    ctx.fillStyle = s.hue ? `hsl(${s.hue} 90% 80%)` : "#fff";
    ctx.beginPath(); ctx.arc(x, y + mouse.y * s.z * 12, s.r * s.z * 1.6, 0, Math.PI * 2); ctx.fill();
  }
  // estrelas cadentes
  if (!reduce && Math.random() < 0.006) {
    shooting.push({ x: Math.random() * W, y: Math.random() * H * 0.5, vx: 8 + Math.random() * 6, vy: 3 + Math.random() * 3, life: 1 });
  }
  shooting = shooting.filter(s => s.life > 0);
  for (const s of shooting) {
    const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 10, s.y - s.vy * 10);
    g.addColorStop(0, `rgba(255,255,255,${s.life})`); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalAlpha = 1; ctx.strokeStyle = g; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10); ctx.stroke();
    s.x += s.vx; s.y += s.vy; s.life -= 0.015;
  }
  requestAnimationFrame(frame);
}
addEventListener("resize", resize);
addEventListener("pointermove", e => { mouse.x = e.clientX / W - 0.5; mouse.y = e.clientY / H - 0.5; });
resize(); requestAnimationFrame(frame);

// ===== Nav ao fazer scroll =====
const nav = document.querySelector(".nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });

// ===== Reveal + contadores =====
const fmt = { format: n => new Intl.NumberFormat(window.i18n?.lang === "en" ? "en-GB" : "pt-PT").format(n) };
addEventListener("langchange", () => document.querySelectorAll("[data-count].done").forEach(el => { el.textContent = fmt.format(+el.dataset.count); }));
function count(el) {
  const end = +el.dataset.count, dur = 1600, t0 = performance.now();
  const step = t => {
    const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt.format(Math.round(end * e));
    if (p < 1) requestAnimationFrame(step); else el.classList.add("done");
  };
  requestAnimationFrame(step);
}
const io = new IntersectionObserver(entries => {
  entries.forEach((en, i) => {
    if (!en.isIntersecting) return;
    en.target.style.transitionDelay = `${(i % 4) * 80}ms`;
    en.target.classList.add("in");
    en.target.querySelectorAll("[data-count]").forEach(count);
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ===== Brilho que segue o rato + tilt 3D nos cards =====
document.querySelectorAll(".card").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", `${x * 100}%`);
    card.style.setProperty("--my", `${y * 100}%`);
    if (!reduce) card.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 8}deg) translateY(-6px)`;
  });
  card.addEventListener("pointerleave", () => { card.style.transform = ""; });
});

document.getElementById("ano").textContent = new Date().getFullYear();

// ===== Filtros da timeline (com alternância esquerda/direita) =====
const items = [...document.querySelectorAll(".timeline li")];
function layoutTimeline() {
  items.filter(li => !li.classList.contains("hide")).forEach((li, i) => li.classList.toggle("flip", i % 2 === 1));
}
document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filters button").forEach(b => b.classList.toggle("active", b === btn));
    const f = btn.dataset.f;
    items.forEach(li => li.classList.toggle("hide", f !== "todas" && li.dataset.cat !== f));
    layoutTimeline();
  });
});
layoutTimeline();

// ===== Cartões abrem o planeta no 3D =====
document.querySelectorAll(".card[data-p]").forEach(card => {
  card.addEventListener("click", () => {
    scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    dispatchEvent(new CustomEvent("focus-planet", { detail: card.dataset.p }));
  });
});
