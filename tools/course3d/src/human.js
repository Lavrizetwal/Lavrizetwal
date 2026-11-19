import * as T from 'three';
import { PI, TAU, clamp, mix, sstep, ell, tube, std, grp, noiseTex, fabricTex, curlTex, zDecal } from './util.js';

export function humanMats(style){
  const bandit = style === 'bandit';
  const sk = noiseTex(bandit ? '#6a4128' : '#80502f', { seed: 21, blots: 40, dots: 3200, rep: [1, 1] });
  const cl = {};
  cl.skin = std('#ffffff', { map: sk, roughness: .58, bumpMap: sk, bumpScale: .4, emissive: '#4a2410', emissiveIntensity: .55 });
  if(!bandit){
    const w = fabricTex('#f3efe4', { cell: 3, tw: .1, rep: [4, 4], seed: 2 });
    cl.shirt = std('#ffffff', { map: w.map, bumpMap: w.bump, bumpScale: .5, roughness: .92 });
    const g = fabricTex('#d3ab38', { cell: 5, tw: .08, diamond: 1, rep: [3, 3], seed: 4 });
    cl.vest = std('#ffffff', { map: g.map, bumpMap: g.bump, bumpScale: .6, roughness: .42, metalness: .22, side: T.DoubleSide, emissive: '#3a2a04', emissiveIntensity: .35 });
    const p = fabricTex('#3563a8', { cell: 4, tw: .22, rep: [4, 5], seed: 7 });
    cl.pants = std('#ffffff', { map: p.map, bumpMap: p.bump, bumpScale: .9, roughness: .88 });
    cl.shoe = std('#4a2d1a', { roughness: .5, metalness: .05 });
  } else {
    const s = fabricTex('#3b3f4e', { cell: 4, tw: .18, rep: [4, 4], seed: 11 });
    cl.shirt = std('#ffffff', { map: s.map, bumpMap: s.bump, bumpScale: .7, roughness: .95 });
    const p = fabricTex('#2a2c36', { cell: 4, tw: .2, rep: [4, 5], seed: 13 });
    cl.pants = std('#ffffff', { map: p.map, bumpMap: p.bump, bumpScale: .8, roughness: .9 });
    const m = fabricTex('#c1221f', { cell: 3, tw: .12, rep: [2, 2], seed: 5 });
    cl.mask = std('#ffffff', { map: m.map, bumpMap: m.bump, bumpScale: .5, roughness: .9, side: T.DoubleSide });
    cl.cap = std('#14151a', { roughness: .85 });
    cl.shoe = std('#101012', { roughness: .6 });
    cl.wood = std('#6b4524', { roughness: .8 });
  }
  const hr = curlTex();
  cl.hair = std('#ffffff', { map: hr.map, bumpMap: hr.bump, bumpScale: 1.4, roughness: .85 });
  cl.eyeW = std('#efe9de', { roughness: .25 });
  cl.iris = std('#1a0f08', { roughness: .2 });
  cl.lip = std(bandit ? '#4a2518' : '#5d3022', { roughness: .45 });
  cl.brow = std('#120c09', { roughness: .9 });
  cl.sole = std('#1d1a17', { roughness: .8 });
  return cl;
}

export function buildHuman(style){
  const M = humanMats(style), bandit = style === 'bandit';
  const root = grp(), hips = grp(); hips.position.y = .95; root.add(hips);
  hips.add(ell(M.pants, .175, .12, .122, 0, 0, 0));
  const spine = grp(); hips.add(spine);
  const legs = [];
  for(const sd of [-1, 1]){
    const th = grp(); th.position.set(sd * .088, -.02, 0); hips.add(th);
    th.add(tube(M.pants, .44, .095, .068, 1, 1.02, .12));
    const kn = grp(); kn.position.y = -.44; th.add(kn);
    kn.add(ell(M.pants, .066, .055, .066, 0, 0, .006));
    kn.add(tube(M.pants, .43, .066, .05, 1, 1, .05));
    const an = grp(); an.position.y = -.43; kn.add(an);
    const cuff = new T.Mesh(new T.TorusGeometry(.046, .007, 6, 14), M.pants); cuff.rotation.x = PI / 2; cuff.position.y = -.005; an.add(cuff);
    an.add(ell(M.skin, .028, .045, .028, 0, .018, 0));
    const ft = grp(); an.add(ft);
    ft.add(ell(M.shoe, .05, .042, .125, 0, -.036, .045));
    ft.add(ell(M.shoe, .044, .036, .05, 0, -.03, .125));
    ft.add(ell(M.shoe, .046, .04, .045, 0, -.02, -.035));
    ft.add(ell(M.sole, .049, .01, .135, 0, -.073, .045));
    legs.push({ th, kn, an, ft });
  }
  const chest = grp(); chest.position.y = .2; spine.add(chest);
  spine.add(ell(M.shirt, .142, .165, .094, 0, .1, 0));
  chest.add(ell(M.shirt, .172, .2, .115, 0, .17, -.002));
  chest.add(ell(M.shirt, .195, .065, .108, 0, .315, 0));
  if(!bandit){
    const vg = new T.SphereGeometry(1, 22, 14, PI / 2 + .42, TAU - .84, 0, PI * .78);
    const vs = new T.Mesh(vg, M.vest); vs.scale.set(.18, .215, .124); vs.position.set(0, .16, -.002); chest.add(vs);
    const vg2 = new T.SphereGeometry(1, 20, 10, PI / 2 + .3, TAU - .6, PI * .12, PI * .55);
    const vb = new T.Mesh(vg2, M.vest); vb.scale.set(.148, .185, .1); vb.position.set(0, .08, 0); spine.add(vb);
    const dz = new T.Mesh(new T.PlaneGeometry(.17, .17), new T.MeshStandardMaterial({ map: zDecal(), transparent: true, roughness: .5, metalness: .2, depthWrite: false, polygonOffsetFactor: -2, polygonOffset: true }));
    dz.position.set(0, .2, -.136); dz.rotation.y = PI; chest.add(dz);
    const co = new T.Mesh(new T.TorusGeometry(.05, .012, 8, 18), M.shirt); co.rotation.x = PI / 2 - .25; co.position.set(0, .385, .002); chest.add(co);
  } else {
    const hood = new T.Mesh(new T.TorusGeometry(.085, .035, 8, 16, PI * 1.4), M.shirt); hood.rotation.set(PI / 2 + .3, 0, PI * .8); hood.position.set(0, .37, -.03); chest.add(hood);
  }
  const neck = grp(); neck.position.y = .4; chest.add(neck);
  const nk = tube(M.skin, .09, .048, .052, 1, 1, .02, 12); nk.position.y = .07; neck.add(nk);
  const head = grp(); head.position.y = .06; head.scale.setScalar(1.1); neck.add(head);
  head.add(ell(M.skin, .086, .112, .098, 0, .11, .004));
  head.add(ell(M.skin, .072, .062, .078, 0, .05, .026));
  head.add(ell(M.skin, .05, .03, .045, 0, .02, .05));
  const face = [];
  const nose = ell(M.skin, .015, .028, .021, 0, .09, .101); head.add(nose); face.push(nose);
  for(const sd of [-1, 1]){
    const nw = ell(M.skin, .011, .011, .013, sd * .015, .071, .098); head.add(nw); face.push(nw);
    const ew = ell(M.eyeW, .0105, .0085, .008, sd * .033, .118, .088); head.add(ew);
    const ir = ell(M.iris, .0055, .0055, .004, sd * .033, .118, .095); head.add(ir);
    const lid = ell(M.skin, .0125, .0075, .0105, sd * .033, .125, .089); head.add(lid);
    const brow = ell(M.brow, .021, .0045, .008, sd * .035, .139, .09); brow.rotation.z = sd * (bandit ? -.38 : -.1); head.add(brow);
    const ear = ell(M.skin, .012, .03, .019, sd * .088, .108, -.004); head.add(ear);
    face.push(ew, ir, lid, brow);
  }
  const lips = ell(M.lip, .027, .0075, .013, 0, .052, .093); head.add(lips); face.push(lips);
  const lip2 = ell(M.lip, .022, .006, .011, 0, .042, .09); head.add(lip2); face.push(lip2);
  const hair = new T.Mesh(new T.SphereGeometry(1, 20, 14, 0, TAU, 0, PI * .6), M.hair); hair.scale.set(.093, .1, .105); hair.position.set(0, .133, -.01); head.add(hair);
  head.add(ell(M.hair, .088, .05, .1, 0, .105, -.012));
  if(bandit){
    const mk = new T.Mesh(new T.SphereGeometry(1, 20, 10, 0, TAU, PI * .5, PI * .38), M.mask); mk.scale.set(.093, .096, .103); mk.position.set(0, .075, .004); head.add(mk);
    const cap = new T.Mesh(new T.SphereGeometry(1, 20, 12, 0, TAU, 0, PI * .5), M.cap); cap.scale.set(.098, .082, .108); cap.position.set(0, .145, -.004); head.add(cap);
    const vi = ell(M.cap, .09, .006, .06, 0, .148, .09); vi.rotation.x = .15; head.add(vi);
  }
  const arms = [];
  for(const sd of [-1, 1]){
    const sh = grp(); sh.position.set(sd * .213, .31, 0); chest.add(sh);
    sh.add(ell(M.shirt, .062, .06, .065, 0, 0, 0));
    sh.add(tube(M.shirt, .29, .062, .052, 1, 1, .08));
    const el = grp(); el.position.y = -.29; sh.add(el);
    el.add(ell(M.shirt, .05, .045, .05, 0, 0, 0));
    const rc = new T.Mesh(new T.TorusGeometry(.047, .008, 6, 14), M.shirt); rc.rotation.x = PI / 2; rc.position.y = -.02; el.add(rc);
    const fa = tube(M.skin, .245, .047, .034, 1, 1, .1, 12); fa.position.y = -.015; el.add(fa);
    const wr = grp(); wr.position.y = -.26; el.add(wr);
    wr.add(ell(M.skin, .033, .046, .017, 0, -.045, 0));
    wr.add(ell(M.skin, .031, .028, .026, 0, -.088, .012));
    const tb = ell(M.skin, .011, .028, .012, sd * -.03, -.05, .014); tb.rotation.z = sd * .25; wr.add(tb);
    arms.push({ sh, el, wr, sd });
  }
  let club = null;
  if(bandit){
    club = grp(); const cb = tube(M.wood, .62, .026, .017, 1, 1, .02, 10); cb.position.y = .25; club.add(cb); club.add(ell(M.wood, .027, .05, .027, 0, -.36, 0));
    arms[1].wr.add(club); club.position.set(0, -.09, .02); club.rotation.x = -.5;
  }
  return { root, hips, spine, chest, neck, head, legs, arms, M, face, club, bandit };
}

/* ── pose : 18 valeurs ── */
export const KEYS = ['hL', 'hR', 'kL', 'kR', 'pL', 'pR', 'sL', 'sR', 'eL', 'eR', 'lean', 'tw', 'ctw', 'hp', 'hy', 'roll', 'ab', 'bnk'];
const KI = {}; KEYS.forEach((k, i) => KI[k] = i);
export function P(o){ const a = new Array(KEYS.length).fill(0); for(const k in o) a[KI[k]] = o[k]; return a; }
function wrapA(a){ a = a % TAU; if(a > PI) a -= TAU; if(a < -PI) a += TAU; return a; }
function kneeCurve(ph){ const w = wrapA(ph - .3); return .3 + 1.15 * Math.exp(-(w * w) / (2 * .85 * .85)); }
export function poseRun(ph, amp){
  amp = amp == null ? 1 : amp; const s = Math.sin(ph), s2 = Math.sin(ph + PI);
  return P({ hL: .14 + .66 * s * amp, hR: .14 + .66 * s2 * amp, kL: kneeCurve(ph) * amp + .1, kR: kneeCurve(ph + PI) * amp + .1, pL: .2 - .45 * s, pR: .2 - .45 * s2,
    sL: -.85 * s * amp, sR: -.85 * s2 * amp, eL: 1.4 + .3 * Math.sin(ph + PI + .6), eR: 1.4 + .3 * Math.sin(ph + .6),
    lean: .2, tw: .17 * s, ctw: -.32 * s, hp: -.12, hy: 0, roll: .05 * s, ab: .1, bnk: 0 });
}
export function poseCrouch(ph){
  const s = Math.sin(ph), s2 = Math.sin(ph + PI);
  return P({ hL: 1.0 + .28 * s, hR: 1.0 + .28 * s2, kL: 1.65 + .18 * s, kR: 1.65 + .18 * s2, pL: .3, pR: .3, sL: .45 - .2 * s, sR: .45 - .2 * s2, eL: 1.3, eR: 1.3,
    lean: .95, tw: .1 * s, ctw: -.2 * s, hp: -.75, hy: 0, roll: .04 * s, ab: .2, bnk: 0 });
}
function kfr(j, A){
  if(j <= A[0][0]) return A[0][1].slice(); if(j >= A[A.length - 1][0]) return A[A.length - 1][1].slice();
  for(let i = 0; i < A.length - 1; i++) if(j <= A[i + 1][0]){ const t = sstep((j - A[i][0]) / (A[i + 1][0] - A[i][0])); return A[i][1].map((v, k) => mix(v, A[i + 1][1][k], t)); }
}
const J0 = P({ hL: .9, hR: .9, kL: 1.3, kR: 1.3, pL: .3, pR: .3, sL: -1.0, sR: -1.0, eL: .4, eR: .4, lean: .55, hp: -.4, ab: .15 });
const J1 = P({ hL: .75, hR: 1.35, kL: .25, kR: 1.5, pL: .8, pR: .3, sL: 2.5, sR: 2.2, eL: .25, eR: .35, lean: .1, hp: -.1, ab: .45 });
const J2 = P({ hL: 1.1, hR: 1.55, kL: 1.7, kR: 1.9, pL: .6, pR: .6, sL: 1.2, sR: 1.2, eL: .7, eR: .7, lean: .45, hp: -.25, ab: .3 });
const J3 = P({ hL: .55, hR: .7, kL: .6, kR: .7, pL: .1, pR: .1, sL: .9, sR: .9, eL: .6, eR: .6, lean: .4, hp: -.2, ab: .3 });
const J4 = P({ hL: .95, hR: .95, kL: 1.4, kR: 1.4, pL: .3, pR: .3, sL: .2, sR: .2, eL: .8, eR: .8, lean: .7, hp: -.4, ab: .2 });
export function poseJump(j){ return kfr(j, [[0, J0], [.16, J0], [.38, J1], [.6, J2], [.84, J3], [.93, J4], [1, J4]]); }
export function poseHit(t){
  const k = Math.sin(t / 55) * .12;
  return P({ hL: .55, hR: -.15, kL: .8, kR: .3, pL: .2, pR: .1, sL: 1.15 + k, sR: .95 - k, eL: .8, eR: .9, lean: -.22, tw: .3, ctw: .4, hp: -.15, hy: 1.1, roll: .12 + k, ab: .5, bnk: .04 * Math.sin(t / 40) });
}
export function poseStand(t){
  const b = Math.sin(t / 540), c = Math.sin(t / 380);
  return P({ hL: .12 + .05 * b, hR: -.04 - .03 * b, kL: .2, kR: .12, pL: .04, pR: .06, sL: .15, sR: 1.45 + .18 * c, eL: .4 + .1 * b, eR: 1.25 + .2 * c, lean: .12 + .02 * b, tw: .05 * b, ctw: -.1 * b + .08, hp: -.04, hy: .22 * Math.sin(t / 1300), roll: .03 * b, ab: .25, bnk: .02 * b });
}
export function poseLeap(t){
  const s = Math.sin(t / 130);
  return P({ hL: 1.25 + .1 * s, hR: .9 - .1 * s, kL: 1.6, kR: 1.1, pL: .6, pR: .5, sL: 2.2, sR: 2.6 + .1 * s, eL: .5, eR: .7, lean: .42, tw: .12 * s, ctw: -.2, hp: -.25, hy: 0, roll: .05 * s, ab: .5, bnk: 0 });
}

export function applyPose(h, p){
  const hL = p[0], hR = p[1], kL = p[2], kR = p[3], pL = p[4], pR = p[5], sL = p[6], sR = p[7], eL = p[8], eR = p[9], lean = p[10], tw = p[11], ctw = p[12], hp = p[13], hy = p[14], roll = p[15], ab = p[16], bnk = p[17];
  const L = h.legs, A = h.arms, K = h.k || { th0: .02, L1: .44, L2: .43 };
  h.spine.rotation.set(lean, ctw, 0); h.hips.rotation.set(0, tw, roll); h.root.rotation.z = bnk;
  const hf = [hL, hR], kf2 = [kL, kR], pf = [pL, pR];
  let low = 1e9;
  for(let i = 0; i < 2; i++){
    const l = L[i]; l.th.rotation.x = -hf[i]; l.th.rotation.z = (i ? -1 : 1) * .02; l.kn.rotation.x = kf2[i]; l.an.rotation.x = pf[i] + hf[i] - kf2[i];
    const a1 = hf[i], a2 = hf[i] - kf2[i], ay = -K.th0 - K.L1 * Math.cos(a1) - K.L2 * Math.cos(a2), psi = pf[i];
    const heel = ay + (-.07) * Math.cos(psi) - (-.06) * Math.sin(psi), toe = ay + (-.045) * Math.cos(psi) - (.17) * Math.sin(psi);
    low = Math.min(low, heel, toe);
  }
  h.hips.position.y = -low;
  const sh = [sL, sR], el = [eL, eR];
  for(let i = 0; i < 2; i++){ const a = A[i]; a.sh.rotation.set(-sh[i], 0, a.sd * ab); a.el.rotation.x = -el[i]; a.wr.rotation.x = -.15; }
  h.head.rotation.set(hp, hy, 0); h.neck.rotation.x = hp * .3;
  if(h.club) h.club.rotation.x = -.5 + (sR - 1.4) * .15;
}
