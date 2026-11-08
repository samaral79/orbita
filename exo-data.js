// ===== Outros sistemas planetários conhecidos =====
// Distâncias e tamanhos no ecrã são estilizados; os números nas fichas são os reais (aprox.).

const PAL = {
  lava: ["#3a1c12", "#ff6a2a", "#5a2a1a", "#ffb04a"],
  rock: ["#8a7a6a", "#b0a08c", "#5e5246", "#9a8a76"],
  rockRed: ["#8a4a32", "#b0664a", "#5e2e1e", "#c07a5a"],
  ice: ["#cfe4f0", "#a9c8dc", "#e8f2f8", "#8fb0c8"],
  ocean: ["#2a5ea8", "#3f7fd0", "#1d4688", "#5a9ae0"],
  gasW: ["#e9d3b4", "#b07a4c", "#f4e6cf", "#c98f5e"],
  gasB: ["#9fb8e8", "#c8d8f5", "#6f8fd0", "#b0c4ee"],
  gasR: ["#c98a6a", "#e8b090", "#9a5a40", "#d8a080"],
  gasP: ["#b48ad8", "#d6b8ee", "#8a5ab8", "#c8a0e4"],
  subN: ["#7ac0d8", "#a8dcea", "#5aa0bc", "#90d0e2"],
};
const TYPE = {
  rocky: { pt: "Planeta rochoso", en: "Rocky planet" },
  lava: { pt: "Super-Terra de lava", en: "Lava super-Earth" },
  superE: { pt: "Super-Terra", en: "Super-Earth" },
  miniN: { pt: "Mini-Neptuno", en: "Mini-Neptune" },
  hotJ: { pt: "Gigante gasoso quente", en: "Hot gas giant" },
  giant: { pt: "Gigante gasoso", en: "Gas giant" },
  superJ: { pt: "Super-Júpiter jovem", en: "Young super-Jupiter" },
};
const ly = (pt, en) => ({ pt: `${pt} anos-luz`, en: `${en} light-years` });

// p: [chave, nome, tipo, d (ecrã), r (ecrã), paleta, kind, período (dias), a (UA), tamanho {re|m|mj}, ano, facto pt, facto en]
function build(sys, star, list) {
  const perMin = Math.min(...list.map(p => p[7]));
  return {
    ...sys,
    star,
    planets: list.map(([k, n, type, d, r, pal, kind, per, a, size, disc, fpt, fen], i) => ({
      id: `${sys.id}-${k}`, name: { pt: n, en: n }, of: { pt: `de ${n}`, en: n },
      type: TYPE[type], d, r, tilt: .1, rot: .15,
      cor: PAL[pal][0], tex: kind === "gas" ? { kind, bands: 6 + (i * 5) % 14, c: PAL[pal] } : { kind, c: PAL[pal] },
      w: .9 * Math.sqrt(perMin / per),
      exo: { per, a, ...size, disc },
      fact: { pt: fpt, en: fen },
    })),
  };
}

export const EXO = [
  build(
    { id: "proxima", galaxyOffset: [4.8, .3, 2.5],
      overview: {
        type: { pt: "Anã vermelha · M5.5", en: "Red dwarf · M5.5" }, name: "Proxima Centauri", cor: "#ff7a4a",
        fact: { pt: "A estrela mais próxima do Sol. É pequena, fria e dada a erupções violentas — e tem pelo menos dois planetas.",
                en: "The closest star to the Sun. Small, cool and prone to violent flares — with at least two planets." },
        stats: [[{ pt: "Distância", en: "Distance" }, ly("4,2", "4.2")], [{ pt: "Planetas", en: "Planets" }, "2"],
                [{ pt: "Estrela", en: "Star" }, { pt: "12% da massa do Sol", en: "12% of the Sun's mass" }], [{ pt: "1.º planeta", en: "First planet" }, "2016"]] } },
    { id: "proxima", name: { pt: "Proxima Centauri", en: "Proxima Centauri" }, cor: "#ff7a4a", r: 1.2,
      tex: { kind: "sun", c: ["#c2361a", "#e0582a", "#ff9a6a", "#7a1a0a"] },
      glow: ["rgba(255,190,150,1)", "rgba(255,90,40,.6)", "rgba(255,110,60,.5)", "rgba(200,40,20,.15)"], light: 0xffb08a },
    [
      ["d", "Proxima d", "rocky", 4.5, .35, "rockRed", "rock", 5.1, .029, { m: .26 }, 2022,
        "Um dos planetas mais leves alguma vez detetados por velocidade radial — cerca de um quarto da massa da Terra.",
        "One of the lightest planets ever found by radial velocity — about a quarter of Earth's mass."],
      ["b", "Proxima b", "rocky", 7.5, .45, "rock", "rock", 11.2, .0485, { m: 1.07 }, 2016,
        "Está na zona habitável, mas as erupções da estrela podem ter-lhe arrancado a atmosfera.",
        "It sits in the habitable zone, but the star's flares may have stripped away its atmosphere."],
    ]),

  build(
    { id: "trappist", galaxyOffset: [-6, -.5, 4.5],
      overview: {
        type: { pt: "Anã ultrafria · M8", en: "Ultracool dwarf · M8" }, name: "TRAPPIST-1", cor: "#ff5a3a",
        fact: { pt: "Sete planetas do tamanho da Terra, todos mais perto da estrela do que Mercúrio do Sol. Três estão na zona habitável.",
                en: "Seven Earth-sized planets, all closer to their star than Mercury is to the Sun. Three are in the habitable zone." },
        stats: [[{ pt: "Distância", en: "Distance" }, ly("40", "40")], [{ pt: "Planetas", en: "Planets" }, "7"],
                [{ pt: "Estrela", en: "Star" }, { pt: "Pouco maior que Júpiter", en: "Barely bigger than Jupiter" }], [{ pt: "Descobertos", en: "Discovered" }, "2016–2017"]] } },
    { id: "trappist", name: { pt: "TRAPPIST-1", en: "TRAPPIST-1" }, cor: "#ff5a3a", r: 1.6,
      tex: { kind: "sun", c: ["#a8240f", "#d0401c", "#ff7a4a", "#5a0e04"] },
      glow: ["rgba(255,160,120,1)", "rgba(230,60,30,.6)", "rgba(255,90,50,.5)", "rgba(180,30,10,.15)"], light: 0xff9a7a },
    [
      ["b", "TRAPPIST-1b", "rocky", 3.6, .45, "lava", "rock", 1.51, .0115, { re: 1.12 }, 2016,
        "O mais quente. O JWST mostrou que quase de certeza não tem atmosfera espessa.", "The hottest one. JWST showed it almost certainly has no thick atmosphere."],
      ["c", "TRAPPIST-1c", "rocky", 4.8, .44, "rockRed", "rock", 2.42, .0158, { re: 1.10 }, 2016,
        "Também observado pelo JWST: nenhum sinal de uma atmosfera densa de CO₂.", "Also observed by JWST: no sign of a thick CO₂ atmosphere."],
      ["d", "TRAPPIST-1d", "rocky", 6.1, .37, "rock", "rock", 4.05, .0223, { re: .79 }, 2016,
        "Na orla interior da zona habitável.", "On the inner edge of the habitable zone."],
      ["e", "TRAPPIST-1e", "rocky", 7.4, .41, "ocean", "gas", 6.10, .0293, { re: .92 }, 2017,
        "O melhor candidato do sistema a ter água líquida à superfície.", "The system's best candidate for liquid water on the surface."],
      ["f", "TRAPPIST-1f", "rocky", 8.8, .43, "ice", "rock", 9.21, .0385, { re: 1.05 }, 2017,
        "Na zona habitável; pode ser um mundo gelado ou com um oceano escondido.", "In the habitable zone; could be icy or hide an ocean."],
      ["g", "TRAPPIST-1g", "rocky", 10.3, .45, "ice", "rock", 12.35, .0469, { re: 1.13 }, 2017,
        "O maior do sistema, ainda na zona habitável.", "The largest in the system, still within the habitable zone."],
      ["h", "TRAPPIST-1h", "rocky", 12.2, .36, "ice", "rock", 18.77, .0619, { re: .76 }, 2017,
        "O mais distante e frio — provavelmente coberto de gelo.", "The outermost and coldest — probably covered in ice."],
    ]),

  build(
    { id: "cancri", galaxyOffset: [5.5, .6, -6.5],
      overview: {
        type: { pt: "Estrela tipo Sol · G8 (binária)", en: "Sun-like star · G8 (binary)" }, name: "55 Cancri", cor: "#ffcf7a",
        fact: { pt: "A primeira estrela onde se encontraram cinco planetas. Os planetas têm nomes de astrónomos: Galileo, Brahe, Lipperhey, Janssen e Harriot.",
                en: "The first star found to have five planets. They're named after astronomers: Galileo, Brahe, Lipperhey, Janssen and Harriot." },
        stats: [[{ pt: "Distância", en: "Distance" }, ly("41", "41")], [{ pt: "Planetas", en: "Planets" }, "5"],
                [{ pt: "Estrela", en: "Star" }, { pt: "Tem uma anã vermelha companheira", en: "Has a red dwarf companion" }], [{ pt: "1.º planeta", en: "First planet" }, "1996"]] } },
    { id: "cancri", name: { pt: "55 Cancri", en: "55 Cancri" }, cor: "#ffcf7a", r: 3.2,
      tex: { kind: "sun", c: ["#f08a2a", "#ffb84a", "#fff0b0", "#c8501a"] },
      glow: ["rgba(255,235,190,1)", "rgba(255,160,60,.6)", "rgba(255,170,90,.6)", "rgba(255,100,40,.15)"], light: 0xffe0b8 },
    [
      ["e", "Janssen (e)", "lava", 5.6, .62, "lava", "rock", .74, .0154, { re: 1.88 }, 2004,
        "Dá a volta à estrela em 18 horas. Superfície de lava a mais de 2 000 °C — e o JWST detetou-lhe uma atmosfera.",
        "Orbits its star in 18 hours. A lava surface above 2,000 °C — and JWST detected an atmosphere."],
      ["b", "Galileo (b)", "hotJ", 10.5, 1.5, "gasR", "gas", 14.65, .113, { mj: .83 }, 1996,
        "Um gigante quente com cerca de 80% da massa de Júpiter.", "A hot giant with about 80% of Jupiter's mass."],
      ["c", "Brahe (c)", "giant", 15.5, 1.2, "gasW", "gas", 44.4, .237, { mj: .17 }, 2002,
        "Cerca de metade da massa de Saturno.", "About half the mass of Saturn."],
      ["f", "Harriot (f)", "giant", 22.5, 1.15, "gasB", "gas", 260, .77, { mj: .15 }, 2007,
        "Está na zona habitável da estrela — mas é um gigante gasoso.", "It's in the star's habitable zone — but it's a gas giant."],
      ["d", "Lipperhey (d)", "giant", 38, 1.7, "gasW", "gas", 4800, 5.5, { mj: 3.8 }, 2002,
        "Um super-Júpiter mais ou menos à distância a que Júpiter está do Sol. Demora ~13 anos a dar a volta.",
        "A super-Jupiter at roughly Jupiter's distance from the Sun. It takes ~13 years per orbit."],
    ]),

  build(
    { id: "hr8799", galaxyOffset: [-8.5, 1, -7], belts: [[8.6, 10.6, 0xbfd0ff], [44, 54, 0xa0b4e8]],
      overview: {
        type: { pt: "Estrela jovem · A5", en: "Young star · A5" }, name: "HR 8799", cor: "#cfe0ff",
        fact: { pt: "Um dos primeiros sistemas fotografados diretamente: há imagens dos quatro gigantes a moverem-se ao longo dos anos. Tem só ~30 milhões de anos.",
                en: "One of the first systems ever photographed directly: there are images of its four giants moving over the years. It's only ~30 million years old." },
        stats: [[{ pt: "Distância", en: "Distance" }, ly("~130", "~130")], [{ pt: "Planetas", en: "Planets" }, "4"],
                [{ pt: "Estrela", en: "Star" }, { pt: "1,5× a massa do Sol", en: "1.5× the Sun's mass" }], [{ pt: "Fotografados", en: "Imaged" }, "2008"]] } },
    { id: "hr8799", name: { pt: "HR 8799", en: "HR 8799" }, cor: "#cfe0ff", r: 3.4,
      tex: { kind: "sun", c: ["#b8ccff", "#e8f0ff", "#ffffff", "#8aa4f0"] },
      glow: ["rgba(240,245,255,1)", "rgba(150,180,255,.6)", "rgba(170,190,255,.6)", "rgba(100,130,255,.15)"], light: 0xe4ecff },
    [
      ["e", "HR 8799 e", "superJ", 14, 1.6, "gasP", "gas", 45 * 365, 16.4, { mj: 8 }, 2010,
        "O mais interior, descoberto em 2010. O instrumento GRAVITY conseguiu medir-lhe a luz diretamente.",
        "The innermost, found in 2010. The GRAVITY instrument managed to measure its light directly."],
      ["d", "HR 8799 d", "superJ", 20, 1.65, "gasR", "gas", 100 * 365, 27, { mj: 9 }, 2008,
        "Cerca de 9 vezes Júpiter, mais ou menos à distância de Neptuno ao Sol.", "About 9 times Jupiter, roughly at Neptune's distance from the Sun."],
      ["c", "HR 8799 c", "superJ", 28, 1.7, "gasP", "gas", 190 * 365, 43, { mj: 8 }, 2008,
        "O JWST fotografou-o e encontrou sinais de dióxido de carbono na atmosfera.", "JWST imaged it and found signs of carbon dioxide in its atmosphere."],
      ["b", "HR 8799 b", "superJ", 38, 1.6, "gasR", "gas", 460 * 365, 68, { mj: 7 }, 2008,
        "O mais exterior: demora ~460 anos a dar uma volta.", "The outermost: it takes ~460 years to go around once."],
    ]),

  build(
    { id: "kepler90", galaxyOffset: [20, .5, 19],
      overview: {
        type: { pt: "Estrela tipo Sol · G0", en: "Sun-like star · G0" }, name: "Kepler-90", cor: "#fff0c8",
        fact: { pt: "Oito planetas, tantos como o Sistema Solar — mas todos mais perto da estrela do que a Terra do Sol. O oitavo foi encontrado em 2017 com uma IA da Google.",
                en: "Eight planets, as many as the Solar System — but all closer to their star than Earth is to the Sun. The eighth was found in 2017 with a Google AI." },
        stats: [[{ pt: "Distância", en: "Distance" }, ly("~2 800", "~2,800")], [{ pt: "Planetas", en: "Planets" }, "8"],
                [{ pt: "Estrela", en: "Star" }, { pt: "1,1× a massa do Sol", en: "1.1× the Sun's mass" }], [{ pt: "1.º planeta", en: "First planet" }, "2013"]] } },
    { id: "kepler90", name: { pt: "Kepler-90", en: "Kepler-90" }, cor: "#fff0c8", r: 3.4,
      tex: { kind: "sun", c: ["#ffb84a", "#ffd88a", "#fff8e0", "#e07a2a"] },
      glow: ["rgba(255,248,225,1)", "rgba(255,200,110,.6)", "rgba(255,210,140,.6)", "rgba(255,150,60,.15)"], light: 0xfff4dc },
    [
      ["b", "Kepler-90b", "superE", 6, .52, "lava", "rock", 7.0, .074, { re: 1.31 }, 2013,
        "Uma super-Terra escaldante que dá a volta em 7 dias.", "A scorching super-Earth that orbits in 7 days."],
      ["c", "Kepler-90c", "superE", 7.6, .46, "rockRed", "rock", 8.7, .089, { re: 1.18 }, 2013,
        "Ainda mais pequeno, a 9 dias da estrela.", "Even smaller, 9 days from its star."],
      ["i", "Kepler-90i", "superE", 9.2, .52, "rock", "rock", 14.4, .107, { re: 1.32 }, 2017,
        "O oitavo planeta, encontrado por uma rede neuronal a vasculhar dados do telescópio Kepler.", "The eighth planet, found by a neural network combing through Kepler telescope data."],
      ["d", "Kepler-90d", "miniN", 13, .75, "subN", "gas", 59.7, .32, { re: 2.88 }, 2013,
        "Um mini-Neptuno: maior que a Terra, mais pequeno que Neptuno.", "A mini-Neptune: bigger than Earth, smaller than Neptune."],
      ["e", "Kepler-90e", "miniN", 16, .72, "gasB", "gas", 91.9, .42, { re: 2.67 }, 2013,
        "Outro mini-Neptuno — o tipo de planeta mais comum na galáxia, e que não existe no nosso sistema.", "Another mini-Neptune — the most common type of planet in the galaxy, and one our system doesn't have."],
      ["f", "Kepler-90f", "miniN", 18.6, .75, "subN", "gas", 124.9, .48, { re: 2.89 }, 2013,
        "O terceiro mini-Neptuno da fila.", "The third mini-Neptune in a row."],
      ["g", "Kepler-90g", "giant", 25, 1.33, "gasW", "gas", 210.6, .71, { re: 8.13 }, 2013,
        "Quase do tamanho de Saturno.", "Almost the size of Saturn."],
      ["h", "Kepler-90h", "giant", 32, 1.6, "gasR", "gas", 331.6, 1.01, { re: 11.32 }, 2013,
        "Do tamanho de Júpiter, à mesma distância a que a Terra está do Sol.", "Jupiter-sized, at the same distance Earth is from the Sun."],
    ]),
];
