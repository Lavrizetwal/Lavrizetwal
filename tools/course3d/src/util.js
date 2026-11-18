import * as T from 'three';
export const PI = Math.PI, TAU = PI * 2;
export const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
export const mix = (a, b, t) => a + (b - a) * t;
export const sstep = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
export function rng(seed){ return function(){ seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function ctex(w, h, fn, rep, srgb){
  const c = document.createElement('canvas'); c.width = w; c.height = h; fn(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4;
  if(rep) t.repeat.set(rep[0], rep[1]); if(srgb !== false) t.colorSpace = T.SRGBColorSpace; return t;
}
const SPH = new T.SphereGeometry(1, 20, 14);
export function ell(mat, rx, ry, rz, x, y, z){ const m = new T.Mesh(SPH, mat); m.scale.set(rx, ry, rz); m.position.set(x || 0, y || 0, z || 0); return m; }
/* membre qui pend depuis l'origine vers -y, section plus ou moins ovale */
export function tube(mat, len, r0, r1, ex, ez, bulge, seg){
  const pts = [], n = 8, c1 = r1 * .75, c0 = r0 * .75;
  for(let i = 0; i <= 4; i++){ const a = i / 4 * PI / 2; pts.push(new T.Vector2(Math.max(.0005, r1 * Math.sin(a)), -len - c1 * Math.cos(a))); }
  for(let i = 1; i < n; i++){ const t = i / n; pts.push(new T.Vector2(mix(r1, r0, t) * (1 + (bulge == null ? .1 : bulge) * Math.sin(PI * t)), -len + t * len)); }
  for(let i = 0; i <= 4; i++){ const a = i / 4 * PI / 2; pts.push(new T.Vector2(Math.max(.0005, r0 * Math.cos(a)), c0 * Math.sin(a))); }
  const m = new T.Mesh(new T.LatheGeometry(pts, seg || 14), mat); m.scale.set(ex || 1, 1, ez || 1); return m;
}
export function std(col, o){ o = o || {}; return new T.MeshStandardMaterial(Object.assign({ color: col, roughness: .8, metalness: 0 }, o)); }
export function grp(){ return new T.Group(); }
/* ── textures procédurales ── */
export function noiseTex(base, o){
  o = o || {}; const R = rng(o.seed || 3);
  return ctex(256, 256, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for(let i = 0; i < (o.blots == null ? 30 : o.blots); i++){ const x = R() * w, y = R() * h, r = 14 + R() * 50, gr = g.createRadialGradient(x, y, 0, x, y, r); const lt = R() > .5; gr.addColorStop(0, lt ? 'rgba(255,255,255,' + (o.bl || .07) + ')' : 'rgba(0,0,0,' + (o.bl || .07) + ')'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
    for(let i = 0; i < (o.dots == null ? 2600 : o.dots); i++){ g.fillStyle = R() > .5 ? 'rgba(255,255,255,' + (o.da || .05) + ')' : 'rgba(0,0,0,' + (o.da || .06) + ')'; const s = .7 + R() * (o.ds || 1.6); g.fillRect(R() * w, R() * h, s, s); }
    if(o.fur) for(let i = 0; i < o.fur; i++){ const x = R() * w, y = R() * h; g.strokeStyle = R() > .5 ? 'rgba(255,240,210,.16)' : 'rgba(0,0,0,.2)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - .5) * 4, y + 5 + R() * 6); g.stroke(); }
  }, o.rep || [2, 2]);
}
export function fabricTex(base, o){
  o = o || {}; const R = rng(o.seed || 9), cell = o.cell || 4;
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 256, 256);
  g.lineWidth = cell * .55; for(let i = -256; i < 512; i += cell){ g.strokeStyle = 'rgba(0,0,0,' + (o.tw || .16) + ')'; g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); }
  g.lineWidth = 1; for(let i = 0; i < 1500; i++){ const x = R() * 256, y = R() * 256; g.strokeStyle = R() > .5 ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.08)'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - .5) * 6, y + (R() - .5) * 6); g.stroke(); }
  if(o.diamond){ g.strokeStyle = 'rgba(90,60,0,.3)'; g.lineWidth = 1.2; for(let i = -256; i < 512; i += 24){ g.beginPath(); g.moveTo(i, 0); g.lineTo(i + 256, 256); g.stroke(); g.beginPath(); g.moveTo(i + 256, 0); g.lineTo(i, 256); g.stroke(); } g.fillStyle = 'rgba(255,240,170,.25)'; for(let i = 0; i < 256; i += 24) for(let j = 0; j < 256; j += 24) g.fillRect(i + 11, j + 11, 2.4, 2.4); }
  const t = new T.CanvasTexture(cv); t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = 4; t.colorSpace = T.SRGBColorSpace; t.repeat.set(o.rep ? o.rep[0] : 3, o.rep ? o.rep[1] : 3);
  const bt = new T.CanvasTexture(cv); bt.wrapS = bt.wrapT = T.RepeatWrapping; bt.repeat.copy(t.repeat); return { map: t, bump: bt };
}
export function curlTex(){
  const R = rng(5);
  const cv = document.createElement('canvas'); cv.width = cv.height = 256; const g = cv.getContext('2d');
  g.fillStyle = '#16100d'; g.fillRect(0, 0, 256, 256);
  for(let i = 0; i < 1500; i++){ const x = R() * 256, y = R() * 256, r = 2 + R() * 3.2, gr = g.createRadialGradient(x - r * .3, y - r * .3, 0, x, y, r); gr.addColorStop(0, 'rgba(120,100,90,.55)'); gr.addColorStop(.6, 'rgba(40,30,26,.4)'); gr.addColorStop(1, 'rgba(0,0,0,.2)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
  const t = new T.CanvasTexture(cv); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(2, 2); t.colorSpace = T.SRGBColorSpace;
  const b = new T.CanvasTexture(cv); b.wrapS = b.wrapT = T.RepeatWrapping; b.repeat.set(2, 2); return { map: t, bump: b };
}
export function scaleTex(a, b, seed){
  const R = rng(seed || 4);
  return ctex(256, 128, (g, w, h) => {
    g.fillStyle = a; g.fillRect(0, 0, w, h);
    for(let j = 0; j < 16; j++) for(let i = 0; i < 32; i++){ const x = i * 8 + (j & 1) * 4, y = j * 8; g.fillStyle = R() > .5 ? b : a; g.globalAlpha = .55; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 4, y + 4); g.lineTo(x, y + 8); g.lineTo(x - 4, y + 4); g.closePath(); g.fill(); g.globalAlpha = 1; g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = .8; g.stroke(); }
    for(let i = 0; i < 6; i++){ g.fillStyle = 'rgba(255,230,90,.55)'; g.fillRect(i * 44 + 10, 0, 14, h); }
  }, [3, 1]);
}
export function zDecal(){
  return ctex(128, 128, (g) => { g.clearRect(0, 0, 128, 128); g.fillStyle = '#7a5a10'; g.strokeStyle = '#3d2c04'; g.lineWidth = 2; g.beginPath(); g.moveTo(24, 26); g.lineTo(104, 26); g.lineTo(104, 44); g.lineTo(56, 84); g.lineTo(104, 84); g.lineTo(104, 102); g.lineTo(24, 102); g.lineTo(24, 84); g.lineTo(72, 44); g.lineTo(24, 44); g.closePath(); g.fill(); g.stroke(); g.fillStyle = 'rgba(255,230,140,.35)'; g.fillRect(28, 28, 72, 3); }, null, true);
}
