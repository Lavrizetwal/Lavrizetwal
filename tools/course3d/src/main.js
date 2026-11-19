import * as T from 'three';
import { PI, clamp, mix } from './util.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { rigFromMesh, SPEC_FILLE1 } from './rig.js';
import { buildHuman, applyPose, poseRun, poseCrouch, poseJump, poseHit, poseStand, poseLeap } from './human.js';
import { buildDog, buildBull, buildPig, buildSnake, snakeGround, snakeHang, buildScorpion, updScorpion, buildBees, updBees } from './animals.js';

const FOV = 22;
const CFG = {
  runner:        { Fm: 2.4, Fu: 1.73, pitch: .2 },
  bandit_debout: { Fm: 2.4, Fu: 1.77, pitch: .2 },
  bandit_saut:   { Fm: 3.0, Fu: 1.53, pitch: .2 },
  chien:         { Fm: 1.2, Fu: 1.36, pitch: .3 },
  taureau:       { Fm: 2.1, Fu: 1.82, pitch: .25 },
  cochon:        { Fm: 1.0, Fu: .86, pitch: .3 },
  serpent_sol:   { Fm: 1.3, Fu: 1.12, pitch: .42 },
  serpent_arbre: { Fm: 2.6, Fu: 2.34, pitch: .1 },
  scorpion:      { Fm: .62, Fu: .69, pitch: .45 },
  abeilles:      { Fm: 1.7, Fu: 1.36, pitch: .12 }
};
const LIGHT = {
  ville:    { sun: 0xffb27a, si: 2.6, sp: [-1.4, 1.1, 1.0], sky: 0x7d6a9a, gnd: 0x3a2a30, hi: .75, rim: 0x7aa0ff, ri: .9, exp: 1.05 },
  foret:    { sun: 0xfff2cf, si: 2.8, sp: [1.0, 2.2, 1.2], sky: 0xc4e8ff, gnd: 0x2d5c2c, hi: .95, rim: 0xfff0b0, ri: .6, exp: 1.0 },
  montagne: { sun: 0xf3f6ff, si: 2.7, sp: [-1.0, 1.7, 1.3], sky: 0xa5bde6, gnd: 0x5a5a60, hi: .85, rim: 0xcfe0ff, ri: .8, exp: 1.0 }
};

const R = { ready: false, off: false, tier: 'high', BUF: 512, ema: 0, slow: 0, models: {}, ctl: {}, theme: 'ville', t0: 0, acc: 0 };
let renderer, scene, camera, sun, hemi, rim, canvas;

function tierAuto(){
  const nav = navigator, mem = nav.deviceMemory || 4, cores = nav.hardwareConcurrency || 4;
  if(window.__Z3D_FORCE) return 'high';
  if(/[?&]q3d=off/.test(location.search)) return 'off';
  if(/[?&]q3d=(high|mid)/.test(location.search)) return RegExp.$1;
  if(mem <= 1 || cores <= 2) return 'off';
  if(mem <= 2 || cores <= 4) return 'mid';
  return 'high';
}
function init(){
  if(R.ready || R.off) return R.ready;
  R.tier = tierAuto(); if(R.tier === 'off'){ R.off = true; return false; }
  R.BUF = R.tier === 'high' ? 512 : 320;
  try{
    canvas = document.createElement('canvas'); canvas.width = canvas.height = R.BUF;
    renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: R.tier === 'high', premultipliedAlpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    renderer.setPixelRatio(1); renderer.setSize(R.BUF, R.BUF, false); renderer.autoClear = false; renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); R.off = true; R.ready = false; });
    scene = new T.Scene(); camera = new T.PerspectiveCamera(FOV, 1, .1, 40);
    sun = new T.DirectionalLight(0xffffff, 2.5); scene.add(sun); scene.add(sun.target);
    hemi = new T.HemisphereLight(0xffffff, 0x444444, .8); scene.add(hemi);
    rim = new T.DirectionalLight(0xffffff, .8); rim.position.set(1.5, 1.2, -2); scene.add(rim);
    setTheme('ville'); R.ready = true;
  }catch(e){ R.off = true; R.ready = false; }
  return R.ready;
}
function setTheme(th){
  const L = LIGHT[th] || LIGHT.ville; R.theme = th; if(!sun) return;
  sun.color.setHex(L.sun); sun.intensity = L.si; sun.position.set(L.sp[0], L.sp[1], L.sp[2]);
  hemi.color.setHex(L.sky); hemi.groundColor.setHex(L.gnd); hemi.intensity = L.hi * 1.3; rim.color.setHex(L.rim); rim.intensity = L.ri; renderer.toneMappingExposure = L.exp * 1.2;
}
function fit(k){
  const c = CFG[k]; if(c.ty != null) return c;
  const D = (c.Fm / 2) / Math.tan(FOV / 2 * PI / 180) * 1.02, p = c.pitch; let ty = c.Fm * .42; c.D = D;
  for(let i = 0; i < 10; i++){
    camera.position.set(0, ty + D * Math.sin(p), D * Math.cos(p)); camera.lookAt(0, ty, 0); camera.updateMatrixWorld(true); camera.updateProjectionMatrix();
    const v = new T.Vector3(0, 0, 0).project(camera); ty += (v.y + .78) * c.Fm * .5;
  }
  c.ty = ty; return c;
}

/* ── modèles ── */
function reg(o){ o.root.visible = false; scene.add(o.root); return o; }
function getModel(k){
  let m = R.models[k]; if(m) return m;
  if(k === 'bandit_debout' || k === 'bandit_saut'){
    let b = R.models._bandit; if(!b){ const h = buildHuman('bandit'); b = R.models._bandit = reg({ root: h.root, h }); }
    m = R.models[k] = b; return m;
  }
  if(k === 'chien'){ const a = buildDog(); m = reg({ root: a.root, a }); }
  else if(k === 'taureau'){ const a = buildBull(); m = reg({ root: a.root, a }); }
  else if(k === 'cochon'){ const a = buildPig(); m = reg({ root: a.root, a }); }
  else if(k === 'serpent_sol' || k === 'serpent_arbre'){ const a = buildSnake(); m = reg({ root: a.root, a }); }
  else if(k === 'scorpion'){ const a = buildScorpion(); m = reg({ root: a.root, a }); }
  else if(k === 'abeilles'){ const a = buildBees(); m = reg({ root: a.root, a }); }
  R.models[k] = m; return m;
}
const WHO = { fille1: { url: 'models/fille1.glb?v=1', state: 0, cbs: [], gltf: null, spec: SPEC_FILLE1 } };
function loadWho(name, cb){
  const w = WHO[name]; if(!w){ cb && cb(false); return; }
  if(w.state === 2){ cb && cb(true); return; } if(w.state === 3){ cb && cb(false); return; }
  w.cbs.push(cb); if(w.state === 1) return; w.state = 1;
  try{ new GLTFLoader().load(w.url, g => { w.gltf = g; w.state = 2; w.cbs.forEach(f => f && f(true)); w.cbs = []; }, undefined, () => { w.state = 3; w.cbs.forEach(f => f && f(false)); w.cbs = []; }); }
  catch(e){ w.state = 3; w.cbs.forEach(f => f && f(false)); }
}
function whoReady(name){ return !!(WHO[name] && WHO[name].state === 2); }
function ctlFor(key, who){
  const kk = key + '|' + (who || 'man');
  let c = R.ctl[kk]; if(c) return c;
  let h, mats, fille = false;
  if(who && whoReady(who)){
    let mesh; WHO[who].gltf.scene.traverse(n => { if(n.isMesh && !mesh) mesh = n; });
    h = rigFromMesh(mesh, WHO[who].spec); mats = [h.mat]; fille = true;
  } else { h = buildHuman('runner'); mats = [h.M.shirt, h.M.skin, h.M.vest, h.M.pants]; }
  h.root.rotation.y = PI; const o = reg({ root: h.root, h });
  c = R.ctl[kk] = { o, h, w: { j: 0, c: 0, h: 0 }, last: null, lcx: null, vx: 0, ph: 0, mats, fille, hitT0: 0, wasHit: false };
  return c;
}
function runnerUpdate(c, now, cx, st, u){
  const dt = c.last == null ? 16 : clamp(now - c.last, 1, 100); c.last = now;
  const run = st.speed === 0 ? 0 : 1;
  c.ph += dt / (c.fille ? 54 : 62) * (run ? 1 : 0);
  const k = d => 1 - Math.exp(-dt / 1000 * d);
  const jv = st.jump ? clamp(st.jv == null ? .5 : st.jv, 0, 1) : 0;
  c.w.j += ((st.jump ? 1 : 0) - c.w.j) * k(st.jump ? 26 : 16);
  c.w.c += ((st.crouch ? 1 : 0) - c.w.c) * k(14);
  c.w.h += ((st.hit ? 1 : 0) - c.w.h) * k(st.hit ? 30 : 9);
  if(st.hit && !c.wasHit) c.hitT0 = now; c.wasHit = !!st.hit;
  const pr = poseRun(c.ph, run ? 1 : .2), pc = poseCrouch(c.ph), pj = poseJump(jv), ph = poseHit(now - c.hitT0);
  const wj = c.w.j, wc = c.w.c * (1 - wj), wh = c.w.h;
  const p = pr.map((v, i) => { let x = v + wj * (pj[i] - v) + wc * (pc[i] - v); x += wh * (ph[i] - x); return x; });
  /* inertie latérale : le corps s'incline dans les changements de couloir */
  const vx = c.lcx == null ? 0 : (cx - c.lcx) / dt * 1000 / Math.max(1, u); c.lcx = cx; c.vx += (clamp(vx, -3, 3) - c.vx) * k(10);
  p[17] += -c.vx * .09; p[15] += -c.vx * .05; p[10] += Math.abs(c.vx) * .02;
  applyPose(c.h, p); c.h.root.rotation.y = PI + clamp(c.vx * .22, -.4, .4);
  const red = clamp(wh, 0, 1) * .2;
  if(c.fille) c.mats[0].color.setRGB(1, 1 - red * 1.8, 1 - red * 1.8);
  else c.mats.forEach(m => { if(m.emissive){ if(m === c.h.M.vest) return; m.emissive.setRGB(red, red * .08, red * .06); } });
  /* respiration/souplesse quand le jeu est en pause */
  if(!run) c.h.chest.scale.y = 1 + .012 * Math.sin(now / 500);
}
function lod(h, px){ const on = px >= 120; if(h._lod === on) return; h._lod = on; h.face.forEach(f => f.visible = on); }

/* ── dessin dans un contexte 2D existant ── */
function draw(X, kind, cx, gy, u, now, o){
  if(R.off) return false; if(!R.ready && !init()) return false;
  const C = CFG[kind]; if(!C) return false;
  if(R.want && R.want !== R.theme) setTheme(R.want);
  o = o || {}; const wd = C.Fu * u; if(wd < 12) return false;
  const dpr = o.dpr || 1, px = clamp(Math.round(wd * dpr), 40, R.BUF), t0 = performance.now();
  fit(kind);
  let m, h;
  if(kind === 'runner'){ const c = ctlFor(o.key || 'main', o.who); m = c.o; if(o.freeze != null) c.ph = o.freeze; runnerUpdate(c, o.freeze != null ? c.last == null ? now : c.last + 1 : now, cx, o, u); h = c.h; }
  else {
    m = getModel(kind);
    const ph = now / 95 + (o.seed || 0) * 1.7;
    if(kind === 'bandit_debout' || kind === 'bandit_saut'){
      h = m.h; const leap = kind === 'bandit_saut';
      applyPose(h, leap ? poseLeap(now) : poseStand(now + (o.seed || 0) * 400));
      h.root.position.y = leap ? .62 + .05 * Math.sin(now / 160) : 0; h.root.rotation.set(0, .22, leap ? -.12 : 0); h.root.rotation.x = leap ? .12 : 0;
    } else if(kind === 'chien' || kind === 'taureau' || kind === 'cochon'){
      m.a.update(now, ph * (kind === 'taureau' ? .8 : kind === 'cochon' ? .75 : 1.1)); m.root.rotation.y = .5; m.root.rotation.x = 0;
    } else if(kind === 'serpent_sol'){ snakeGround(m.a, now + (o.seed || 0) * 300); m.root.rotation.y = -.35; }
    else if(kind === 'serpent_arbre'){ snakeHang(m.a, now); m.root.rotation.y = 0; }
    else if(kind === 'scorpion'){ updScorpion(m.a, now); m.root.rotation.y = .5; m.root.scale.setScalar(1.0); m.root.position.y = 0; }
    else if(kind === 'abeilles'){ updBees(m.a, now + (o.seed || 0) * 700); }
  }
  if(h) lod(h, px);
  /* caméra et région de rendu */
  const p = C.pitch; camera.position.set(0, C.ty + C.D * Math.sin(p), C.D * Math.cos(p)); camera.lookAt(0, C.ty, 0);
  camera.updateMatrixWorld(true);
  for(const k in R.models) if(R.models[k] && R.models[k].root) R.models[k].root.visible = false;
  for(const k in R.ctl) R.ctl[k].o.root.visible = false;
  m.root.visible = true;
  renderer.setViewport(0, 0, px, px); renderer.setScissor(0, 0, px, px); renderer.setScissorTest(true);
  renderer.clear(true, true, false); renderer.render(scene, camera);
  X.drawImage(canvas, 0, R.BUF - px, px, px, cx - wd / 2, gy - wd * .89, wd, wd);
  R.acc += performance.now() - t0; return true;
}
function frameStart(th){ R.acc = 0; R.want = th; }
function frameEnd(){
  if(!R.ready || window.__Z3D_FORCE) return;
  R.ema = R.ema * .94 + R.acc * .06;
  const lim = R.tier === 'high' ? 11 : 15;
  if(R.ema > lim) R.slow++; else R.slow = Math.max(0, R.slow - 2);
  if(R.slow > 150){
    R.slow = 0; R.ema = 0;
    if(R.tier === 'high'){ R.tier = 'mid'; R.BUF = 320; }
    else R.off = true;
  }
}
function warm(){ if(R.off) return; if(!R.ready && !init()) return; const ks = Object.keys(CFG).filter(k => k !== 'runner'); let i = 0; (function step(){ if(i === 0) ctlFor('main'); else if(i <= ks.length) getModel(ks[i - 1]); else return; i++; setTimeout(step, 30); })(); }

window.Z3D = { loadWho, whoReady, R, init, draw, setTheme, frameStart, frameEnd, warm, CFG, THREE: T, getModel, ctlFor, fit };
