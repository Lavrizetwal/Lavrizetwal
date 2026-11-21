/* Route 3D réelle : vrais coudes à 90°, caméra qui suit le tracé, créatures et coureur posés sur la route.
   Second moteur WebGL (canvas hors écran) recopié sous l'interface 2D ; le moteur de jeu (temps, journal, serveur) n'est pas touché :
   tout est calculé à partir de l'instant de course « now » (ms) et de la vitesse fixe VEL (m/s). */
import * as T from 'three';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import { buildHuman, applyPose, poseStand, poseLeap } from './human.js';
import { buildDog, buildBull, buildPig, buildSnake, snakeGround, snakeHang, buildScorpion, updScorpion, buildBees, updBees } from './animals.js';

const LW = 2.4, ROADW = 7.6, VEL = 16, RAD = 7, ARM = 60, CH = 48;
const ARC = RAD * Math.PI / 2;
const ENV = {
  jungle: { fog: 0x8fb08a, gnd: 0x2c5a2a, sun: 0xfff2cf, si: 2.6, sky: 0xc4e8ff, hg: 0x2d5c2c, hi: 1.1, prop: 'tree', pc: [0x2a6a30, 0x3f8a3a, 0x1f5524] },
  glace: { fog: 0xc9d8e6, gnd: 0xdce6f0, sun: 0xf3f6ff, si: 2.7, sky: 0xa5bde6, hg: 0x8a98ac, hi: 1.1, prop: 'pine', pc: [0x3a6a58, 0x2c5546, 0xe8f0f8] },
  ruines: { fog: 0x9a8f9c, gnd: 0x4a4540, sun: 0xffb27a, si: 2.4, sky: 0x7d6a9a, hg: 0x3a2a30, hi: .9, prop: 'pillar', pc: [0x8a8478, 0x6a655c, 0x9c968a] },
  volcan: { fog: 0x6e3a2a, gnd: 0x2a1a16, sun: 0xff8a4a, si: 2.4, sky: 0x7a3a2a, hg: 0x3a1a10, hi: .95, prop: 'rock', pc: [0x3a2a26, 0x55372a, 0x2a1d1a] },
  desert: { fog: 0xe2c394, gnd: 0xc9a36a, sun: 0xffe2b0, si: 3.0, sky: 0xcfe0f0, hg: 0xa8864e, hi: 1.1, prop: 'rock', pc: [0xb08a5a, 0x9c7a4c, 0xc4a070] },
  ville: { fog: 0x8d7aa0, gnd: 0x2a3a2a, sun: 0xffb27a, si: 2.6, sky: 0x7d6a9a, hg: 0x3a2a30, hi: .9, prop: 'pillar', pc: [0x6a6a78, 0x585866, 0x7a7a88] },
  foret: { fog: 0x9cc8a0, gnd: 0x2d5c2c, sun: 0xfff2cf, si: 2.8, sky: 0xc4e8ff, hg: 0x2d5c2c, hi: 1.1, prop: 'tree', pc: [0x2a6a30, 0x3f8a3a, 0x1f5524] },
  montagne: { fog: 0xb4c4dc, gnd: 0x5a5a60, sun: 0xf3f6ff, si: 2.7, sky: 0xa5bde6, hg: 0x5a5a60, hi: 1.0, prop: 'rock', pc: [0x6a6a72, 0x585860, 0x8a8a92] }
};
const ROADTEX = { jungle: 'road-jungle', glace: 'road-glace', ruines: 'road-ruines', volcan: 'road-volcan', desert: 'road-desert', ville: 'route-ville', foret: 'route-foret', montagne: 'route-montagne' };
const SKYTEX = { jungle: 1, glace: 1, ruines: 1, volcan: 1, desert: 1 };
const hash = n => { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0) / 4294967296; };
const PROP = {
  tree: () => new T.ConeGeometry(1.7, 6, 7), pine: () => new T.ConeGeometry(1.5, 7, 7), pillar: () => new T.BoxGeometry(1.2, 4, 1.2), rock: () => new T.DodecahedronGeometry(1.6, 0)
};
const WIDEK = { trou: 1, fil_elec: 1, branche: 1, tronc: 1, bandit_saut: 1 };

export function installRoad(X){
  const { R, CRE, loadCre, creAnim, ctlFor, runnerUpdate, rigFromMesh, SPEC_FILLE1 } = X;
  const S = { ok: false, rd: null, sc: null, cam: null, W: 0, H: 0, th: '', objs: new Map(), pool: {}, texC: {}, gantry: new Map(), slow: 0, ema: 0, sig: '', path: null, win: -1e9, forks: [], fkJ: {} };

  function init(){
    if(S.ok) return true; if(R.off || S.lost) return false; if(!R.ready && !X.init()) return false;
    try{
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 64;
      const rd = new T.WebGLRenderer({ canvas, alpha: false, antialias: R.tier === 'high', powerPreference: 'high-performance', preserveDrawingBuffer: false });
      rd.outputColorSpace = T.SRGBColorSpace; rd.toneMapping = T.ACESFilmicToneMapping; rd.toneMappingExposure = 1.1;
      canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); S.ok = false; S.lost = true; });
      const sc = new T.Scene(); sc.fog = new T.Fog(0x9cb0c8, 22, 62);
      const cam = new T.PerspectiveCamera(60, 1, .15, 520);
      S.hemi = new T.HemisphereLight(0xffffff, 0x444444, 1); sc.add(S.hemi);
      S.sun = new T.DirectionalLight(0xffffff, 2.5); S.sun.position.set(-8, 14, 6); sc.add(S.sun); sc.add(S.sun.target);
      S.gnd = new T.Mesh(new T.PlaneGeometry(1600, 1600), new T.MeshStandardMaterial({ color: 0x335533, roughness: 1, metalness: 0 })); S.gnd.rotation.x = -Math.PI / 2; S.gnd.position.y = -.02; sc.add(S.gnd);
      S.sky = new T.Mesh(new T.CylinderGeometry(420, 420, 300, 40, 1, true), new T.MeshBasicMaterial({ side: T.BackSide, fog: false, depthWrite: false })); S.sky.position.y = 120; sc.add(S.sky);
      S.roadG = new T.Group(); sc.add(S.roadG); S.propG = new T.Group(); sc.add(S.propG); S.objG = new T.Group(); sc.add(S.objG); S.gantG = new T.Group(); sc.add(S.gantG);
      S.rd = rd; S.sc = sc; S.cam = cam; S.canvas = canvas; S.ok = true;
    }catch(e){ S.ok = false; S.lost = true; }
    return S.ok;
  }
  function tex(name){
    if(S.texC[name]) return S.texC[name];
    const t = new T.TextureLoader().load('textures/' + name + '.jpg?v=1'); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4; t.wrapS = T.RepeatWrapping; t.wrapT = T.RepeatWrapping; return (S.texC[name] = t);
  }

  /* ── tracé : droites + quarts de cercle (cap h : avant = (sin h, −cos h), droite = (cos h, sin h)) ── */
  function buildPath(corners){
    const segs = []; let x = 0, z = 0, h = 0, s = 0;
    corners.forEach(c => {
      if(c.s0 > s){ segs.push({ t: 0, s0: s, len: c.s0 - s, x, z, h }); x += Math.sin(h) * (c.s0 - s); z -= Math.cos(h) * (c.s0 - s); s = c.s0; }
      if(c.dir){
        segs.push({ t: 1, s0: s, len: ARC, x, z, h, d: c.dir });
        const cx = x + c.dir * RAD * Math.cos(h), cz = z + c.dir * RAD * Math.sin(h), h2 = h + c.dir * Math.PI / 2;
        x = cx - c.dir * RAD * Math.cos(h2); z = cz - c.dir * RAD * Math.sin(h2); h = h2; s += ARC;
      }
    });
    segs.push({ t: 0, s0: s, len: 1e9, x, z, h });
    return segs;
  }
  function posAt(P, s, lat, o){
    let g = P[P.length - 1]; for(let i = 0; i < P.length; i++){ if(s < P[i].s0 + P[i].len){ g = P[i]; break; } }
    let x, z, h;
    if(g.t === 0){ const u = (g === P[0] ? s : Math.max(0, s)) - g.s0; h = g.h; x = g.x + Math.sin(h) * u; z = g.z - Math.cos(h) * u; }
    else { const a = Math.max(0, s - g.s0) / RAD; h = g.h + g.d * a; const cx = g.x + g.d * RAD * Math.cos(g.h), cz = g.z + g.d * RAD * Math.sin(g.h); x = cx - g.d * RAD * Math.cos(h); z = cz - g.d * RAD * Math.sin(h); }
    o.x = x + Math.cos(h) * lat; o.z = z + Math.sin(h) * lat; o.h = h; return o;
  }
  const _o = { x: 0, z: 0, h: 0 };
  function at(s, lat){ return posAt(S.path, s, lat, _o); }

  function ribbon(s0, s1, step, mat, y){
    const n = Math.max(2, Math.ceil((s1 - s0) / step)) + 1, pos = new Float32Array(n * 6), uv = new Float32Array(n * 4), idx = []; const o = { x: 0, z: 0, h: 0 };
    for(let i = 0; i < n; i++){
      const s = Math.min(s1, s0 + i * step);
      posAt(S.path, s, -ROADW / 2, o); pos.set([o.x, y, o.z], i * 6); posAt(S.path, s, ROADW / 2, o); pos.set([o.x, y, o.z], i * 6 + 3);
      uv.set([0, s / ROADW, 1, s / ROADW], i * 4);
      if(i < n - 1){ const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('uv', new T.BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    return new T.Mesh(g, mat);
  }
  function armMesh(jx, jz, hh, mat){   /* bras de carrefour : rectangle qui part du centre J dans la direction hh */
    const L = ARM + ROADW / 2, m = new T.Mesh(new T.PlaneGeometry(ROADW, L), mat); m.rotation.x = -Math.PI / 2;
    const uvs = m.geometry.attributes.uv; for(let i = 0; i < uvs.count; i++) uvs.setY(i, uvs.getY(i) * L / ROADW);
    const hd = new T.Group(); hd.add(m); m.position.set(0, 0, -(ARM - ROADW / 2) / 2); hd.position.set(jx, .008, jz); hd.rotation.y = -hh; return hd;
  }
  function clearGroup(g){ while(g.children.length){ const c = g.children.pop(); c.traverse(n => { if(n.geometry && !n.userData.keep) n.geometry.dispose(); }); } }

  function rebuild(th, sr){
    const env = ENV[th] || ENV.jungle, a0 = Math.floor(sr / CH) * CH - CH, a1 = a0 + CH * 4;
    S.win = a0; clearGroup(S.roadG); clearGroup(S.propG); S.gantry.forEach(g => S.gantG.remove(g)); S.gantry.clear();
    const mat = new T.MeshStandardMaterial({ map: tex(ROADTEX[th] || 'road-jungle'), roughness: .95, metalness: 0 });
    S.roadG.add(ribbon(Math.max(-30, a0), a1, 2, mat, .02));
    S.forks.forEach(f => { const J = f.Jc; if(!J) return; const sJ = VEL * f.tb / 1000; if(sJ < a0 - 20 || sJ > a1 + 20) return; [J.h, J.h - Math.PI / 2, J.h + Math.PI / 2].forEach(hh => S.roadG.add(armMesh(J.x, J.z, hh, mat))); });
    /* décor : une paire d'éléments par cellule de 9 m, graine = numéro de cellule (même décor à chaque passage) */
    const cnt = 150, geo = PROP[env.prop](), pm = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true });
    const withTrunk = env.prop === 'tree' || env.prop === 'pine', im = new T.InstancedMesh(geo, pm, cnt);
    const tr = new T.InstancedMesh(new T.CylinderGeometry(.25, .3, 1.8, 6), new T.MeshStandardMaterial({ color: 0x5a3b24, roughness: 1 }), withTrunk ? cnt : 1);
    const m4 = new T.Matrix4(), col = new T.Color(), q = new T.Quaternion(), e = new T.Euler(), v = new T.Vector3(), sv = new T.Vector3(); let k = 0;
    for(let c = Math.floor(a0 / 9); c < Math.ceil(a1 / 9) && k < cnt - 1; c++){
      for(let sd = -1; sd <= 1; sd += 2){
        const r1 = hash(c * 7 + (sd + 3) * 131), r2 = hash(c * 13 + (sd + 5) * 71), r3 = hash(c * 29 + (sd + 7) * 17);
        if(r1 < .18) continue;
        const p = at(c * 9 + r2 * 9, sd * (ROADW / 2 + 3 + r3 * 20));
        let bad = false; S.forks.forEach(f => { const J = f.Jc; if(!J) return; const dx = p.x - J.x, dz = p.z - J.z; if(Math.hypot(dx, dz) < ARM + 6){ const lx = Math.abs(dx * Math.cos(J.h) + dz * Math.sin(J.h)), lz = Math.abs(dx * Math.sin(J.h) - dz * Math.cos(J.h)); if(lx < ROADW / 2 + 3 || lz < ROADW / 2 + 3) bad = true; } });
        if(bad) continue;
        const sc = .8 + r1 * 1.1, hgt = env.prop === 'rock' ? .4 * sc : env.prop === 'pillar' ? 2 * sc : 1.8 + 3 * sc;
        e.set(0, r2 * 6.28, 0); q.setFromEuler(e); v.set(p.x, hgt, p.z); sv.set(sc, sc * (env.prop === 'pillar' ? 1 + r3 : 1), sc); m4.compose(v, q, sv); im.setMatrixAt(k, m4);
        col.setHex(env.pc[Math.floor(r3 * env.pc.length) % env.pc.length]); im.setColorAt(k, col);
        if(withTrunk){ v.set(p.x, .9 * sc, p.z); sv.set(sc, sc, sc); m4.compose(v, q, sv); tr.setMatrixAt(k, m4); }
        k++;
      }
    }
    im.count = k; im.instanceMatrix.needsUpdate = true; if(im.instanceColor) im.instanceColor.needsUpdate = true; S.propG.add(im);
    if(withTrunk){ tr.count = k; tr.instanceMatrix.needsUpdate = true; S.propG.add(tr); }
  }

  function setTheme(th){
    if(S.th === th) return; S.th = th; const e = ENV[th] || ENV.jungle;
    S.sc.fog.color.setHex(e.fog); S.sc.background = new T.Color(e.fog); S.gnd.material.color.setHex(e.gnd);
    S.sun.color.setHex(e.sun); S.sun.intensity = e.si; S.hemi.color.setHex(e.sky); S.hemi.groundColor.setHex(e.hg); S.hemi.intensity = e.hi;
    if(SKYTEX[th]){ const sk = tex('sky-' + th); sk.wrapS = T.MirroredRepeatWrapping; sk.repeat.set(2, 1); S.sky.material.map = sk; S.sky.material.color.setHex(0xffffff); }
    else { S.sky.material.map = null; S.sky.material.color.setHex(e.sky); }
    S.sky.material.needsUpdate = true; S.win = -1e9;
  }

  /* ── objets ── */
  const std = (c, o) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: .85, metalness: 0 }, o || {}));
  const bx = (m, w, h, d, x, y, z) => { const o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); return o; };
  function proc(kind, w){
    const g = new T.Group(), r = { upd: null };
    if(kind === 'trou'){ const d = new T.Mesh(new T.CircleGeometry(w * .46, 28), new T.MeshBasicMaterial({ color: 0x050403 })); d.rotation.x = -Math.PI / 2; d.position.y = .035; g.add(d); const rm = new T.Mesh(new T.RingGeometry(w * .46, w * .5, 28), std(0x3a2a1a)); rm.rotation.x = -Math.PI / 2; rm.position.y = .036; g.add(rm); r.flat = 1; }
    else if(kind === 'feu'){ const fl = []; for(let i = 0; i < 3; i++){ const c = new T.Mesh(new T.ConeGeometry(.5, 1.5, 7), new T.MeshBasicMaterial({ color: i === 1 ? 0xffab00 : 0xe65100 })); c.position.set((i - 1) * .7, .75, 0); g.add(c); fl.push(c); } r.upd = t => fl.forEach((c, i) => c.scale.set(1, .85 + .25 * Math.sin(t / 90 + i * 2), 1)); }
    else if(kind === 'fil_elec'){ const pm = std(0x5a3b22); [-1, 1].forEach(s => g.add(bx(pm, .25, 3.2, .25, s * w / 2, 1.6, 0))); g.add(bx(std(0x111111), w, .08, .08, 0, 2.3, 0)); const sp = new T.Mesh(new T.BoxGeometry(w * .8, .18, .18), new T.MeshBasicMaterial({ color: 0xffee58 })); sp.position.y = 1.2; g.add(sp); r.upd = t => { sp.visible = (Math.floor(t / 60) & 1) === 0; sp.position.y = .5 + (Math.floor(t / 70) % 3) * .45; }; }
    else if(kind === 'voiture'){ g.add(bx(std(0xb23a48), 2, .8, 3.6, 0, .75, 0)); g.add(bx(std(0x8f2c39), 1.7, .7, 1.8, 0, 1.4, -.1)); [-1, 1].forEach(sx => [-1.2, 1.2].forEach(zz => { const wl = new T.Mesh(new T.CylinderGeometry(.38, .38, .3, 12), std(0x111111)); wl.rotation.z = Math.PI / 2; wl.position.set(sx * 1, .38, zz); g.add(wl); })); }
    else if(kind === 'branche'){ const pm = std(0x5a3b22), lm = std(0x2e8b3a); [-1, 1].forEach(s => g.add(bx(pm, .25, 1.8, .25, s * w / 2, .9, 0))); for(let i = 0; i < 6; i++){ const l = new T.Mesh(new T.IcosahedronGeometry(.75, 0), lm); l.position.set(-w / 2 + (i + .5) * w / 6, 1.45, 0); l.scale.set(1.2, .7, .9); g.add(l); } }
    else if(kind === 'tronc'){ const c = new T.Mesh(new T.CylinderGeometry(.42, .42, w, 14), std(0x6d4c2a)); c.rotation.z = Math.PI / 2; c.position.y = .42; g.add(c); }
    else if(kind === 'eboulement'){ [0, 1, 2].forEach(i => { const rk = new T.Mesh(new T.DodecahedronGeometry(.6 + (i === 1 ? .35 : 0), 0), std([0x7b7a72, 0x8f8d82, 0x65645e][i], { flatShading: true })); rk.position.set((i - 1) * .75, .5, i === 1 ? .2 : 0); g.add(rk); }); }
    else if(kind === 'abeilles'){ const b = buildBees(); g.add(b.root); r.upd = t => updBees(b, t); }
    else if(kind === 'bandit_debout' || kind === 'bandit_saut'){ const h = buildHuman('bandit'); g.add(h.root); const lp = kind === 'bandit_saut'; r.upd = t => { applyPose(h, lp ? poseLeap(t) : poseStand(t)); h.root.position.y = lp ? .62 + .05 * Math.sin(t / 160) : 0; }; }
    else if(kind === 'chien'){ const a = buildDog(); g.add(a.root); r.upd = t => a.update(t, t / 95 * 1.1); }
    else if(kind === 'taureau'){ const a = buildBull(); g.add(a.root); r.upd = t => a.update(t, t / 95 * .8); }
    else if(kind === 'cochon'){ const a = buildPig(); g.add(a.root); r.upd = t => a.update(t, t / 95 * .75); }
    else if(kind === 'serpent_sol'){ const a = buildSnake(); g.add(a.root); r.upd = t => snakeGround(a, t); }
    else if(kind === 'serpent_arbre'){ const a = buildSnake(); g.add(bx(std(0x5a3b22), .3, 3.4, .3, 0, 1.7, 0)); const cn = new T.Mesh(new T.IcosahedronGeometry(1.1, 0), std(0x1f6b2b)); cn.position.y = 3.5; g.add(cn); a.root.position.set(.2, 1.9, 0); g.add(a.root); r.upd = t => snakeHang(a, t); }
    else if(kind === 'scorpion'){ const a = buildScorpion(); g.add(a.root); r.upd = t => updScorpion(a, t); }
    else if(kind === 'eau'){ const m = new T.Mesh(new T.CylinderGeometry(.22, .22, .7, 12), std(0x59b8ff, { transparent: true, opacity: .88, emissive: 0x1a5a9a, emissiveIntensity: .6 })); m.position.y = .9; g.add(m); r.pick = 1; }
    else if(kind === 'mangue'){ const m = new T.Mesh(new T.SphereGeometry(.3, 14, 10), std(0xffa53a, { emissive: 0xa04a00, emissiveIntensity: .5 })); m.position.y = .9; g.add(m); r.pick = 1; }
    else g.add(bx(std(0x7a2a2a), 1.1, 1.1, 1.1, 0, .55, 0));
    r.g = g; return r;
  }
  function inst(kind, w){
    const pk = kind + '|' + w, pool = S.pool[pk] || (S.pool[pk] = []); let it = pool.pop(); if(it) return it;
    const cf = CRE[kind], grp = new T.Group();
    if(cf){
      const base = R.models[kind]; if(!base){ loadCre(kind); return null; }
      let m;
      if(cf.hu){ const h = rigFromMesh(R.creMesh[kind], SPEC_FILLE1); m = { root: h.root, h }; grp.add(h.root); grp.scale.setScalar(cf.Fu / SPEC_FILLE1.H); }
      else { const obj = skClone(base.pv.children[0]); const pv = new T.Group(); pv.add(obj); const root = new T.Group(); root.add(pv); m = { root, pv }; grp.add(root); grp.scale.setScalar(cf.Fu); }
      it = { grp, m, cf, kind, pk };
    } else { const r = proc(kind, w); grp.add(r.g); it = { grp, m: null, cf: null, kind, pk, r }; }
    const sh = new T.Mesh(new T.CircleGeometry(.9, 18), new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .3, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = .04;
    it.sh = sh; return it;
  }
  function placeObjs(Sx){
    const seen = new Set(), now = Sx.now;
    Sx.items.forEach(e => {
      const kind = e.k, occ = e.occ, wide = !!WIDEK[kind], runs = []; let cur = null;
      for(let l = 0; l < 3; l++){ if(occ & (1 << l)){ if(cur && cur.b === l - 1) cur.b = l; else { cur = { a: l, b: l }; runs.push(cur); } } }
      runs.forEach(r => {
        const ls = wide ? [[(r.a + r.b) / 2, (r.b - r.a + 1) * LW * .94]] : Array.from({ length: r.b - r.a + 1 }, (_, i) => [r.a + i, LW * .9]);
        ls.forEach(([ln, w]) => {
          const key = kind + '@' + e.t + '#' + ln; seen.add(key); let it = S.objs.get(key);
          if(!it){ it = inst(kind, wide ? Math.round(w * 10) / 10 : 0); if(!it) return; S.objs.set(key, it); S.objG.add(it.grp); S.objG.add(it.sh); it.seed = ((e.t / 97) | 0) + ln * 3; }
          const o = at(VEL * e.t / 1000, (ln - 1) * LW);
          it.grp.position.set(o.x, 0, o.z); it.grp.rotation.y = o.h + Math.PI; it.sh.position.set(o.x, .04, o.z);
          if(it.cf){ creAnim(it.m, it.cf, now, it.seed); it.sh.scale.setScalar((it.cf.Fu || 1.6) * .55); it.sh.visible = true; if(it.cf.lift) it.grp.position.y = it.cf.lift * 1.05; }
          else if(it.r){ if(it.r.upd) it.r.upd(now + it.seed * 300); if(it.r.pick){ it.grp.rotation.y = now / 380; it.grp.position.y = .12 * Math.sin(now / 260); } it.sh.visible = !it.r.flat; it.sh.scale.setScalar(wide ? w * .5 : .8); }
        });
      });
    });
    S.objs.forEach((it, key) => { if(!seen.has(key)){ S.objs.delete(key); S.objG.remove(it.grp); S.objG.remove(it.sh); it.grp.position.y = 0; (S.pool[it.pk] || (S.pool[it.pk] = [])).push(it); } });
  }

  /* ── portique de carrefour : trois panneaux au-dessus des voies ── */
  function gantryFor(f){
    let g = S.gantry.get(f.tb); if(g) return g;
    g = new T.Group(); const dm = std(0x2c3340);
    g.add(bx(dm, ROADW + 1.4, .5, .4, 0, 5.4, 0)); [-1, 1].forEach(sd => g.add(bx(dm, .4, 5.6, .4, sd * (ROADW / 2 + .5), 2.8, 0)));
    const arrows = ['↖', '↑', '↗'];
    for(let l = 0; l < 3; l++){
      const cv = document.createElement('canvas'); cv.width = 320; cv.height = 160; const c = cv.getContext('2d');
      c.fillStyle = '#0c6b3f'; c.fillRect(0, 0, 320, 160); c.strokeStyle = '#f4f7f2'; c.lineWidth = 7; c.strokeRect(8, 8, 304, 144);
      c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '700 70px sans-serif'; c.fillText(arrows[l], 160, 78); c.font = '700 40px "Barlow Condensed",Inter,sans-serif'; c.fillText(String(f.labels[l] || '').slice(0, 16), 160, 132, 280);
      const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4;
      const pn = new T.Mesh(new T.PlaneGeometry(LW * .98, LW * .49), new T.MeshBasicMaterial({ map: t })); pn.position.set((l - 1) * LW, 4.3, .22); g.add(pn);
      const bk = new T.Mesh(new T.PlaneGeometry(LW * .98, LW * .49), new T.MeshBasicMaterial({ color: 0x0c6b3f })); bk.position.set((l - 1) * LW, 4.3, -.22); bk.rotation.y = Math.PI; g.add(bk);
    }
    S.gantry.set(f.tb, g); S.gantG.add(g); return g;
  }
  function placeGantries(){
    S.forks.forEach(f => { if(!f.labels) return; const g = gantryFor(f), o = at(VEL * f.tb / 1000 - RAD - 11, 0); g.position.set(o.x, 0, o.z); g.rotation.y = -o.h; });
    S.gantry.forEach((g, tb) => { if(!S.forks.some(f => f.tb === tb)){ S.gantG.remove(g); S.gantry.delete(tb); } });
  }

  /* ── image ── */
  const rp = { x: 0, z: 0 }, cp = { x: 0, z: 0 }, tp = { x: 0, z: 0 };
  function frame(Sx){
    if(!S.ok && !init()) return false;
    const t0 = performance.now();
    const dpr = Math.min(Sx.dpr || 1, R.tier === 'high' ? 1.25 : 1), w = Math.max(64, Math.round(Sx.W * dpr)), h = Math.max(64, Math.round(Sx.H * dpr));
    if(w !== S.W || h !== S.H){ S.W = w; S.H = h; S.rd.setPixelRatio(1); S.rd.setSize(w, h, false); S.cam.aspect = w / h; S.cam.fov = w / h < .9 ? 74 : 60; S.cam.updateProjectionMatrix(); }
    setTheme(Sx.th);
    S.forks = Sx.forks.slice().sort((a, b) => a.tb - b.tb);
    const sig = S.forks.map(f => f.tb + ':' + f.dir + ':' + (f.labels ? f.labels.join('/') : '')).join(';'), sr = VEL * Sx.now / 1000;
    if(sig !== S.sig || !S.path){
      S.sig = sig; S.path = buildPath(S.forks.map(f => ({ s0: VEL * f.tb / 1000 - RAD, dir: f.dir }))); S.fkJ = {};
      S.forks.forEach(f => { const p = posAt(S.path, VEL * f.tb / 1000 - RAD, 0, { x: 0, z: 0, h: 0 }); S.fkJ[f.tb] = { x: p.x + Math.sin(p.h) * RAD, z: p.z - Math.cos(p.h) * RAD, h: p.h }; }); S.win = -1e9;
    }
    S.forks.forEach(f => { f.Jc = S.fkJ[f.tb]; });
    if(S.win < -1e8 || sr < S.win + CH * .6 || sr > S.win + CH * 2.4) rebuild(Sx.th, sr);
    placeGantries(); placeObjs(Sx);
    /* coureur */
    const c = ctlFor('road', Sx.who); if(c.o.root.parent !== S.sc) S.sc.add(c.o.root); c.o.root.visible = true;
    const lat = (Sx.vx - 1) * LW;
    runnerUpdate(c, Sx.now, lat, { speed: Sx.speed, jump: Sx.jump >= 0, jv: Sx.jump, crouch: Sx.crouch, hit: Sx.hit }, 1.2);
    const ro = at(sr, lat); rp.x = ro.x; rp.z = ro.z; const rh = ro.h, jy = Sx.jump >= 0 ? Math.sin(Math.PI * Math.max(0, Math.min(1, Sx.jump))) * 1.15 : 0;
    c.o.root.position.set(rp.x, jy, rp.z); c.o.root.rotation.y = Math.PI - rh;
    S.runnerPos = { x: rp.x, y: jy + 1, z: rp.z };
    /* caméra : derrière le coureur sur le tracé, regarde 9 m devant ; pendant les coudes elle tourne avec la route */
    const cb = at(sr - 5.4, lat * .6); cp.x = cb.x; cp.z = cb.z; const ct = at(sr + 9, lat * .25); tp.x = ct.x; tp.z = ct.z;
    const sk = Sx.shake > 0 ? Sx.shake * .12 : 0, bob = Sx.speed ? Math.sin(Sx.now / 46) * .02 : 0;
    S.cam.position.set(cp.x + (Math.random() - .5) * sk, 3.1 + bob + (Math.random() - .5) * sk, cp.z + (Math.random() - .5) * sk); S.cam.lookAt(tp.x, 1.15, tp.z);
    if(Sx.top){ S.cam.position.set(rp.x, 70, rp.z + 24); S.cam.lookAt(rp.x, 0, rp.z - 16); }
    S.cam.updateMatrixWorld(true);
    S.sky.position.x = S.cam.position.x; S.sky.position.z = S.cam.position.z; S.gnd.position.x = S.cam.position.x; S.gnd.position.z = S.cam.position.z;
    S.rd.render(S.sc, S.cam);
    const dt = performance.now() - t0; S.ema = S.ema * .95 + dt * .05; if(S.ema > (R.tier === 'high' ? 26 : 32)) S.slow++; else S.slow = Math.max(0, S.slow - 2);
    if(S.slow > 240){ S.slow = 0; S.tooSlow = true; }
    return true;
  }
  const pv = new T.Vector3();
  function runnerXY(W, H){ if(!S.runnerPos || !S.cam) return null; pv.set(S.runnerPos.x, S.runnerPos.y, S.runnerPos.z).project(S.cam); return { x: (pv.x * .5 + .5) * W, y: (-pv.y * .5 + .5) * H }; }
  function lanePoint(s, lane, y, W, H){ const o = at(s, (lane - 1) * LW); pv.set(o.x, y, o.z).project(S.cam); return { x: (pv.x * .5 + .5) * W, y: (-pv.y * .5 + .5) * H, z: pv.z }; }

  return { supported(){ return !R.off && !S.lost && !S.tooSlow && R.tier !== 'off'; }, init, frame, runnerXY, lanePoint, get canvas(){ return S.canvas; }, S, VEL, LW,
    reset(){ S.tooSlow = false; S.slow = 0; S.sig = ''; S.win = -1e9; S.objs.forEach(it => { S.objG.remove(it.grp); S.objG.remove(it.sh); }); S.objs.clear(); } };
}
