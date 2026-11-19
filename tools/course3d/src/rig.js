import * as T from 'three';

/* Rigging automatique d'un maillage humain statique en T-pose sur le squelette du jeu.
   spec : proportions mesurées sur le modèle (fractions de la hauteur). */
export const SPEC_FILLE1 = {
  H: 1.72, hip: .50, knee: .27, ankle: .04, chest: .60, legx: .055, crotch: .45,
  sh: [.17, .78], wr: [.43, .71], hand: [.485, .69], neck: .86, head: .905, toe: .1
};

export function rigFromMesh(mesh, spec){
  const S = spec, H = S.H;
  const g = mesh.geometry.clone(); g.computeBoundingBox(); const bb = g.boundingBox, sc = H / (bb.max.y - bb.min.y);
  g.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); g.scale(sc, sc, sc);
  const B = (name, parent, x, y, z) => { const b = new T.Bone(); b.name = name; b.position.set(x, y, z); if(parent) parent.add(b); return b; };
  const hipY = S.hip * H, kneeY = S.knee * H, ankY = S.ankle * H, chestY = hipY + .17, shY = S.sh[1] * H;
  const L1 = hipY - .02 - kneeY, L2 = kneeY - ankY;
  const root = new T.Group(), hips = B('hips', null, 0, hipY, 0), spine = B('spine', hips, 0, 0, 0), chest = B('chest', spine, 0, chestY - hipY, 0);
  const neck = B('neck', chest, 0, S.neck * H - chestY, 0), head = B('head', neck, 0, (S.head - S.neck) * H, 0);
  const legs = [], arms = [], pivots = [];
  for(const sd of [-1, 1]){
    const th = B('th' + sd, hips, sd * S.legx * H, -.02, 0), kn = B('kn' + sd, th, 0, -L1, 0), an = B('an' + sd, kn, 0, -L2, 0);
    const dx = (S.wr[0] - S.sh[0]) * H, dy = (S.wr[1] - S.sh[1]) * H, A = Math.hypot(dx, dy), th0 = Math.atan2(sd * dx, -dy) * 1; // angle de la T-pose
    const pv = B('pv' + sd, chest, sd * S.sh[0] * H, shY - chestY, 0); pv.rotation.z = th0;
    const sh = B('sh' + sd, pv, 0, 0, 0), el = B('el' + sd, sh, 0, -A * .5, 0), wr = B('wr' + sd, el, 0, -A * .5, 0);
    legs.push({ th, kn, an, ft: an }); arms.push({ sh, el, wr, sd }); pivots.push(pv);
  }
  root.add(hips); root.updateMatrixWorld(true);
  const bones = []; hips.traverse(b => { if(b.isBone) bones.push(b); });
  const wp = b => new T.Vector3().setFromMatrixPosition(b.matrixWorld), V = (x, y, z) => new T.Vector3(x, y, z);
  const seg = [], add = (b, a, c, r, side, kind) => seg.push({ b: bones.indexOf(b), a, c, r, side: side || 0, kind: kind || '' });
  add(hips, wp(hips).add(V(0, -.14, 0)), wp(hips).add(V(0, .08, 0)), .2, 0, 'core'); add(spine, wp(hips).add(V(0, .08, 0)), wp(chest), .17, 0, 'core'); add(chest, wp(chest), V(0, S.neck * H - .03, 0), .2, 0, 'core');
  add(neck, V(0, S.neck * H - .03, 0), V(0, S.head * H, 0), .07, 0, 'core'); add(head, V(0, S.head * H, 0), V(0, H, 0), .13, 0, 'core');
  for(let i = 0; i < 2; i++){
    const L = legs[i], A = arms[i], sd = A.sd;
    add(L.th, wp(L.th), wp(L.kn), .1, sd, 'leg'); add(L.kn, wp(L.kn), wp(L.an), .08, sd, 'leg'); add(L.an, wp(L.an), wp(L.an).add(V(0, -.03, S.toe * H)), .06, sd, 'leg');
    const shp = wp(A.sh), elp = wp(A.el), wrp = wp(A.wr), tip = V(sd * S.hand[0] * H, S.hand[1] * H, 0);
    add(A.sh, shp, elp, .07, sd, 'arm'); add(A.el, elp, wrp, .055, sd, 'arm'); add(A.wr, wrp, tip, .05, sd, 'arm');
  }
  const pos = g.attributes.position, n = pos.count, idx = new Uint16Array(n * 4), wt = new Float32Array(n * 4), p = new T.Vector3(), q = new T.Vector3(), d = new T.Vector3();
  const crotch = S.crotch * H;
  for(let i = 0; i < n; i++){
    p.fromBufferAttribute(pos, i); const best = {};
    for(const s of seg){
      if(s.kind === 'leg' && p.y < crotch && Math.sign(p.x) !== s.side) continue;
      if(s.kind === 'leg' && p.y >= crotch + .05 && Math.abs(p.x) > .2) continue;
      if(s.kind === 'arm'){ if(Math.sign(p.x) !== s.side) continue; if(Math.abs(p.x) < S.sh[0] * H - .02 && p.y < shY + .1) continue; if(p.y < shY - .3) continue; }
      d.subVectors(s.c, s.a); const l2 = d.lengthSq(); let t = l2 ? q.subVectors(p, s.a).dot(d) / l2 : 0; t = Math.max(0, Math.min(1, t)); q.copy(s.a).addScaledVector(d, t);
      let dist = Math.max(0, p.distanceTo(q) - s.r * .6); if(s.kind === 'core') dist *= .85;
      if(!(s.b in best) || dist < best[s.b]) best[s.b] = dist;
    }
    const arr = Object.keys(best).map(k => [+k, best[k]]).sort((a, b) => a[1] - b[1]).slice(0, 4);
    let sum = 0; const ws = arr.map(e => { const w = 1 / Math.pow(e[1] + .015, 3); sum += w; return w; });
    for(let k = 0; k < 4; k++){ idx[i * 4 + k] = k < arr.length ? arr[k][0] : 0; wt[i * 4 + k] = k < arr.length ? ws[k] / sum : 0; }
  }
  g.setAttribute('skinIndex', new T.Uint16BufferAttribute(idx, 4)); g.setAttribute('skinWeight', new T.Float32BufferAttribute(wt, 4));
  const skel = new T.Skeleton(bones);
  const mat = mesh.material.clone();
  mat.emissiveMap = mat.map; mat.emissive = new T.Color(0xffffff); mat.emissiveIntensity = .32; mat.roughness = .7; mat.metalness = 0;
  const sm = new T.SkinnedMesh(g, mat); root.add(sm); sm.bind(skel); sm.frustumCulled = false;
  pivots.forEach(pv => { pv.rotation.z = 0; });
  return { root, hips, spine, chest, neck, head, legs, arms, face: [], club: null, M: { skin: mat }, mat, k: { th0: .02, L1, L2 } };
}
