import * as T from 'three';
import { PI, TAU, clamp, mix, ell, tube, std, grp, noiseTex, scaleTex, rng } from './util.js';

const hair = (col, s) => noiseTex(col, { seed: s, blots: 50, dots: 1800, fur: 700, rep: [3, 2], bl: .1 });

function quad(S){
  const root = grp(), body = grp(); body.position.y = S.lu + S.ll + S.drop; root.add(body);
  body.add(ell(S.mat, S.rx, S.ry, S.rz, 0, 0, 0));
  body.add(ell(S.mat, S.rx * .98, S.ry * 1.02, S.rz * .5, 0, S.ry * .06, S.rz * .52));
  body.add(ell(S.mat, S.rx * .92, S.ry * .96, S.rz * .46, 0, 0, -S.rz * .55));
  const legs = [];
  [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach((q, i) => {
    const g = grp(); g.position.set(q[0] * S.rx * .72, -S.ry * .35, q[1] > 0 ? S.rz * .55 : -S.rz * .6); body.add(g);
    g.add(ell(S.mat, S.lr * 1.6, S.lr * 2.2, S.lr * 1.8, 0, 0, 0));
    g.add(tube(S.legMat || S.mat, S.lu, S.lr * 1.15, S.lr * .78, 1, 1, .06, 10));
    const lo = grp(); lo.position.y = -S.lu; g.add(lo);
    lo.add(tube(S.legMat || S.mat, S.ll, S.lr * .78, S.lr * .52, 1, 1, .02, 10));
    lo.add(ell(S.pawMat || S.mat, S.lr * .85, S.lr * .5, S.lr * 1.3, 0, -S.ll, S.lr * .5));
    legs.push({ g, lo, front: q[1] > 0, off: [0, .35, PI, PI + .35][i] });
  });
  const neck = grp(); neck.position.set(0, S.ry * .4, S.rz * .8); neck.rotation.x = S.neckTilt; body.add(neck);
  neck.add(ell(S.mat, S.nr, S.nl * .58, S.nr * 1.05, 0, S.nl * .5, 0));
  const head = grp(); head.position.set(0, S.nl, 0); head.rotation.x = -S.neckTilt * .8; neck.add(head);
  const tail = grp(); tail.position.set(0, S.ry * .45, -S.rz * .95); body.add(tail);
  return { root, body, legs, neck, head, tail, S };
}
function eyes(head, mats, x, y, z, r){
  for(const sd of [-1, 1]){ head.add(ell(mats.w, r * 1.15, r, r, sd * x, y, z)); head.add(ell(mats.i, r * .66, r * .74, r * .5, sd * x * 1.02, y, z + r * .75)); }
}
function gait(a, ph, amp, bob){
  a.legs.forEach(l => { const s = Math.sin(ph + l.off); l.g.rotation.x = -.75 * s * amp; l.lo.rotation.x = (.2 + 1.0 * Math.max(0, Math.sin(ph + l.off + 1.5))) * amp + .05; });
  a.body.position.y = a.S.lu + a.S.ll + a.S.drop - .02 + bob * Math.abs(Math.sin(ph)) ;
  a.body.rotation.x = .09 * Math.sin(ph + .6) * amp;
}

export function buildDog(){
  const f = hair('#a97740', 31), dk = hair('#5a3a1e', 32), fur = std('#fff', { map: f, roughness: .95 }), dark = std('#fff', { map: dk, roughness: .95 });
  const eM = { w: std('#efe6d0', { roughness: .3 }), i: std('#1a1008', { roughness: .2 }) };
  const a = quad({ mat: fur, legMat: fur, pawMat: dark, rx: .11, ry: .125, rz: .28, lu: .2, ll: .21, lr: .03, drop: -.02, nr: .06, nl: .13, neckTilt: .75 });
  a.head.add(ell(fur, .072, .068, .085, 0, .03, .03));
  a.head.add(ell(fur, .04, .036, .075, 0, .0, .115));
  a.head.add(ell(std('#0c0a09', { roughness: .3 }), .019, .014, .016, 0, .012, .185));
  const jaw = grp(); jaw.position.set(0, -.012, .06); a.head.add(jaw);
  jaw.add(ell(dark, .033, .014, .07, 0, 0, .05)); const tg = ell(std('#d96a7a', { roughness: .5 }), .02, .006, .045, 0, .008, .05); jaw.add(tg);
  eyes(a.head, eM, .038, .06, .08, .011);
  const ears = []; for(const sd of [-1, 1]){ const e = grp(); e.position.set(sd * .055, .085, -.0); a.head.add(e); e.add(ell(dark, .022, .06, .03, sd * .01, -.04, 0)); ears.push(e); }
  const tb = tube(fur, .22, .028, .013, 1, 1, .02, 8); a.tail.add(tb); a.tail.rotation.x = PI * .85;
  a.update = (t, ph) => { gait(a, ph, 1, .05); jaw.rotation.x = .25 + .2 * Math.sin(t / 90); ears[0].rotation.z = .4 + .25 * Math.sin(t / 70); ears[1].rotation.z = -.4 - .25 * Math.sin(t / 70 + 1); a.tail.rotation.z = .5 * Math.sin(t / 55); a.head.rotation.z = .06 * Math.sin(ph); };
  return a;
}
export function buildBull(){
  const f = hair('#3a2416', 41), fur = std('#fff', { map: f, roughness: .9 }), dk = std('#1c110b', { roughness: .9 });
  const eM = { w: std('#d9cdb4', { roughness: .3 }), i: std('#150b06', { roughness: .2 }) };
  const a = quad({ mat: fur, legMat: fur, pawMat: std('#16110e', { roughness: .6 }), rx: .27, ry: .29, rz: .6, lu: .36, ll: .38, lr: .06, drop: .02, nr: .15, nl: .26, neckTilt: .95 });
  a.body.add(ell(fur, .25, .22, .24, 0, .27, .3));
  a.head.add(ell(fur, .15, .165, .2, 0, .04, .1));
  a.head.add(ell(std('#6d4a3c', { roughness: .5 }), .11, .09, .1, 0, -.06, .25));
  a.head.add(ell(dk, .022, .016, .02, -.045, -.05, .345)); a.head.add(ell(dk, .022, .016, .02, .045, -.05, .345));
  const ring = new T.Mesh(new T.TorusGeometry(.04, .006, 6, 14), std('#c9b27a', { metalness: .6, roughness: .3 })); ring.position.set(0, -.1, .34); ring.rotation.x = PI / 2; a.head.add(ring);
  eyes(a.head, eM, .105, .1, .12, .019);
  const hm = std('#eee6cf', { roughness: .45 });
  for(const sd of [-1, 1]){
    for(let k = 0; k < 14; k++){ const t = k / 13, r = .046 * (1 - .82 * t); a.head.add(ell(hm, r, r, r, sd * (.14 + .2 * Math.sin(t * 1.75)), .16 + .3 * t, .03 + .06 * t)); }
    const er = grp(); er.position.set(sd * .17, .1, -.05); a.head.add(er); er.add(ell(fur, .06, .022, .035, sd * .04, 0, 0));
  }
  a.head.add(ell(fur, .1, .12, .1, 0, -.19, .08));
  const tb = tube(fur, .5, .03, .016, 1, 1, .02, 8); a.tail.add(tb); a.tail.rotation.x = .25;
  a.tail.add(ell(dk, .04, .08, .04, 0, -.55, 0));
  a.update = (t, ph) => { gait(a, ph, .95, .06); a.neck.rotation.x = .75 + .1 * Math.sin(ph); a.head.rotation.x = .6 + .12 * Math.sin(ph * 2); a.tail.rotation.z = .3 * Math.sin(ph); };
  return a;
}
export function buildPig(){
  const f = noiseTex('#e3a1a3', { seed: 51, blots: 30, dots: 2000, rep: [2, 2] }), skin = std('#fff', { map: f, roughness: .7 }), sn = std('#d4797f', { roughness: .55 });
  const eM = { w: std('#f0e6d0', { roughness: .3 }), i: std('#1a0d08', { roughness: .2 }) };
  const a = quad({ mat: skin, legMat: skin, pawMat: std('#3b2a26', { roughness: .6 }), rx: .2, ry: .21, rz: .36, lu: .1, ll: .11, lr: .034, drop: .02, nr: .14, nl: .1, neckTilt: .4 });
  a.head.add(ell(skin, .13, .125, .13, 0, .0, .06));
  const snout = new T.Mesh(new T.CylinderGeometry(.06, .068, .07, 14), sn); snout.rotation.x = PI / 2; snout.position.set(0, -.015, .19); a.head.add(snout);
  a.head.add(ell(std('#3a1a1c', { roughness: .5 }), .012, .016, .01, -.022, -.015, .228)); a.head.add(ell(std('#3a1a1c', { roughness: .5 }), .012, .016, .01, .022, -.015, .228));
  eyes(a.head, eM, .07, .04, .13, .012);
  const ears = []; for(const sd of [-1, 1]){ const e = grp(); e.position.set(sd * .085, .1, .04); e.rotation.z = sd * .5; a.head.add(e); e.add(ell(sn, .05, .07, .014, 0, .02, .015)); e.children[0].rotation.x = .6; ears.push(e); }
  const tl = new T.Mesh(new T.TorusGeometry(.03, .008, 6, 12, PI * 1.6), sn); tl.position.set(0, .0, 0); a.tail.add(tl);
  a.update = (t, ph) => { gait(a, ph, .8, .03); a.body.rotation.z = .06 * Math.sin(ph); a.head.rotation.y = .1 * Math.sin(ph * .5); ears[0].rotation.x = .3 * Math.sin(ph * 2); ears[1].rotation.x = -.3 * Math.sin(ph * 2); a.tail.rotation.z = .4 * Math.sin(ph); };
  return a;
}

/* serpent : chaîne d'ellipsoïdes sur une trajectoire */
export function buildSnake(){
  const tx = scaleTex('#3d7a35', '#2a5a28', 61), mat = std('#fff', { map: tx, roughness: .5 }), N = 30;
  const segs = []; const root = grp();
  for(let i = 0; i < N; i++){ const s = i / (N - 1), r = .05 * (s < .1 ? .55 + s * 4.5 : 1 - .65 * Math.max(0, s - .35) / .65); const m = ell(mat, r, r * .9, r * 1.5); root.add(m); segs.push({ m, r }); }
  const head = grp(); root.add(head);
  head.add(ell(mat, .052, .036, .075, 0, 0, .02));
  const eM = { w: std('#e8c43a', { roughness: .3 }), i: std('#0b0b0b', { roughness: .2 }) };
  for(const sd of [-1, 1]){ head.add(ell(eM.w, .01, .01, .01, sd * .036, .018, .04)); head.add(ell(eM.i, .0035, .009, .006, sd * .043, .018, .044)); }
  const tong = grp(); tong.position.set(0, -.006, .09); head.add(tong);
  const tm = std('#d0222c', { roughness: .5 });
  tong.add(ell(tm, .004, .003, .05, 0, 0, .03)); const f1 = ell(tm, .003, .003, .02, -.006, 0, .075), f2 = ell(tm, .003, .003, .02, .006, 0, .075); f1.rotation.y = .4; f2.rotation.y = -.4; tong.add(f1, f2);
  root.userData.tong = tong;
  return { root, segs, head, tong, N };
}
export function snakeGround(a, t){
  const N = a.N, w = t / 190;
  let px = 0, pz = 0;
  for(let i = 0; i < N; i++){
    const s = i / (N - 1), x = -.55 + s * 1.1, z = Math.sin(s * 9 - w) * .13 * (.35 + s * .65), lift = s > .82 ? Math.pow((s - .82) / .18, 1.6) * .26 : 0;
    const sg = a.segs[i]; sg.m.position.set(x, sg.r * .9 + lift, z);
    const dx = x - px, dz = z - pz; if(i) sg.m.rotation.y = Math.atan2(dx, dz) - PI / 2 + PI / 2; px = x; pz = z;
  }
  const last = a.segs[N - 1].m; a.head.position.copy(last.position); a.head.position.x += .03; a.head.rotation.set(.35, PI / 2 - .15, 0);
  a.tong.scale.z = .5 + Math.abs(Math.sin(t / 120)) * .8;
}
export function snakeHang(a, t){
  const N = a.N, w = t / 230;
  for(let i = 0; i < N; i++){
    const s = i / (N - 1), top = 1.95, y = top - s * 1.1, x = Math.sin(s * 7 - w) * .1 * (.3 + s) + .15 * s, z = Math.cos(s * 6 - w * 1.2) * .08 * (.3 + s) + .25 * Math.pow(s, 2);
    const sg = a.segs[N - 1 - i]; sg.m.position.set(x, y, z); sg.m.rotation.set(PI / 2, 0, 0);
  }
  const last = a.segs[N - 1].m; a.head.position.copy(last.position); a.head.position.y -= .03;
  a.head.rotation.set(1.2 + .25 * Math.sin(t / 400), .0, 0);
  a.tong.scale.z = .5 + Math.abs(Math.sin(t / 110)) * .9;
}

export function buildScorpion(){
  const sh = noiseTex('#a9561a', { seed: 71, blots: 40, dots: 1500, rep: [2, 2] }), mat = std('#fff', { map: sh, roughness: .35, metalness: .15 }), dk = std('#5a2a0c', { roughness: .4 });
  const root = grp(), body = grp(); body.position.y = .045; root.add(body);
  body.add(ell(mat, .055, .026, .085, 0, 0, .02));
  for(let i = 0; i < 4; i++) body.add(ell(mat, .045 - i * .004, .022, .028, 0, .002, -.07 - i * .042));
  const tail = grp(); tail.position.set(0, .015, -.2); body.add(tail);
  const tsegs = []; for(let i = 0; i < 6; i++){ const m = ell(mat, .017 - i * .0012, .017 - i * .0012, .026, 0, 0, 0); tail.add(m); tsegs.push(m); }
  const sting = new T.Mesh(new T.ConeGeometry(.012, .05, 8), dk); tail.add(sting);
  const claws = [];
  for(const sd of [-1, 1]){
    const arm = grp(); arm.position.set(sd * .045, .0, .09); body.add(arm); arm.add(ell(mat, .014, .014, .05, sd * .02, 0, .04));
    const cl = grp(); cl.position.set(sd * .04, 0, .1); arm.add(cl); cl.add(ell(mat, .03, .018, .045, 0, 0, .03)); const fg = ell(dk, .012, .012, .04, sd * .01, 0, .075); cl.add(fg);
    claws.push({ arm, cl });
  }
  const legs = []; for(let i = 0; i < 8; i++){ const sd = i % 2 ? 1 : -1, k = (i >> 1), g = grp(); g.position.set(sd * .04, -.005, .05 - k * .045); body.add(g); const a = tube(dk, .06, .007, .005, 1, 1, 0, 6); a.rotation.z = sd * 1.1; g.add(a); const lo = grp(); lo.position.set(sd * .06, -.05, 0); g.add(lo); const b = tube(dk, .04, .005, .003, 1, 1, 0, 6); b.rotation.z = -sd * .5; lo.add(b); legs.push({ g, sd, k }); }
  return { root, body, tail, tsegs, sting, claws, legs };
}
export function updScorpion(a, t){
  const w = t / 70;
  a.legs.forEach((l, i) => { l.g.rotation.y = Math.sin(w + i * 1.3) * .35; });
  for(let i = 0; i < a.tsegs.length; i++){ const s = i / 5, ang = 1.3 - s * 3.3 + .08 * Math.sin(t / 200 + i), rr = .06; a.tsegs[i].position.set(0, Math.sin(Math.PI * .8 * (s + .05)) * .12, -Math.cos(Math.PI * .85 * s) * .11 + .05 * s); a.tsegs[i].rotation.x = -Math.PI * .85 * (s - .3); }
  const l = a.tsegs[5]; a.sting.position.copy(l.position); a.sting.position.z += .035; a.sting.position.y -= .02; a.sting.rotation.x = Math.PI * .75;
  a.claws.forEach((c, i) => { c.cl.rotation.y = (i ? -1 : 1) * .15 * Math.sin(t / 160 + i); c.arm.rotation.y = (i ? -1 : 1) * .12; });
}
export function buildBees(){
  const root = grp(), bees = [];
  const yel = std('#e8b52a', { roughness: .7 }), blk = std('#1a1612', { roughness: .8 }), wing = new T.MeshStandardMaterial({ color: '#dfeaf5', transparent: true, opacity: .55, side: T.DoubleSide, roughness: .2 });
  const wg = new T.CircleGeometry(1, 10);
  for(let i = 0; i < 12; i++){
    const b = grp(); b.add(ell(yel, .02, .02, .03, 0, 0, .02)); b.add(ell(blk, .017, .017, .018, 0, 0, -.012)); b.add(ell(yel, .018, .018, .01, 0, 0, -.026)); b.add(ell(blk, .014, .014, .014, 0, 0, -.04)); b.add(ell(blk, .014, .014, .014, 0, .006, .05));
    const wl = new T.Mesh(wg, wing); wl.scale.set(.03, .014, 1); wl.position.set(-.035, .02, .01); wl.rotation.x = PI / 2; const wr = wl.clone(); wr.position.x = .035; b.add(wl, wr);
    root.add(b); bees.push({ b, wl, wr });
  }
  return { root, bees };
}
export function updBees(a, t){
  a.bees.forEach((e, i) => {
    const ph = t * (.0022 + i * .00023) + i * 1.9, r = .3 + .12 * Math.sin(i * 2.1 + t / 900);
    const x = Math.cos(ph) * r, z = Math.sin(ph * 1.2) * r * .6, y = 1.05 + .28 * Math.sin(ph * 1.7 + i) + (i % 3 - 1) * .06;
    e.b.position.set(x, y, z); e.b.rotation.y = -ph + PI / 2; e.b.rotation.x = .25 * Math.sin(ph * 3);
    const f = .7 * Math.sin(t / 14 + i); e.wl.rotation.z = -.4 + f; e.wr.rotation.z = .4 - f;
  });
}
