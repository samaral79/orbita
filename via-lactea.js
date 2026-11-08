// ===== Via Láctea 3D → voo até ao Sol (ou a outra estrela) → sistema planetário explorável =====
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SolarSystem, SOLAR, bindUI, T, glowMat } from "./solar-core.js";
import { EXO } from "./exo-data.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = s => document.querySelector(s);
const app = $(".explorer"), host = $("#scene"), galLabels = $("#gal-labels"), warp = $(".warp");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setClearColor(0x03040b);
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 1, 1, 6000);
const controls = new OrbitControls(camera, renderer.domElement);
Object.assign(controls, { enablePan: false, enableDamping: true, dampingFactor: .06, rotateSpeed: .5, zoomSpeed: .8 });

// ---------------- Galáxia ----------------
const GAL_R = 500, ARMS = 4, PITCH = Math.tan(THREE.MathUtils.degToRad(14)), R0 = 45;
const armAngle = (arm, r) => arm * (Math.PI * 2 / ARMS) + Math.log(r / R0) / PITCH;
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

// o Sol: a ~26 000 anos-luz do centro, no esporão de Orionte, entre os braços de Perseu e de Sagitário
const SUN_R = 265, sunTheta = armAngle(0, SUN_R) + Math.PI / ARMS * .55;
const SUN_POS = new THREE.Vector3(Math.cos(sunTheta) * SUN_R, 0, Math.sin(sunTheta) * SUN_R);
const HOLE = 3.6; // sem estrelas tão perto de cada sistema (ficariam no meio dos planetas)

// sistemas visitáveis: o nosso + outros conhecidos (distâncias ao Sol exageradas, exceto Kepler-90)
const SYSTEMS = [
  { data: SOLAR, anchor: SUN_POS, home: true, baseDist: 120 },
  ...EXO.map(d => ({ data: d, anchor: SUN_POS.clone().add(new THREE.Vector3(...d.galaxyOffset)),
                     baseDist: Math.max(...d.planets.map(p => p.d), ...(d.belts || []).map(b => b[1])) * 2.1 })),
];
const ANCHORS = SYSTEMS.map(s => s.anchor);

const galaxyHolder = new THREE.Group(), galaxy = new THREE.Group();
galaxyHolder.add(galaxy); scene.add(galaxyHolder);

const galMat = new THREE.ShaderMaterial({
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  uniforms: { uPixel: { value: renderer.getPixelRatio() }, uFixed: { value: 0 }, uOpacity: { value: 1 } },
  vertexShader: `
    attribute float aSize; attribute vec3 aColor;
    uniform float uPixel, uFixed; varying vec3 vColor;
    void main() {
      vColor = aColor;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mv;
      float s = mix(aSize * uPixel * (260.0 / -mv.z), aSize * uPixel * 1.3, uFixed);
      gl_PointSize = clamp(s, 1.0, 48.0 * uPixel);
    }`,
  fragmentShader: `
    uniform float uOpacity; varying vec3 vColor;
    void main() {
      float d = length(gl_PointCoord - .5);
      float a = smoothstep(.5, .0, d); a *= a;
      gl_FragColor = vec4(vColor * a * uOpacity, 1.0);
    }`,
});

{
  const N = 150000, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), size = new Float32Array(N);
  const c = new THREE.Color(), core = new THREE.Color("#ffd9a0"), coreHot = new THREE.Color("#fff2d8"),
        blue = new THREE.Color("#9db8ff"), young = new THREE.Color("#7fa8ff"), pink = new THREE.Color("#ff7fbf"), dust = new THREE.Color("#c9b49a");
  const bar = .45;
  let i = 0;
  const put = (x, y, z, color, s, k) => {
    for (const a of ANCHORS) if (Math.hypot(x - a.x, y - a.y, z - a.z) < HOLE) return;
    pos.set([x, y, z], i * 3); col.set([color.r * k, color.g * k, color.b * k], i * 3); size[i] = s; i++;
  };
  while (i < N) {
    const u = Math.random();
    if (u < .2) { // bojo + barra central
      const r = Math.abs(gauss()) * 48, a = Math.random() * Math.PI * 2;
      let x = Math.cos(a) * r * 1.7, z = Math.sin(a) * r * .65;
      [x, z] = [x * Math.cos(bar) - z * Math.sin(bar), x * Math.sin(bar) + z * Math.cos(bar)];
      c.copy(core).lerp(coreHot, Math.random() * Math.exp(-r / 30));
      put(x, gauss() * (4 + r * .3), z, c, 1.2 + Math.random() * 1.8, .55 + Math.random() * .3);
    } else if (u < .88) { // braços
      const arm = Math.random() < .65 ? (Math.random() < .5 ? 0 : 2) : (Math.random() < .5 ? 1 : 3); // 2 braços principais
      const r = R0 + Math.min(-Math.log(1 - Math.random() * .995) * 135, GAL_R - R0);
      const th = armAngle(arm, r), spread = 3.5 + r * .03;
      const x = Math.cos(th) * r + gauss() * spread, z = Math.sin(th) * r + gauss() * spread;
      const fall = Math.exp(-r / 380);
      const roll = Math.random();
      if (roll < .04) { c.copy(pink); put(x, gauss() * 2.5, z, c, 2.4 + Math.random() * 2.5, .9); }
      else { c.copy(blue).lerp(young, Math.random()).lerp(core, Math.max(0, 1 - r / 160) * .8); put(x, gauss() * (2.5 + 5 * Math.exp(-r / 120)), z, c, 1.2 + Math.random() * 2.2, (.75 + Math.random() * .6) * (.6 + fall)); }
    } else { // disco difuso entre os braços
      const r = Math.min(-Math.log(1 - Math.random() * .99) * 160, GAL_R), a = Math.random() * Math.PI * 2;
      c.copy(dust).lerp(blue, Math.random() * .4);
      put(Math.cos(a) * r, gauss() * 4, Math.sin(a) * r, c, 1 + Math.random() * 1.2, .3 + Math.random() * .3);
    }
  }
  // esporão de Orionte (o "nosso" braço pequenino)
  const spurA = sunTheta - .25, spurB = sunTheta + .2;
  for (let k = 0; k < 6000; k++) {
    const f = Math.random(), th = spurA + (spurB - spurA) * f, r = SUN_R - 18 + 36 * f;
    const x = Math.cos(th) * r + gauss() * 6, z = Math.sin(th) * r + gauss() * 6;
    if (i >= N) break;
    c.copy(blue).lerp(young, Math.random());
    put(x, gauss() * 2, z, c, .9 + Math.random() * 1.2, .5 + Math.random() * .4);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos.subarray(0, i * 3), 3));
  geo.setAttribute("aColor", new THREE.BufferAttribute(col.subarray(0, i * 3), 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(size.subarray(0, i), 1));
  galaxy.add(new THREE.Points(geo, galMat));
}

// brilho do núcleo
const coreGlow = new THREE.Sprite(glowMat("rgba(255,235,200,.9)", "rgba(255,190,120,.35)", .8));
coreGlow.scale.set(260, 260, 1); galaxy.add(coreGlow);

// marcador "estás aqui"
const marker = new THREE.Group(); marker.position.copy(SUN_POS); galaxy.add(marker);
const markerDot = new THREE.Sprite(glowMat("rgba(255,255,255,1)", "rgba(255,200,120,.8)", 1)); markerDot.scale.setScalar(8); marker.add(markerDot);
const markerRing = new THREE.Mesh(new THREE.RingGeometry(5.5, 6.2, 64), new THREE.MeshBasicMaterial({ color: 0x7aa2ff, transparent: true, opacity: .9, side: THREE.DoubleSide, depthWrite: false }));
markerRing.rotation.x = -Math.PI / 2; marker.add(markerRing);

// marcadores das outras estrelas
const exoMarkers = new THREE.Group(); galaxy.add(exoMarkers);
for (const s of SYSTEMS.slice(1)) {
  const c = new THREE.Color(s.data.star.cor);
  const sp = new THREE.Sprite(glowMat("rgba(255,255,255,1)", `rgba(${c.r * 255 | 0},${c.g * 255 | 0},${c.b * 255 | 0},.8)`, 1));
  sp.scale.setScalar(4); sp.position.copy(s.anchor); sp.userData.sys = s;
  exoMarkers.add(sp); s.sprite = sp;
}

// etiquetas da galáxia
const atArm = (arm, r) => new THREE.Vector3(Math.cos(armAngle(arm, r)) * r, 0, Math.sin(armAngle(arm, r)) * r);
const GAL_LABELS = [
  { pos: new THREE.Vector3(0, 0, 0), name: { pt: "Centro galáctico · Sagitário A*", en: "Galactic centre · Sagittarius A*" }, cls: "core" },
  { pos: atArm(0, 360), name: { pt: "Braço de Perseu", en: "Perseus Arm" } },
  { pos: atArm(1, 230), name: { pt: "Braço de Sagitário", en: "Sagittarius Arm" } },
  { pos: atArm(2, 300), name: { pt: "Braço Escudo-Centauro", en: "Scutum–Centaurus Arm" } },
  { pos: atArm(3, 330), name: { pt: "Braço de Norma", en: "Norma Arm" } },
  { pos: SUN_POS, name: { pt: "Estás aqui", en: "You are here" }, cls: "here", click: () => goToSystem(SYSTEMS[0]) },
  ...SYSTEMS.slice(1).map((s, k) => ({ pos: s.anchor, name: s.data.star.name, cls: "exo", fan: k, click: () => goToSystem(s) })),
].map(l => {
  const el = document.createElement("button");
  el.className = "glabel " + (l.cls || "");
  if (l.click) el.addEventListener("click", l.click); else el.tabIndex = -1;
  galLabels.appendChild(el);
  return { ...l, el };
});
// linhas do leque (ligam cada etiqueta à estrela verdadeira)
const SVGNS = "http://www.w3.org/2000/svg", lines = document.createElementNS(SVGNS, "svg");
lines.classList.add("gal-lines"); galLabels.prepend(lines);
for (const l of GAL_LABELS) if (l.fan !== undefined) { l.line = document.createElementNS(SVGNS, "line"); lines.appendChild(l.line); }
const sunScr = new THREE.Vector3();
const relabelGalaxy = () => GAL_LABELS.forEach(l => { l.el.textContent = T(l.name); });
relabelGalaxy();
addEventListener("langchange", relabelGalaxy);

// lista de sistemas no painel da galáxia
const list = $("#systems");
for (const s of SYSTEMS) {
  const b = document.createElement("button");
  b.innerHTML = `<i class="dot" style="--c:${s.data.star.cor}"></i><span></span>`;
  b._name = s.home ? { pt: "Sistema Solar", en: "Solar System" } : s.data.star.name;
  b.addEventListener("click", () => goToSystem(s));
  list.appendChild(b);
}
const relabelList = () => list.querySelectorAll("button").forEach(b => { b.querySelector("span").textContent = T(b._name); });
relabelList(); addEventListener("langchange", relabelList);

// ---------------- Sistemas (criados só quando se visitam) ----------------
const labelsRoot = $("#labels");
function sysOf(s) {
  if (!s.sys) {
    s.sys = new SolarSystem({ labelsEl: labelsRoot, data: s.data, onFocus: () => resize() });
    s.sys.group.visible = false;
    s.sys.labelsBox.style.display = "none";
    scene.add(s.sys.group);
  }
  return s.sys;
}
const ui = bindUI(sysOf(SYSTEMS[0]), { root: app, info: $("#info"), dock: $("#dock"), reduce });

// ---------------- Modos e transições ----------------
let mode = "galaxy", current = null, fly = null, W = 1, H = 1;
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function flyTo(toTarget, toDist, dur, done, toDir) {
  const off = camera.position.clone().sub(controls.target);
  fly = { t0: performance.now(), dur: reduce ? .01 : dur, fromT: controls.target.clone(), toT: toTarget.clone(), fromD: off.length(), toD: toDist,
          fromDir: off.normalize(), toDir: (toDir || off).clone().normalize(), done };
  controls.enabled = false;
}

function hideSystems() {
  for (const s of SYSTEMS) if (s.sys) { s.sys.group.visible = false; s.sys.labelsBox.style.display = "none"; }
}

function setGalaxyMode() {
  mode = "galaxy"; app.dataset.mode = "galaxy";
  viewOff.snap = true;
  galaxyHolder.rotation.set(0, 0, 0); galaxy.scale.setScalar(1); galaxy.position.set(0, 0, 0);
  galMat.uniforms.uFixed.value = 0; galMat.uniforms.uOpacity.value = 1;
  marker.visible = exoMarkers.visible = coreGlow.visible = true;
  hideSystems();
  camera.near = 1; camera.far = 6000; camera.updateProjectionMatrix();
  Object.assign(controls, { minDistance: 8, maxDistance: 1500, autoRotate: !reduce, autoRotateSpeed: .25 });
  queueMicrotask(resize);
}

function setSystemMode(s) {
  mode = "system"; app.dataset.mode = "system"; current = s;
  viewOff.snap = true;
  // a galáxia passa a ser o céu: estrela no centro, escala enorme, disco inclinado ~60°
  const S = 30;
  galaxyHolder.rotation.set(1.05, 0, .3);
  galaxy.scale.setScalar(S);
  galaxy.position.copy(s.anchor).applyEuler(galaxy.rotation).multiplyScalar(-S);
  galMat.uniforms.uFixed.value = 1; galMat.uniforms.uOpacity.value = .65;
  marker.visible = exoMarkers.visible = coreGlow.visible = false;
  hideSystems();
  const sys = sysOf(s);
  sys.group.visible = true; sys.labelsBox.style.display = "";
  ui.setSystem(sys);
  camera.near = .05; camera.far = 40000; camera.updateProjectionMatrix();
  Object.assign(controls, { minDistance: .4, maxDistance: s.baseDist * 2.5, autoRotate: false });
  queueMicrotask(resize);
}

function warpThen(fn) {
  warp.classList.add("on");
  setTimeout(() => { fn(); requestAnimationFrame(() => warp.classList.remove("on")); }, reduce ? 0 : 550);
}

function goToSystem(s) {
  if (mode !== "galaxy" || fly) return;
  controls.autoRotate = false;
  const world = s.anchor.clone().applyMatrix4(galaxy.matrixWorld);
  const dir = camera.position.clone().sub(controls.target).setY(0).normalize().add(new THREE.Vector3(0, .7, 0));
  app.classList.add("flying");
  flyTo(world, 3, 3.2, () => warpThen(() => {
    app.classList.remove("flying");
    setSystemMode(s);
    const sys = sysOf(s);
    controls.target.set(0, 0, 0);
    if (s.home) { camera.position.set(0, 4, 9); sys.focus("terra"); }
    else { camera.position.set(0, s.baseDist * .7, s.baseDist * 1.4); sys.focus(null); }
  }), dir);
}

function goToGalaxy() {
  if (mode !== "system" || fly) return;
  const from = current;
  warpThen(() => {
    current.sys.focus(null); current.sys.flying = false;
    setGalaxyMode();
    const world = from.anchor.clone().applyMatrix4(galaxy.matrixWorld);
    controls.target.copy(world);
    camera.position.copy(world).add(new THREE.Vector3(0, 3, 4));
    current = null;
    flyTo(new THREE.Vector3(), 680, 3.4, () => { controls.autoRotate = !reduce; }, new THREE.Vector3(0, .85, .52));
  });
}

$("#go-earth").addEventListener("click", () => goToSystem(SYSTEMS[0]));
$("#back-galaxy").addEventListener("click", goToGalaxy);

// clique em corpos / marcadores
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
const toNdc = e => { const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); };
const galHit = () => ray.intersectObjects([markerDot, ...exoMarkers.children])[0]?.object;
renderer.domElement.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener("pointerup", e => {
  if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
  toNdc(e);
  if (mode === "system") { const id = current.sys.pick(ray); if (id) current.sys.focus(id); }
  else { const o = galHit(); if (o) goToSystem(o.userData.sys || SYSTEMS[0]); }
});
renderer.domElement.addEventListener("pointermove", e => {
  toNdc(e);
  const hit = mode === "system" ? current.sys.pick(ray) : galHit();
  renderer.domElement.style.cursor = hit ? "pointer" : "";
});

function resize() {
  W = host.clientWidth; H = host.clientHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H;
  // no modo sistema a estrela fica no centro; só se desvia quando há um planeta escolhido (para não ficar debaixo da ficha)
  const picked = mode === "system" && !!current?.sys?.focused;
  const wide = W > 900;
  viewOff.tx = wide ? (mode === "galaxy" ? -W * .16 : picked ? -W * .14 : 0) : 0;
  viewOff.ty = wide ? 0 : mode === "galaxy" ? H * .16 : picked ? H * .12 : 0;
  if (viewOff.snap) { viewOff.x = viewOff.tx; viewOff.y = viewOff.ty; viewOff.snap = false; }
  applyViewOffset();
}
const viewOff = { x: 0, y: 0, tx: 0, ty: 0, snap: true };
function applyViewOffset() {
  camera.setViewOffset(W, H, viewOff.x, viewOff.y, W, H);
  camera.updateProjectionMatrix();
}
addEventListener("resize", resize);

// arranque
setGalaxyMode();
camera.position.set(0, 560, 340);
resize();

const clock = new THREE.Clock(), wp = new THREE.Vector3(), sunWorld = new THREE.Vector3();
renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), .2);

  // desliza o enquadramento em vez de saltar
  if (Math.abs(viewOff.x - viewOff.tx) > .5 || Math.abs(viewOff.y - viewOff.ty) > .5) {
    const k = 1 - Math.pow(.9, dt * 60);
    viewOff.x += (viewOff.tx - viewOff.x) * k; viewOff.y += (viewOff.ty - viewOff.y) * k;
    applyViewOffset();
  }

  if (fly) {
    const el = (performance.now() - fly.t0) / 1000;
    const k = ease(Math.min(el / fly.dur, 1));
    controls.target.lerpVectors(fly.fromT, fly.toT, k);
    const dist = fly.fromD * Math.pow(fly.toD / fly.fromD, k);
    const dir = fly.fromDir.clone().lerp(fly.toDir, k).normalize();
    camera.position.copy(controls.target).addScaledVector(dir, dist);
    if (el >= fly.dur) { const done = fly.done; fly = null; controls.enabled = true; done?.(); }
  }

  if (mode === "galaxy") {
    if (!fly && !reduce) galaxy.rotation.y += dt * .01;
    galaxy.updateMatrixWorld();
    const s = 1 + Math.sin(clock.elapsedTime * 3) * .25;
    markerRing.scale.setScalar(s); markerRing.material.opacity = 1.1 - s * .6;
    sunWorld.copy(SUN_POS).applyMatrix4(galaxy.matrixWorld);
    const near = camera.position.distanceTo(sunWorld) < 220;
    const flying = app.classList.contains("flying");
    // longe: os outros sistemas abrem-se num leque por cima do Sol, com uma linha até à estrela verdadeira
    sunScr.copy(sunWorld).project(camera);
    const sx = (sunScr.x * .5 + .5) * W, sy = (-sunScr.y * .5 + .5) * H;
    const fanR = W < 640 ? 100 : 140, nFan = SYSTEMS.length - 1;
    lines.setAttribute("viewBox", `0 0 ${W} ${H}`);
    for (const l of GAL_LABELS) {
      wp.copy(l.pos).applyMatrix4(galaxy.matrixWorld).project(camera);
      let x = (wp.x * .5 + .5) * W, y = (-wp.y * .5 + .5) * H;
      let show = wp.z < 1 && Math.abs(wp.x) < 1.05 && Math.abs(wp.y) < 1.05 && !flying, fanned = false;
      if (l.fan !== undefined) {
        fanned = !near;
        if (fanned) {
          show = sunScr.z < 1 && !flying;
          const a = (-165 + l.fan * 150 / (nFan - 1)) * Math.PI / 180;
          const lx = Math.min(W - 70, Math.max(70, sx + Math.cos(a) * fanR)), ly = Math.max(24, sy + Math.sin(a) * fanR * .85);
          l.line.setAttribute("x1", x); l.line.setAttribute("y1", y);
          l.line.setAttribute("x2", lx); l.line.setAttribute("y2", ly);
          x = lx; y = ly;
        }
        l.line.style.display = show && fanned ? "" : "none";
      }
      l.el.classList.toggle("off", !show);
      l.el.classList.toggle("fanned", fanned);
      if (show) l.el.style.transform = `translate(${x}px, ${y}px) translate(-50%, ${l.cls === "here" ? "18px" : l.cls === "exo" && !fanned ? "-170%" : "-50%"})`;
    }
  } else {
    current.sys.tick(dt, { camera, controls, W, H, paused: ui.paused, baseDist: current.baseDist });
  }
  if (!fly) controls.update();
  renderer.render(scene, camera);
});
