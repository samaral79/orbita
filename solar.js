// ===== Hero: sistema solar 3D na página inicial =====
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SolarSystem, bindUI } from "./solar-core.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = matchMedia("(pointer: coarse)").matches;

const host = document.getElementById("solar");
const hero = document.querySelector(".hero");

let renderer;
try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { hero.classList.add("no3d"); }

if (renderer) {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, .1, 3000);
  const controls = new OrbitControls(camera, renderer.domElement);
  Object.assign(controls, {
    enableZoom: false, enablePan: false, enableDamping: true, dampingFactor: .06, rotateSpeed: .5,
    minPolarAngle: .2, maxPolarAngle: Math.PI - .2, autoRotate: !reduce, autoRotateSpeed: .3,
  });
  if (coarse) { controls.enabled = false; renderer.domElement.style.touchAction = "pan-y"; }

  const system = new SolarSystem({
    labelsEl: document.getElementById("labels"),
    onFocus: f => { controls.autoRotate = !f && !reduce; resize(); },
  });
  scene.add(system.group);
  const ui = bindUI(system, { root: hero, info: document.getElementById("info"), dock: document.getElementById("dock"), reduce });
  addEventListener("focus-planet", e => system.focus(e.detail));

  // clique nos corpos
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
  const toNdc = e => { const r = renderer.domElement.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, camera); };
  renderer.domElement.addEventListener("pointerdown", e => { down = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener("pointerup", e => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
    toNdc(e); const id = system.pick(ray); if (id) system.focus(id);
  });
  renderer.domElement.addEventListener("pointermove", e => { if (coarse) return; toNdc(e); renderer.domElement.style.cursor = system.pick(ray) ? "pointer" : ""; });

  // tamanho + deslocar a cena para longe do texto
  let W = 1, H = 1, baseDist = 110;
  function resize() {
    W = host.clientWidth; H = host.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const wide = W > 900;
    baseDist = wide ? 100 : 160;
    // Sol no centro; só desvia com um planeta escolhido (para não ficar debaixo da ficha)
    const picked = !!system?.focused;
    off.tx = wide && picked ? -W * .2 : 0;
    off.ty = wide ? 0 : picked ? H * .24 : -H * .14;
    if (off.snap) { off.x = off.tx; off.y = off.ty; off.snap = false; }
    applyOff();
    system.flying = true;
  }
  const off = { x: 0, y: 0, tx: 0, ty: 0, snap: true };
  function applyOff() { camera.setViewOffset(W, H, off.x, off.y, W, H); camera.updateProjectionMatrix(); }
  addEventListener("resize", resize);
  camera.position.set(0, 40, 90);
  resize(); system.focus(null);

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = Math.min(clock.getDelta(), .2);
    if (!visible) return;
    if (Math.abs(off.x - off.tx) > .5 || Math.abs(off.y - off.ty) > .5) {
      const k = 1 - Math.pow(.9, dt * 60);
      off.x += (off.tx - off.x) * k; off.y += (off.ty - off.y) * k; applyOff();
    }
    system.tick(dt, { camera, controls, W, H, paused: ui.paused, baseDist });
    controls.update();
    renderer.render(scene, camera);
  });
}
