// ===== Núcleo partilhado: Sistema Solar 3D com luas (usado no início e na página da Via Láctea) =====
import * as THREE from "three";

export const T = o => (window.i18n ? window.i18n.t(o) : typeof o === "object" ? o.pt : String(o));
const isEN = () => window.i18n?.lang === "en";
const nf = (n, dec = 0) => new Intl.NumberFormat(isEN() ? "en-GB" : "pt-PT", { maximumFractionDigits: dec, minimumFractionDigits: dec }).format(n);

// ---------- dados ----------
const ROCK_GREY = ["#9a9a9a", "#c8c8c8", "#6e6e6e", "#b0b0b0"];
const ICY = ["#d6d2ca", "#b3aea6", "#ece8e0", "#9e998f"];

export const PLANETS = [
  { id: "mercurio", name: { pt: "Mercúrio", en: "Mercury" }, of: { pt: "de Mercúrio", en: "Mercury" },
    type: { pt: "Planeta rochoso", en: "Rocky planet" }, r: .45, d: 7, per: .24, rot: .2, tilt: .03, cor: "#c9c3bb",
    au: .39, days: 88, moonCount: "0", diam: 4879,
    fact: { pt: "O mais pequeno e o mais rápido. Sem atmosfera a sério, vai de 430 °C de dia a −180 °C à noite.",
            en: "The smallest and fastest planet. With almost no atmosphere it swings from 430 °C by day to −180 °C at night." },
    tex: { kind: "rock", c: ["#8c8580", "#b5aea6", "#5e5751", "#a39b92"] } },
  { id: "venus", name: { pt: "Vénus", en: "Venus" }, of: { pt: "de Vénus", en: "Venus" },
    type: { pt: "Planeta rochoso", en: "Rocky planet" }, r: .95, d: 9.5, per: .62, rot: -.05, tilt: 3.09, cor: "#ffd58a",
    au: .72, days: 225, moonCount: "0", diam: 12104,
    fact: { pt: "O planeta mais quente (465 °C) por causa de um efeito de estufa descontrolado. Roda ao contrário.",
            en: "The hottest planet (465 °C) thanks to a runaway greenhouse effect. It also spins backwards." },
    tex: { kind: "gas", bands: 5, c: ["#e8c27a", "#f5dca5", "#c99a52", "#f0d08e"] } },
  { id: "terra", name: { pt: "Terra", en: "Earth" }, of: { pt: "da Terra", en: "Earth" },
    type: { pt: "Planeta rochoso", en: "Rocky planet" }, r: 1, d: 12.5, per: 1, rot: 1, tilt: .41, cor: "#6fc3ff",
    au: 1, days: 365, moonCount: "1", diam: 12742,
    fact: { pt: "O único sítio conhecido com oceanos líquidos à superfície — e com vida. Estás aqui.",
            en: "The only known place with liquid oceans on the surface — and life. You are here." },
    tex: { kind: "earth" }, moonBase: 2.2, moonGap: .5,
    moons: [{ id: "lua", name: { pt: "Lua", en: "Moon" }, diam: 3474, per: 27.3, disc: { pt: "Pré-história", en: "Prehistory" },
      fact: { pt: "Afasta-se da Terra 3,8 cm por ano.", en: "It drifts 3.8 cm farther from Earth every year." }, c: ROCK_GREY }] },
  { id: "marte", name: { pt: "Marte", en: "Mars" }, of: { pt: "de Marte", en: "Mars" },
    type: { pt: "Planeta rochoso", en: "Rocky planet" }, r: .6, d: 15.5, per: 1.88, rot: .97, tilt: .44, cor: "#ff8a5c",
    au: 1.52, days: 687, moonCount: "2", diam: 6779,
    fact: { pt: "Tem o Monte Olimpo, o maior vulcão do Sistema Solar: ~22 km de altura.",
            en: "Home to Olympus Mons, the largest volcano in the Solar System: about 22 km high." },
    tex: { kind: "rock", c: ["#b5532e", "#d9774a", "#8c3a1d", "#c96a3f"], caps: true }, moonBase: 1.9, moonGap: .45,
    moons: [
      { id: "fobos", name: { pt: "Fobos", en: "Phobos" }, diam: 22, per: .32, disc: 1877, c: ["#6b5e52", "#8a7b6c", "#4e443b"],
        fact: { pt: "Está a cair lentamente para Marte; daqui a ~50 milhões de anos desfaz-se num anel.", en: "It is slowly spiralling into Mars; in ~50 million years it will break into a ring." } },
      { id: "deimos", name: { pt: "Deimos", en: "Deimos" }, diam: 12, per: 1.26, disc: 1877, c: ["#8a7d70", "#a39584", "#6b5f53"],
        fact: { pt: "Tão pequena que, vista de Marte, parece só uma estrela brilhante.", en: "So small that, from Mars, it looks like just a bright star." } }] },
  { id: "jupiter", name: { pt: "Júpiter", en: "Jupiter" }, of: { pt: "de Júpiter", en: "Jupiter" },
    type: { pt: "Gigante gasoso", en: "Gas giant" }, r: 2.6, d: 28, per: 11.86, rot: 2.4, tilt: .05, cor: "#f2d2a9",
    au: 5.2, days: 4333, moonCount: "95+", diam: 139820,
    fact: { pt: "Cabem lá dentro 1 300 Terras. A Grande Mancha Vermelha é uma tempestade maior que o nosso planeta.",
            en: "You could fit 1,300 Earths inside. The Great Red Spot is a storm bigger than our whole planet." },
    tex: { kind: "gas", bands: 26, c: ["#e9d3b4", "#b07a4c", "#f4e6cf", "#c98f5e", "#8c5a3a"], spot: "#c2502e" }, moonBase: 1.8, moonGap: .9,
    moons: [
      { id: "io", name: { pt: "Io", en: "Io" }, diam: 3643, per: 1.77, disc: 1610, c: ["#e8d36a", "#f2e6a0", "#c98a2a", "#a35a1a"],
        fact: { pt: "O sítio com mais vulcões ativos do Sistema Solar.", en: "The most volcanically active place in the Solar System." } },
      { id: "europa", name: { pt: "Europa", en: "Europa" }, diam: 3122, per: 3.55, disc: 1610, c: ["#e9e0cf", "#c9b08a", "#f5efe2", "#a8875a"],
        fact: { pt: "Esconde um oceano salgado debaixo do gelo — um dos melhores sítios para procurar vida.", en: "Hides a salty ocean beneath its ice — one of the best places to look for life." } },
      { id: "ganimedes", name: { pt: "Ganimedes", en: "Ganymede" }, diam: 5268, per: 7.15, disc: 1610, c: ["#9a8f80", "#c8bfae", "#6e6458"],
        fact: { pt: "A maior lua do Sistema Solar: maior que Mercúrio e com campo magnético próprio.", en: "The largest moon in the Solar System: bigger than Mercury, with its own magnetic field." } },
      { id: "calisto", name: { pt: "Calisto", en: "Callisto" }, diam: 4821, per: 16.7, disc: 1610, c: ["#5e564c", "#8a8070", "#3e3830"],
        fact: { pt: "A superfície com mais crateras que se conhece.", en: "The most heavily cratered surface known." } }] },
  { id: "saturno", name: { pt: "Saturno", en: "Saturn" }, of: { pt: "de Saturno", en: "Saturn" },
    type: { pt: "Gigante gasoso", en: "Gas giant" }, r: 2.2, d: 42, per: 29.4, rot: 2.2, tilt: .47, cor: "#f6e2b0", rings: true,
    au: 9.5, days: 10759, moonCount: "274", diam: 116460,
    fact: { pt: "É menos denso que a água. Os anéis têm 280 000 km de largura mas só ~10 m de espessura.",
            en: "Less dense than water. Its rings are 280,000 km wide but only about 10 m thick." },
    tex: { kind: "gas", bands: 14, c: ["#f3e3bd", "#d8bd87", "#c4a46a", "#efd9a8"] }, moonBase: 2.7, moonGap: .55,
    moons: [
      { id: "mimas", name: { pt: "Mimas", en: "Mimas" }, diam: 396, per: .94, disc: 1789, c: ICY,
        fact: { pt: "A cratera Herschel, enorme, dá-lhe um ar de Estrela da Morte.", en: "The huge Herschel crater makes it look like the Death Star." } },
      { id: "encelado", name: { pt: "Encélado", en: "Enceladus" }, diam: 504, per: 1.37, disc: 1789, c: ["#f4f8ff", "#dfe8f5", "#ffffff"],
        fact: { pt: "Dispara jatos de água para o espaço a partir do polo sul.", en: "Shoots jets of water into space from its south pole." } },
      { id: "tetis", name: { pt: "Tétis", en: "Tethys" }, diam: 1062, per: 1.89, disc: 1684, c: ICY,
        fact: { pt: "Tem um desfiladeiro, Ithaca Chasma, com 2 000 km de comprimento.", en: "Has a canyon, Ithaca Chasma, 2,000 km long." } },
      { id: "dione", name: { pt: "Dione", en: "Dione" }, diam: 1123, per: 2.74, disc: 1684, c: ICY,
        fact: { pt: "Partilha a órbita com duas pequenas luas troianas.", en: "Shares its orbit with two tiny trojan moons." } },
      { id: "reia", name: { pt: "Reia", en: "Rhea" }, diam: 1527, per: 4.52, disc: 1672, c: ICY,
        fact: { pt: "A segunda maior lua de Saturno, feita quase só de gelo.", en: "Saturn's second-largest moon, made almost entirely of ice." } },
      { id: "tita", name: { pt: "Titã", en: "Titan" }, diam: 5150, per: 15.9, disc: 1655, kind: "gas", bands: 3, c: ["#e0a34a", "#d08a35", "#e8b866"],
        fact: { pt: "Atmosfera espessa e lagos de metano. A sonda Huygens aterrou lá em 2005.", en: "Thick atmosphere and methane lakes. The Huygens probe landed there in 2005." } },
      { id: "japeto", name: { pt: "Jápeto", en: "Iapetus" }, diam: 1469, per: 79.3, disc: 1671, c: ["#e6e2da", "#3a3530", "#c9c4bb"],
        fact: { pt: "Um lado é escuro como carvão, o outro branco como neve.", en: "One side is dark as coal, the other white as snow." } }] },
  { id: "urano", name: { pt: "Úrano", en: "Uranus" }, of: { pt: "de Úrano", en: "Uranus" },
    type: { pt: "Gigante de gelo", en: "Ice giant" }, r: 1.5, d: 54, per: 84, rot: -1.4, tilt: 1.71, cor: "#b6f3f5",
    au: 19.2, days: 30687, moonCount: "29", diam: 50724,
    fact: { pt: "Gira deitado de lado (98°): cada polo tem 42 anos de dia e 42 de noite.",
            en: "It spins on its side (98°): each pole gets 42 years of daylight, then 42 of night." },
    tex: { kind: "gas", bands: 4, c: ["#a8e6ec", "#c4f1f4", "#8fd3dc"] }, moonBase: 1.9, moonGap: .45,
    moons: [
      { id: "miranda", name: { pt: "Miranda", en: "Miranda" }, diam: 472, per: 1.41, disc: 1948, c: ICY,
        fact: { pt: "Tem Verona Rupes, uma falésia de ~20 km — das mais altas do Sistema Solar.", en: "Home to Verona Rupes, a ~20 km cliff — one of the tallest in the Solar System." } },
      { id: "ariel", name: { pt: "Ariel", en: "Ariel" }, diam: 1158, per: 2.52, disc: 1851, c: ICY,
        fact: { pt: "A superfície mais jovem e brilhante das luas de Úrano.", en: "The youngest, brightest surface among Uranus's moons." } },
      { id: "umbriel", name: { pt: "Umbriel", en: "Umbriel" }, diam: 1169, per: 4.14, disc: 1851, c: ["#5a5652", "#76716b", "#45413d"],
        fact: { pt: "A mais escura das grandes luas de Úrano.", en: "The darkest of Uranus's large moons." } },
      { id: "titania", name: { pt: "Titânia", en: "Titania" }, diam: 1577, per: 8.71, disc: 1787, c: ICY,
        fact: { pt: "A maior lua de Úrano.", en: "Uranus's largest moon." } },
      { id: "oberon", name: { pt: "Oberon", en: "Oberon" }, diam: 1523, per: 13.5, disc: 1787, c: ["#a39a90", "#c4bbb0", "#7d756c"],
        fact: { pt: "A mais exterior das grandes luas de Úrano, cheia de crateras antigas.", en: "The outermost of Uranus's large moons, covered in ancient craters." } }] },
  { id: "neptuno", name: { pt: "Neptuno", en: "Neptune" }, of: { pt: "de Neptuno", en: "Neptune" },
    type: { pt: "Gigante de gelo", en: "Ice giant" }, r: 1.45, d: 64, per: 164.8, rot: 1.5, tilt: .49, cor: "#7aa2ff",
    au: 30.1, days: 60190, moonCount: "16", diam: 49244,
    fact: { pt: "Ventos de 2 000 km/h, os mais rápidos do Sistema Solar. Só completou uma órbita desde que foi descoberto.",
            en: "Winds of 2,000 km/h, the fastest in the Solar System. It has completed just one orbit since it was discovered." },
    tex: { kind: "gas", bands: 8, c: ["#3b5fd9", "#5a7ff0", "#2a44a8", "#4c6fe0"], spot: "#1c2a6b" }, moonBase: 2.2, moonGap: .5,
    moons: [{ id: "tritao", name: { pt: "Tritão", en: "Triton" }, diam: 2707, per: 5.88, retro: true, disc: 1846, c: ["#e6d2c8", "#c7a9a0", "#f2e8e2"],
      fact: { pt: "Orbita ao contrário — provavelmente um objeto da Cintura de Kuiper capturado.", en: "It orbits backwards — probably a captured Kuiper Belt object." } }] },
  { id: "plutao", name: { pt: "Plutão", en: "Pluto" }, of: { pt: "de Plutão", en: "Pluto" },
    type: { pt: "Planeta anão", en: "Dwarf planet" }, r: .3, d: 74, per: 248, rot: -.16, tilt: 2.1, incl: .3, cor: "#d9c2a0",
    au: 39.5, days: 90560, moonCount: "5", diam: 2377,
    fact: { pt: "Despromovido a planeta anão em 2006. Tem um glaciar gigante em forma de coração.",
            en: "Demoted to dwarf planet in 2006. It has a giant heart-shaped glacier." },
    tex: { kind: "rock", c: ["#d9c2a0", "#b98c5a", "#f2e4cc", "#8a5a3a"] }, moonBase: 2.6, moonGap: .4,
    moons: [{ id: "caronte", name: { pt: "Caronte", en: "Charon" }, diam: 1212, per: 6.39, disc: 1978, r: .15, c: ["#9a948e", "#bdb6ae", "#6d6761"],
      fact: { pt: "Tão grande face a Plutão que os dois giram à volta de um ponto entre eles.", en: "So big compared to Pluto that the two circle a point between them." } }] },
];

export const SUN = { id: "sol", name: { pt: "Sol", en: "Sun" }, cor: "#ffb347", r: 3.6, tex: { kind: "sun" },
  glow: ["rgba(255,240,200,1)", "rgba(255,170,60,.6)", "rgba(255,180,90,.6)", "rgba(255,110,40,.15)"], light: 0xfff1d6 };
export const SOLAR = { id: "solar", star: SUN, planets: PLANETS, belts: [[19, 23.5, 0xb9a88f]] };

// ---------- ficha (tipo, nome, facto, números) ----------
export function describe(b) {
  if (!b) return null;
  if (b.parent) {
    const p = b.parent;
    return {
      type: { pt: `Lua ${p.of.pt}`, en: `Moon of ${p.of.en}` }, name: b.name, fact: b.fact, cor: p.cor,
      stats: [
        [{ pt: "Diâmetro", en: "Diameter" }, `${nf(b.diam)} km`],
        [{ pt: "Volta completa em", en: "One orbit takes" }, b.per < 1 ? `${nf(b.per * 24)} h` : `${nf(b.per, 1)} ${isEN() ? "days" : "dias"}`],
        [{ pt: "Orbita", en: "Orbits" }, T(p.name)],
        [{ pt: "Descoberta", en: "Discovered" }, T(b.disc)],
      ],
    };
  }
  if (b.exo) {
    const e = b.exo, EN = isEN();
    return {
      type: b.type, name: b.name, fact: b.fact, cor: b.cor,
      stats: [
        [{ pt: "Volta completa em", en: "One orbit takes" }, e.per < 1 ? `${nf(e.per * 24)} h` : e.per < 1000 ? `${nf(e.per, e.per < 20 ? 1 : 0)} ${EN ? "days" : "dias"}` : `${nf(e.per / 365.25)} ${EN ? "years" : "anos"}`],
        [{ pt: "Distância à estrela", en: "Distance from star" }, `${nf(e.a, e.a < .1 ? 3 : e.a < 10 ? 2 : 0)} ${EN ? "AU" : "UA"}`],
        e.re ? [{ pt: "Tamanho", en: "Size" }, `${nf(e.re, 2)} × ${EN ? "Earth" : "Terra"}`]
          : e.m ? [{ pt: "Massa mínima", en: "Minimum mass" }, `${nf(e.m, 2)} × ${EN ? "Earth" : "Terra"}`]
          : [{ pt: "Massa", en: "Mass" }, `~${nf(e.mj, e.mj < 1 ? 2 : 0)} × ${EN ? "Jupiter" : "Júpiter"}`],
        [{ pt: "Descoberto", en: "Discovered" }, String(e.disc)],
      ],
    };
  }
  return {
    type: b.type, name: b.name, fact: b.fact, cor: b.cor,
    stats: [
      [{ pt: "Distância ao Sol", en: "Distance from Sun" }, `${nf(b.au, b.au < 10 ? 2 : 1)} ${isEN() ? "AU" : "UA"}`],
      [{ pt: "Um ano dura", en: "One year lasts" }, b.days < 1000 ? `${nf(b.days)} ${isEN() ? "days" : "dias"}` : `${nf(b.days / 365.25, 1)} ${isEN() ? "years" : "anos"}`],
      [{ pt: "Luas", en: "Moons" }, b.moonCount],
      [{ pt: "Diâmetro", en: "Diameter" }, `${nf(b.diam)} km`],
    ],
  };
}

// ---------- texturas procedurais ----------
function rng(seed) { seed = seed % 2147483647 || 1; return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
function mix(a, b, f) { return "#" + new THREE.Color(a).lerp(new THREE.Color(b), f).getHexString(); }

export function makeTexture(t, seed, W = 1024) {
  const H = W / 2, c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d"), R = rng(seed), k = W / 1024;

  if (t.kind === "gas") {
    for (let y = 0; y < H; y++) {
      const v = y / H;
      const n = Math.sin(v * t.bands * Math.PI + Math.sin(v * 23 + seed) * 1.6) * .5 + .5;
      const idx = n * (t.c.length - 1), i = Math.floor(idx);
      g.fillStyle = mix(t.c[i], t.c[Math.min(i + 1, t.c.length - 1)], idx - i);
      g.fillRect(0, y, W, 1);
    }
    for (let j = 0; j < 900 * k; j++) {
      g.globalAlpha = .05 + R() * .06; g.fillStyle = t.c[Math.floor(R() * t.c.length)];
      g.fillRect(R() * W, R() * H, (40 + R() * 260) * k, 1 + R() * 3 * k);
    }
    if (t.spot) {
      g.globalAlpha = .85; g.fillStyle = t.spot;
      g.beginPath(); g.ellipse(W * .62, H * .64, 42 * k, 20 * k, 0, 0, 7); g.fill();
    }
  } else if (t.kind === "rock") {
    g.fillStyle = t.c[0]; g.fillRect(0, 0, W, H);
    for (let j = 0; j < 500; j++) {
      g.globalAlpha = .08 + R() * .12; g.fillStyle = t.c[Math.floor(R() * t.c.length)];
      g.beginPath(); g.arc(R() * W, R() * H, (6 + R() * 60) * k, 0, 7); g.fill();
    }
    for (let j = 0; j < 160; j++) {
      const x = R() * W, y = R() * H, r = (2 + R() * 10) * k;
      g.globalAlpha = .35; g.fillStyle = "#0004"; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      g.globalAlpha = .25; g.strokeStyle = "#fff8"; g.lineWidth = 1; g.beginPath(); g.arc(x - 1, y - 1, r, 3.6, 5.6); g.stroke();
    }
    if (t.caps) capas(g, W, H);
  } else if (t.kind === "earth") {
    const ocean = g.createLinearGradient(0, 0, 0, H);
    ocean.addColorStop(0, "#1b4f9c"); ocean.addColorStop(.5, "#2a74c9"); ocean.addColorStop(1, "#1b4f9c");
    g.fillStyle = ocean; g.fillRect(0, 0, W, H);
    for (let j = 0; j < 11; j++) {
      const cx = R() * W, cy = H * (.2 + R() * .6), spread = 40 + R() * 90;
      for (let m = 0; m < 70; m++) {
        g.globalAlpha = 1;
        g.fillStyle = R() < .7 ? mix("#3f9a5c", "#2e7a45", R()) : mix("#b59a62", "#8f7445", R());
        g.beginPath(); g.arc(cx + (R() - .5) * spread * 2, cy + (R() - .5) * spread, 6 + R() * 22, 0, 7); g.fill();
      }
    }
    capas(g, W, H);
    for (let j = 0; j < 260; j++) {
      g.globalAlpha = .18 + R() * .2; g.fillStyle = "#fff";
      g.beginPath(); g.ellipse(R() * W, R() * H, 20 + R() * 70, 4 + R() * 10, (R() - .5) * .4, 0, 7); g.fill();
    }
  } else if (t.kind === "sun") {
    const base = g.createLinearGradient(0, 0, 0, H);
    const sc = t.c || ["#ff9a2a", "#ffc24a", "#fff1b0", "#e0531a"];
    base.addColorStop(0, sc[0]); base.addColorStop(.5, sc[1]); base.addColorStop(1, sc[0]);
    g.fillStyle = base; g.fillRect(0, 0, W, H);
    for (let j = 0; j < 2500; j++) {
      g.globalAlpha = .12 + R() * .15; g.fillStyle = R() < .5 ? sc[2] : sc[3];
      g.beginPath(); g.arc(R() * W, R() * H, 2 + R() * 9, 0, 7); g.fill();
    }
  }
  g.globalAlpha = 1;
  const tx = new THREE.CanvasTexture(c);
  tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8;
  return tx;
}
function capas(g, W, H) {
  for (const [y0, y1] of [[0, H * .08], [H, H * .92]]) {
    const gr = g.createLinearGradient(0, y0, 0, y1);
    gr.addColorStop(0, "#ffffffee"); gr.addColorStop(1, "#ffffff00");
    g.globalAlpha = 1; g.fillStyle = gr; g.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0));
  }
}
export function glowTexture(inner, outer) {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d"), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, inner); gr.addColorStop(.25, outer); gr.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx;
}
export const glowMat = (a, b, o) => new THREE.SpriteMaterial({ map: glowTexture(a, b), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: o });

function ringTexture() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 4;
  const g = c.getContext("2d"), R = rng(77);
  for (let x = 0; x < 512; x++) {
    const v = x / 512, gap = v > .62 && v < .68 ? .1 : 1; // divisão de Cassini
    g.fillStyle = `rgba(${230 + R() * 20},${205 + R() * 20},${160 + R() * 30},${(.35 + R() * .55) * gap})`;
    g.fillRect(x, 0, 1, 4);
  }
  const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx;
}
function circle(radius, mat, seg = 160) {
  const pts = [];
  for (let k = 0; k <= seg; k++) { const a = k / seg * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius)); }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
}

// ---------- o sistema ----------
export class SolarSystem {
  constructor({ labelsEl, onFocus, stars = true, data = SOLAR }) {
    this.data = data;
    this.group = new THREE.Group();
    this.bodies = [];         // planetas + luas
    this.pickables = [];
    this.focused = null;
    this.flying = false;
    this.onFocus = onFocus;
    this.labels = [];
    this.t = 0;
    const G = this.group, star = data.star;
    if (labelsEl) { this.labelsBox = document.createElement("div"); this.labelsBox.className = "label-set"; labelsEl.appendChild(this.labelsBox); labelsEl = this.labelsBox; }

    G.add(new THREE.AmbientLight(0xffffff, .07));
    G.add(new THREE.PointLight(star.light, 3.2, 0, 0));

    if (stars) {
      const n = 2500, pos = new Float32Array(n * 3), v = new THREE.Vector3();
      for (let i = 0; i < n; i++) { v.randomDirection().multiplyScalar(600 + Math.random() * 600); v.toArray(pos, i * 3); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      G.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.4, sizeAttenuation: false, color: 0xcfd8ff, transparent: true, opacity: .7 })));
    }

    // Sol
    this.sun = new THREE.Mesh(new THREE.SphereGeometry(star.r, 64, 64), new THREE.MeshBasicMaterial({ map: makeTexture(star.tex, 3) }));
    this.sun.userData.id = star.id;
    this.glow1 = new THREE.Sprite(glowMat(star.glow[0], star.glow[1], .9));
    this.glow2 = new THREE.Sprite(glowMat(star.glow[2], star.glow[3], .7));
    G.add(this.sun, this.glow1, this.glow2);
    this.pickables.push(this.sun);
    this.addLabel({ ...star, mesh: this.sun, isSun: true }, labelsEl);

    // cinturas (asteroides / discos de detritos)
    this.belt = new THREE.Group(); G.add(this.belt);
    for (const [r0, r1, color] of data.belts || []) {
      const n = Math.round(110 * (r1 * r1 - r0 * r0) / 10), pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, r = r0 + Math.random() * (r1 - r0) + (Math.random() - .5);
        pos.set([Math.cos(a) * r, (Math.random() - .5) * .9, Math.sin(a) * r], i * 3);
      }
      const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      this.belt.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: .09, color, transparent: true, opacity: .8 })));
    }

    const orbitMat = new THREE.LineBasicMaterial({ color: 0x7aa2ff, transparent: true, opacity: .16 });
    const moonOrbitMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .1 });

    data.planets.forEach((p, i) => {
      const incl = new THREE.Group(); incl.rotation.x = p.incl || 0; G.add(incl);
      incl.add(circle(p.d, orbitMat));
      const pivot = new THREE.Group(); pivot.rotation.y = (i + 1) * 2.39996 + data.id.length * 1.3; /* ângulo de ouro */ incl.add(pivot);
      const holder = new THREE.Group(); holder.position.x = p.d; holder.rotation.z = p.tilt; pivot.add(holder);
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.r, 64, 64),
        new THREE.MeshStandardMaterial({ map: makeTexture(p.tex, i * 97 + 11), roughness: .9, metalness: 0 }));
      mesh.userData.id = p.id; holder.add(mesh); this.pickables.push(mesh);

      const atm = new THREE.Sprite(glowMat("rgba(255,255,255,0)", p.cor + "55", .5));
      atm.scale.setScalar(p.r * 3.2); holder.add(atm);

      if (p.rings) {
        const inner = p.r * 1.3, outer = p.r * 2.4, geo = new THREE.RingGeometry(inner, outer, 160);
        const pos = geo.attributes.position, uv = geo.attributes.uv, v = new THREE.Vector3();
        for (let k = 0; k < pos.count; k++) { v.fromBufferAttribute(pos, k); uv.setXY(k, (v.length() - inner) / (outer - inner), .5); }
        const ring = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: ringTexture(), side: THREE.DoubleSide, transparent: true, depthWrite: false }));
        ring.rotation.x = -Math.PI / 2; holder.add(ring);
      }

      const body = { ...p, mesh, pivot, w: p.w ?? .45 / Math.sqrt(p.per), moonBodies: [] };
      let outerMoon = 0;
      (p.moons || []).forEach((m, j) => {
        const mr = m.r ?? Math.max(.05, m.diam / 12742);
        const a = p.r * p.moonBase + j * p.moonGap + mr;
        outerMoon = a;
        holder.add(circle(a, moonOrbitMat, 96));
        const mp = new THREE.Group(); mp.rotation.y = (j + 1) * 2.39996 + i; holder.add(mp);
        const mm = new THREE.Mesh(new THREE.SphereGeometry(mr, 32, 32),
          new THREE.MeshStandardMaterial({ map: makeTexture({ kind: m.kind || "rock", bands: m.bands, c: m.c }, j * 131 + i * 17 + 5, 512), roughness: 1 }));
        mm.position.x = a; mm.userData.id = m.id; mp.add(mm); this.pickables.push(mm);
        const mb = { ...m, r: mr, mesh: mm, pivot: mp, parent: body, w: (m.retro ? -1 : 1) * 2.2 / Math.sqrt(m.per), view: mr * 10 + .8 };
        body.moonBodies.push(mb); this.bodies.push(mb);
        this.addLabel(mb, labelsEl);
      });
      body.view = Math.max(p.r * 6 + 3, outerMoon * 2.6);
      this.bodies.push(body);
      this.addLabel(body, labelsEl);
    });
  }

  addLabel(b, labelsEl) {
    if (!labelsEl) return;
    const el = document.createElement("button");
    el.className = "label" + (b.parent ? " moon" : ""); el.style.setProperty("--c", b.parent ? "#dfe4f5" : b.cor);
    el.addEventListener("click", () => this.focus(b.id));
    labelsEl.appendChild(el);
    b.label = el;
    this.labels.push(b);
    el.textContent = T(b.name);
  }
  relabel() { for (const b of this.labels) b.label.textContent = T(b.name); }

  get(id) { return this.bodies.find(b => b.id === id) || null; }
  focus(id) {
    this.focused = !id ? null : this.get(id);
    this.flying = true;
    this.onFocus?.(this.focused);
  }
  pick(raycaster) { return raycaster.intersectObjects(this.pickables)[0]?.object.userData.id; }

  tick(dt, { camera, controls, W, H, paused, baseDist }) {
    if (!paused) this.t += dt;
    for (const b of this.bodies) {
      if (!paused) b.pivot.rotation.y += dt * b.w;
      b.mesh.rotation.y += dt * (b.rot ?? .3) * .6;
    }
    if (!paused) this.belt.rotation.y += dt * .02;
    this.sun.rotation.y += dt * .04;
    const pulse = 1 + Math.sin(this.t * 1.5) * .03;
    const sr = this.data.star.r; this.glow1.scale.setScalar(sr * 5.6 * pulse); this.glow2.scale.setScalar(sr * 13.3 * (2 - pulse));

    // câmara: voa até ao alvo, depois segue-o (o zoom continua livre)
    const goal = this._goal ||= new THREE.Vector3(), off = this._off ||= new THREE.Vector3();
    const f = this.focused;
    if (f) f.mesh.getWorldPosition(goal); else goal.set(0, 0, 0);
    if (this.flying) {
      const want = f ? f.view : baseDist;
      off.copy(camera.position).sub(controls.target);
      const kT = 1 - Math.pow(.92, dt * 60), kL = 1 - Math.pow(.94, dt * 60);
      controls.target.lerp(goal, kT);
      const len = THREE.MathUtils.lerp(off.length(), want, kL);
      camera.position.copy(controls.target).add(off.setLength(len));
      if (controls.target.distanceTo(goal) < want * .01 && Math.abs(len - want) < want * .02) this.flying = false;
    } else {
      off.copy(goal).sub(controls.target);
      controls.target.add(off); camera.position.add(off);
    }

    // etiquetas
    if (!this.labels.length) return;
    const sys = f ? (f.parent || f) : null, wp = this._wp ||= new THREE.Vector3();
    for (const b of this.labels) {
      let show;
      if (b.isSun) show = !f;
      else if (b.parent) show = !!sys && b.parent === sys;
      else show = !sys || b === sys;
      b.mesh.getWorldPosition(wp); wp.project(camera);
      show = show && wp.z < 1 && Math.abs(wp.x) < 1.1 && Math.abs(wp.y) < 1.1;
      b.label.classList.toggle("off", !show);
      b.label.classList.toggle("on", f === b);
      if (!show) continue;
      const x = (wp.x * .5 + .5) * W, y = (-wp.y * .5 + .5) * H;
      b.label.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%) translateY(-${b.parent ? 6 : 8 + b.r * 5}px)`;
    }
  }
}

// ---------- UI partilhada: barra de corpos, ficha, pausa (troca de sistema com ui.setSystem) ----------
export function bindUI(system, { root, info, dock, reduce }) {
  const state = { paused: !!reduce, system: null };
  let chips = [];
  const pause = document.createElement("button"); pause.className = "pause";

  // no telemóvel a ficha fica recolhida: só tipo + nome; "+ detalhes" abre o resto
  const more = document.createElement("button");
  more.className = "info-more"; more.type = "button";
  info.querySelector("[data-k=name]").after(more);
  const moreLabel = () => { more.textContent = T(info.classList.contains("open") ? { pt: "− menos", en: "− less" } : { pt: "+ detalhes", en: "+ details" }); };
  more.addEventListener("click", () => { info.classList.toggle("open"); moreLabel(); });

  const fill = () => {
    const sys = state.system, f = sys.focused, d = f ? describe(f) : sys.data.overview;
    root.classList.toggle("focused", !!d);
    info.classList.toggle("overview", !f);
    const active = f ? (f.parent || f).id : sys.data.star.id;
    chips.forEach(c => { c.classList.toggle("active", c.dataset.id === active); c.querySelector("span").textContent = T(c._name); });
    pause.textContent = state.paused ? "▶" : "⏸";
    pause.setAttribute("aria-label", T(state.paused ? { pt: "Retomar órbitas", en: "Resume orbits" } : { pt: "Pausar órbitas", en: "Pause orbits" }));
    moreLabel();
    if (!d) return;
    info.style.setProperty("--c", d.cor);
    info.querySelector("[data-k=type]").textContent = T(d.type);
    info.querySelector("[data-k=name]").textContent = T(d.name);
    info.querySelector("[data-k=fact]").textContent = T(d.fact);
    info.querySelector("[data-k=stats]").innerHTML = d.stats.map(([k, v]) => `<div><dt>${T(k)}</dt><dd>${T(v)}</dd></div>`).join("");
    const moons = f ? (f.parent ? f.parent.moonBodies : f.moonBodies) : null;
    info.querySelector("[data-k=moons]").innerHTML = moons?.length
      ? `<p>${T(f.parent ? { pt: "Neste sistema", en: "In this system" } : { pt: "Luas", en: "Moons" })}</p>` +
        (f.parent ? [f.parent, ...moons] : moons).filter(m => m !== f).map(m => `<button data-id="${m.id}">${T(m.name)}</button>`).join("")
      : "";
  };

  state.setSystem = s => {
    state.system = s;
    dock.innerHTML = "";
    chips = [s.data.star, ...s.data.planets].map(p => {
      const b = document.createElement("button");
      b.dataset.id = p.id; b._name = p.name;
      b.innerHTML = `<i class="dot" style="--c:${p.cor}"></i><span></span>`;
      b.addEventListener("click", () => s.focus(p.id === s.data.star.id ? null : p.id));
      dock.appendChild(b); return b;
    });
    dock.appendChild(pause);
    if (!s._ui) {
      s._ui = true;
      const prev = s.onFocus;
      s.onFocus = f => { prev?.(f); if (state.system === s) { info.classList.remove("open"); fill(); } };
    }
    info.classList.remove("open");
    fill();
  };

  info.querySelector("[data-k=moons]").addEventListener("click", e => { const id = e.target.closest("button")?.dataset.id; if (id) state.system.focus(id); });
  info.querySelector("[data-close]").addEventListener("click", () => state.system.focus(null));
  pause.addEventListener("click", () => { state.paused = !state.paused; fill(); });
  addEventListener("keydown", e => { const f = state.system.focused; if (e.key === "Escape" && f) state.system.focus(f.parent?.id ?? null); });
  addEventListener("langchange", () => { state.system.relabel(); fill(); });

  state.setSystem(system);
  return state;
}
