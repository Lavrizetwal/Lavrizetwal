import * as T from 'three';
import { PI, clamp, mix } from './util.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { rigFromMesh, SPEC_FILLE1 } from './rig.js';
import { installRoad } from './road3d.js';
import { buildHuman, applyPose, poseRun, poseCrouch, poseSlide, poseJump, poseHit, poseStand, poseLeap } from './human.js';
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

/* ── créatures-obstacles : modèles GLB du bestiaire (sans squelette → animation par le code) ── */
const CRE = {
  tigre:{ f:'tigre', Fu:2.1, an:'walk' }, crocodile:{ f:'crocodile', Fu:3.3, an:'crawl' }, araignee_noire:{ f:'araignee-noire', Fu:1.8, an:'scuttle' },
  serpent:{ f:'serpent', Fu:1.6, an:'coil' }, araignee_monstre:{ f:'araignee-monstre', Fu:2.0, an:'hang', lift:1.2, thread:1 },
  loup:{ f:'loup', Fu:1.95, an:'walk' }, grand_loup:{ f:'grand-loup', Fu:2.1, an:'walk' }, ours:{ f:'ours', Fu:2.2, an:'stomp' },
  bandit_homme:{ f:'bandit-homme', Fu:1.85, hu:1 }, bandit_femme:{ f:'bandit-femme', Fu:1.75, hu:1 }, colosse:{ f:'colosse', Fu:2.5, hu:1, wide:1.3 },
  zombie:{ f:'zombie', Fu:1.85, hu:1, an:'zomb' }, dimon:{ f:'dimon', Fu:2.0, an:'fly', lift:1.0 }, manon_fire:{ f:'manon-fire', Fu:2.7, an:'stomp' },
  roi_scorpion:{ f:'roi-scorpion', Fu:2.7, an:'scuttle' }, ver_geant:{ f:'ver-geant', Fu:2.6, an:'worm' },
  /* pièges fixes (modèles de Mike) : ry = orientation, sink = enfoncement dans le sol (unité du modèle), pas d'animation */
  tronc_deracine:{ lit:.4, f:'tronc-deracine', Fu:2.7, an:'none', ry:Math.PI / 2 }, pont_casse:{ f:'pont-casse', Fu:6, an:'none', ry:Math.PI / 2, sink:.17 },
  pont_gele:{ f:'pont-gele', Fu:6, an:'none', ry:Math.PI / 2, sink:.15 }, pont_metal:{ f:'pont-metal', Fu:6, an:'none', ry:Math.PI / 2, sink:.125 },
  rocher:{ lit:.4, f:'rocher', Fu:2.5, an:'none', ry:Math.PI / 2 }, rocher_lave:{ lit:.55, f:'rocher-lave', Fu:2.6, an:'none', ry:.4 }, eboulis:{ lit:.55, f:'eboulis', Fu:2.6, an:'none', ry:0 },
  scie:{ lit:.35, f:'scie', Fu:2.3, an:'none', ry:0 }, barricade:{ lit:.5, f:'barricade', Fu:2.4, an:'none', ry:0 }, piege_pointes:{ f:'piege-pointes', Fu:2.6, an:'none', ry:Math.PI / 2 },
  camion:{ f:'camion', Fu:4.4, an:'none', ry:0 },
  /* boss de fin de route (un par destination) : placés par road3d devant le coureur */
  boss_yeti:{ f:'yeti', lit:.55, Fu:7.5, an:'stomp', ry:0 }, boss_croco_geant:{ f:'croco-geant', lit:.55, Fu:12, an:'crawl', ry:0 }, boss_cerbere:{ f:'cerbere', lit:.55, Fu:9.5, an:'walk', ry:0 },
  boss_dragon:{ f:'dragon', lit:.55, Fu:11, an:'fly', ry:0, lift:2 }, boss_roi_sables:{ f:'roi-sables', lit:.55, Fu:8, an:'stomp', ry:0 }
};
for(const k in CRE){ CFG[k] = CFG[k] || (CRE[k].hu ? { Fm: 2.4, Fu: CRE[k].Fu, pitch: .2 } : { Fm: 1.25, Fu: CRE[k].Fu, pitch: .22 }); }
R.creS = {}; R.creMesh = {};
function loadCre(k, cb){
  const cf = CRE[k]; if(!cf) return; if(R.creS[k]){ if(cb) (R.creS[k] === 2 ? cb(true) : (R.creW = R.creW || []).push(cb)); return; } R.creS[k] = 1;
  const done = ok => { R.creS[k] = ok ? 2 : 3; if(cb) cb(ok); };
  try{ new GLTFLoader().load('bestiaire/' + cf.f + '.glb?v=2', g => {
    try{
      let m;
      if(cf.hu){ let mesh; g.scene.traverse(n => { if(n.isMesh && !mesh) mesh = n; }); R.creMesh[k] = mesh; const h = rigFromMesh(mesh, SPEC_FILLE1); m = { root: h.root, h }; }
      else {
        const obj = g.scene; if(cf.lit) obj.traverse(n => { if(n.isMesh && n.material && n.material.map){ n.material.emissive = new T.Color(0xffffff); n.material.emissiveMap = n.material.map; n.material.emissiveIntensity = cf.lit; } }); const bb = new T.Box3().setFromObject(obj), sz = bb.getSize(new T.Vector3()), c = bb.getCenter(new T.Vector3()), sc = 1 / Math.max(sz.x, sz.y, sz.z);
        obj.scale.setScalar(sc); obj.position.set(-c.x * sc, -bb.min.y * sc, -c.z * sc);
        const pv = new T.Group(); pv.add(obj); const root = new T.Group(); root.add(pv); m = { root, pv };
      }
      R.models[k] = reg(m); done(true);
    }catch(e){ done(false); }
  }, undefined, () => done(false)); }catch(e){ done(false); }
}
function preload(list){ list.forEach(k => { if(CRE[k]) loadCre(k); }); }
function creAnim(m, cf, now, seed){
  const t = now + seed * 400, r = m.root;
  if(cf.hu){
    applyPose(m.h, poseStand(cf.an === 'zomb' ? t * .55 : t)); r.rotation.set(0, .15, cf.an === 'zomb' ? .08 * Math.sin(now / 420) : 0);
    r.position.y = 0; if(cf.wide) r.scale.set(cf.wide, 1.04, cf.wide); return;
  }
  const pv = m.pv; pv.rotation.set(0, 0, 0); r.position.set(0, -(cf.sink || 0), 0); r.rotation.set(0, cf.ry != null ? cf.ry : .3, 0); r.scale.setScalar(1);
  const a = cf.an;
  if(a === 'walk'){ const ph = t / 190; r.position.y = Math.abs(Math.sin(ph)) * .035; pv.rotation.z = Math.sin(ph) * .05; pv.rotation.x = Math.sin(ph * 2) * .035; }
  else if(a === 'stomp'){ const ph = t / 330; r.position.y = Math.abs(Math.sin(ph)) * .03; pv.rotation.z = Math.sin(ph) * .07; r.scale.setScalar(1 + .012 * Math.sin(ph * 2)); }
  else if(a === 'crawl'){ r.rotation.y = .3 + Math.sin(t / 300) * .22; r.position.x = Math.sin(t / 300) * .03; }
  else if(a === 'scuttle'){ r.rotation.y = .3 + Math.sin(t / 90) * .06; r.position.x = Math.sin(t / 70) * .012; r.position.y = Math.abs(Math.sin(t / 60)) * .012; }
  else if(a === 'coil'){ r.rotation.y = .3 + Math.sin(t / 500) * .35; pv.scale.y = 1 + .06 * Math.sin(t / 380); }
  else if(a === 'worm'){ r.position.y = .06 * (1 + Math.sin(t / 340)); pv.rotation.x = Math.sin(t / 340) * .1; pv.rotation.z = Math.sin(t / 560) * .05; }
  else if(a === 'fly'){ r.position.y = .1 * Math.sin(t / 250); pv.rotation.z = Math.sin(t / 170) * .16; pv.scale.x = 1 + .07 * Math.sin(t / 105); }
  else if(a === 'hang'){ pv.rotation.z = Math.sin(t / 520) * .1; r.position.y = .03 * Math.sin(t / 380); }
}

const WHO = { fille1: { url: 'models/fille1.glb?v=2', state: 0, cbs: [], gltf: null, spec: SPEC_FILLE1 } };
function loadWho(name, cb){
  const w = WHO[name]; if(!w){ cb && cb(false); return; }
  if(w.state === 2){ cb && cb(true); return; } if(w.state === 3){ cb && cb(false); return; }
  w.cbs.push(cb); if(w.state === 1) return; w.state = 1;
  try{ new GLTFLoader().load(w.url, g => { w.gltf = g; w.state = 2; w.cbs.forEach(f => f && f(true)); w.cbs = []; }, undefined, () => { w.state = 3; w.cbs.forEach(f => f && f(false)); w.cbs = []; }); }
  catch(e){ w.state = 3; w.cbs.forEach(f => f && f(false)); }
}
/* ajoute un coureur depuis runners.json : modèle GLB humanoïde en T-pose, proportions par défaut = SPEC_FILLE1 (ajustables champ par champ) */
function registerWho(id, url, spec){
  if(!id || id === 'man' || !url) return false;
  if(WHO[id]){ if(spec) Object.assign(WHO[id].spec, spec); return true; }
  WHO[id] = { url: url, state: 0, cbs: [], gltf: null, spec: Object.assign({}, SPEC_FILLE1, spec || {}) }; return true;
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
  const pr = poseRun(c.ph, run ? 1 : .2), pc = poseSlide(c.ph), pj = poseJump(jv), ph = poseHit(now - c.hitT0);
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
  else if(CRE[kind]){
    m = R.models[kind]; if(!m){ loadCre(kind); return false; }
    creAnim(m, CRE[kind], now, o.seed || 0); h = m.h;
  } else {
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
  const cf = CRE[kind];
  if(cf){
    X.save(); X.fillStyle = 'rgba(0,0,0,.30)'; X.beginPath(); X.ellipse(cx, gy, wd * .30, Math.max(2, wd * .06), 0, 0, 6.2832); X.fill(); X.restore();
    if(cf.lift){ gy -= cf.lift * u; if(cf.thread){ X.save(); X.strokeStyle = 'rgba(230,230,225,.55)'; X.lineWidth = Math.max(1, u * .02); X.beginPath(); X.moveTo(cx, gy - wd * .6); X.lineTo(cx, gy - u * 4.2); X.stroke(); X.restore(); } }
  }
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

/* arbres GLB du bord de route (models/trees/arbreN.glb, ~3 500 à 6 000 triangles) : géométrie normalisée, pied à y = 0, centrée */
const TR = {};
function treeGet(id){ const t = TR[id]; return t && t.state === 2 ? t : null; }
function treeLoad(ids, cb){
  ids.forEach(id => {
    if(TR[id]) return; const t = TR[id] = { state: 1 };
    try{ new GLTFLoader().load('models/trees/' + id + '.glb?v=1', g => {
      try{ let mesh; g.scene.updateMatrixWorld(true); g.scene.traverse(n => { if(n.isMesh && !mesh) mesh = n; });
        const geo = mesh.geometry.clone(); geo.applyMatrix4(mesh.matrixWorld); geo.computeBoundingBox(); const bb = geo.boundingBox;
        geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
        const mat = mesh.material.clone(); mat.roughness = 1; mat.metalness = 0;
        t.geo = geo; t.mat = mat; t.w = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z); t.h = bb.max.y - bb.min.y; t.state = 2; cb && cb();
      }catch(e){ t.state = 3; }
    }, undefined, () => { t.state = 3; }); }catch(e){ t.state = 3; }
  });
}
window.Z3D = { road: null, makeRoad(){ return this.road || (this.road = installRoad({ R, CRE, loadCre, creAnim, ctlFor, runnerUpdate, rigFromMesh, SPEC_FILLE1, init, treeGet, treeLoad })); }, preload, creKinds: Object.keys(CRE), registerWho, loadWho, whoReady, R, init, draw, setTheme, frameStart, frameEnd, warm, CFG, THREE: T, getModel, ctlFor, fit, GLTFLoader };
