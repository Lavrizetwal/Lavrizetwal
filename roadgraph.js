/* roadgraph.js — tracé de route de « La course vers la mort » (étape 3 : courbes, aperçu).
   Le tracé est une pure décoration visuelle : il ne change ni les voies, ni les obstacles, ni le temps,
   ni rien de ce que le serveur rejoue (zc_sim). Il est déterministe : mêmes étapes → même route.
   Actif seulement avec ?road=curves (ou localStorage zc-road=1) ; ?road=off le coupe.
   Modèle : chaque étape « option » (après une fourche) est un segment avec 1 ou 2 virages en S
   (enveloppe sin², cap net = 0) ; routes de départ/arrivée et approches de fourche = ligne droite. */
(function(){
'use strict';
var ON = false, KEYR = 'zc-road';
try{
  var q = /[?&]road=(\w+)/.exec(location.search);
  if(q) ON = q[1] === 'curves' || q[1] === 'on';
  else if(/curves/.test(location.hash)) ON = true;
  else ON = localStorage.getItem(KEYR) === '1';
}catch(e){}
var LOCK = 350;                          /* ms avant la fourche : la voie est verrouillée */
var N = 40, D = 12, K = 3.2;           /* échantillons, profondeur max (unités de « lead »), perspective du jeu */
var AMP = { montagne:1, foret:.85, ville:.6, desert:.9, glace:.8, volcan:1, jungle:.9, ruines:.7 };
/* style de virages par environnement (destination) : a = amplitude, k = périodes en plus (virages plus serrés) */
var DT = { zetwal:'jungle', cejjd:'glace', soldiers:'ruines', dadoute:'volcan', phada:'desert' };
var ENVP = { jungle:{ a:1.05, k:1 }, volcan:{ a:1.2, k:1 }, desert:{ a:1.0, k:0 }, glace:{ a:.7, k:0 }, ruines:{ a:.6, k:0 } };
var env = { a:1, k:0 };
var tab = new Float32Array(N + 1);      /* décalage latéral X(d), en fraction de la demi-largeur de route */
var head = 0, lean = 0, lockOn = false, lockT = 0, plan = [], planKey = '', GAIN = 6;
try{ var g = /[?&]roadgain=([\d.]+)/.exec(location.search); if(g) GAIN = +g[1]; }catch(e){}

function hash(s){ var h = 2166136261 >>> 0; for(var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
function r01(h, k){ h = Math.imul(h ^ (k * 2654435761 >>> 0), 2246822519) >>> 0; h ^= h >>> 13; h = Math.imul(h, 3266489917) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

/* Segment de route : { t0, t1 (ms), a (amplitude de courbure), k (nombre de périodes), sg (sens) } */
function segFor(entry, idx){
  var o = entry.opt; if(!entry.fork || !o) return null;
  var h = hash((o.label || '') + '|' + (o.theme || '') + '|' + Math.round(o.dur) + '|' + idx);
  var a = (AMP[o.theme] || .8) * (o.ok ? 1 : 1.25) * env.a;
  var k = Math.min(3, ((o.dur > 12000 || r01(h, 2) > .55) ? 2 : 1) + env.k);
  return { t0: entry.base, t1: entry.base + entry.dur, a: a, k: k, sg: r01(h, 1) > .5 ? 1 : -1 };
}
function curv(t){
  for(var i = plan.length - 1; i >= 0; i--){
    var s = plan[i]; if(t < s.t0 || t > s.t1) continue;
    var u = (t - s.t0) / (s.t1 - s.t0), e = Math.sin(Math.PI * u); e *= e;
    return s.sg * s.a * e * Math.sin(2 * Math.PI * s.k * u);
  }
  return 0;
}
/* Met à jour le tracé à partir du moteur et de l'instant courant ; ne touche à aucun état du jeu. */
function sync(eng, c, now, scene){
  if(!ON || !eng || !c || !scene) { api.on = false; return; }
  var tl = eng.timeline, key = tl.length + ':' + (tl.length ? tl[tl.length - 1].base : 0);
  if(api._eng !== eng){ api._eng = eng; showBadge(); planKey = ''; plan = []; env = ENVP[DT[c.dest]] || { a:1, k:0 }; }
  if(key !== planKey){ planKey = key; plan = []; tl.forEach(function(en, i){ var s = segFor(en, i); if(s) plan.push(s); }); }
  var lead = c.lead || 1800, du = D / N, dt = du * lead, X = 0, V = 0;
  tab[0] = 0;
  for(var i = 1; i <= N; i++){
    var t = now + (i - .5) * dt;
    V += curv(t) * du; X += V * du; tab[i] = X * GAIN / 2;   /* double intégrale de la courbure : cap puis écart latéral */
  }
  head = tab[Math.round(N / 2)];
  lean += (curv(now + lead * .12) - lean) * .12;      /* le coureur se penche dans le virage (lissé) */
  /* carrefour : dans les dernières LOCK ms avant la fourche, le choix de voie est verrouillé */
  var was = lockOn; lockOn = false;
  if(!eng.loaded && eng.si < c.stages.length && c.stages[eng.si].k === 'fork'){ var b = eng.tcur + c.stages[eng.si].appr; lockOn = now >= b - LOCK && now < b + 600; lockT = b; }
  if(lockOn && !was){ try{ if(navigator.vibrate) navigator.vibrate(18); }catch(e){} }
  paintLock(lockOn);
  api.on = true; api.scene = scene;
}
function off(s){ /* décalage latéral (fraction de RW) à l'écran pour une profondeur d'écran s */
  var d = (1 / s - 1) / K; if(d <= 0) return 0; if(d >= D) d = D - 1e-6;
  var f = d / D * N, i = f | 0, w = f - i; return tab[i] * (1 - w) + tab[i + 1] * w;
}

var chip = null;
function paintLock(on){
  if(!chip){ var stg = document.querySelector('.cs-stage'); if(!stg) return;
    chip = document.createElement('div'); chip.id = 'cs-lock'; chip.setAttribute('aria-live', 'polite'); chip.textContent = 'Choix verrouillé';
    chip.style.cssText = 'position:absolute;left:50%;top:34%;transform:translateX(-50%);z-index:4;padding:7px 16px;border-radius:99px;background:rgba(8,16,42,.82);border:1px solid #F0D98A;color:#F0D98A;font:700 .95rem Inter,system-ui,sans-serif;pointer-events:none;display:none';
    stg.appendChild(chip); }
  chip.style.display = on ? 'block' : 'none';
}
var api = { on:false, locked:function(now){ return api.on && lockOn && now >= lockT - LOCK; }, lean:function(){ return lean; }, _eng:null, scene:null, sync:sync, head:function(){ return head; }, off:off, enabled:function(){ return ON; },
  /* pour les tests : courbure à l'instant t pour un tracé donné */
  _plan:function(){ return plan; }, _curv:curv };
window.ZRoad = api;
api.set = function(v){ ON = !!v; try{ localStorage.setItem(KEYR, ON ? '1' : '0'); }catch(e){} };

function mountSwitch(){
  var sum = document.getElementById('cs-sum'); if(!sum || document.getElementById('cs-roadg')) return;
  var g = document.createElement('div'); g.className = 'cs-grp'; g.id = 'cs-roadg';
  g.innerHTML = '<h3>Route</h3><div style="display:grid;gap:10px;max-width:560px"><button type="button" id="cs-roadsw" role="switch" style="min-height:48px;padding:0 18px;border-radius:14px;border:1px solid rgba(240,217,138,.35);background:rgba(255,255,255,.05);color:#f4f1e8;font:600 .95rem Inter,system-ui,sans-serif;cursor:pointer;text-align:left"></button>'
    + '<p style="margin:0;font-size:.85rem;line-height:1.5;color:#aab2d0">Essai : la route tourne en S après chaque carrefour et le coureur se penche. Les voies, les obstacles et les gains ne changent pas. Les premiers virages arrivent environ 8 secondes après le départ.</p></div>';
  sum.parentNode.insertBefore(g, sum);
  var b = g.querySelector('#cs-roadsw');
  function paint(){ b.setAttribute('aria-checked', ON ? 'true' : 'false'); b.textContent = ON ? 'Route en courbes : activée (toucher pour couper)' : 'Route en courbes : coupée (toucher pour activer)'; b.style.borderColor = ON ? '#F0D98A' : 'rgba(240,217,138,.35)'; b.style.background = ON ? 'rgba(212,175,55,.18)' : 'rgba(255,255,255,.05)'; }
  b.addEventListener('click', function(){ api.set(!ON); paint(); });
  paint();
}
var badge = null;
function showBadge(){
  var stg = document.querySelector('.cs-stage'); if(!stg || !ON) return;
  if(!badge){ badge = document.createElement('div'); badge.setAttribute('aria-live', 'polite'); badge.textContent = 'Route en courbes activée';
    badge.style.cssText = 'position:absolute;left:50%;bottom:48px;transform:translateX(-50%);z-index:4;padding:6px 14px;border-radius:99px;background:rgba(8,16,42,.82);border:1px solid #F0D98A;color:#F0D98A;font:700 .85rem Inter,system-ui,sans-serif;pointer-events:none;transition:opacity .6s'; stg.appendChild(badge); }
  badge.style.opacity = '1'; clearTimeout(badge._h); badge._h = setTimeout(function(){ badge.style.opacity = '0'; }, 4500);
}
api._badge = showBadge;
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountSwitch); else mountSwitch();

function patch(){
  var Z = window.ZScene; if(!Z || !Z.prototype || Z.prototype.__zroad) return !!(Z && Z.prototype && Z.prototype.__zroad);
  var P = Z.prototype; P.__zroad = 1;
  var cx0 = P.cxAt;
  P.cxAt = function(s){
    if(api.on && api.scene === this) return this.CX + off(s) * this.RW * s - this.sway * s;
    return cx0.call(this, s);
  };
  var dr0 = P.drawRunnerNow;
  if(typeof dr0 === 'function') P.drawRunnerNow = function(f){
    if(!(api.on && api.scene === this)) return dr0.call(this, f);
    var X = this.X, x = this.laneX(f.vx, 1), y = this.PY;
    X.save(); X.translate(x, y); X.rotate(Math.max(-1, Math.min(1, lean)) * .1); X.translate(-x, -y);
    try{ return dr0.call(this, f); } finally { X.restore(); }
  };
  /* fond et soleil : suivent le cap de la route (à la place du balancement sinusoïdal) */
  ['sky', 'layer'].forEach(function(n){
    var f0 = P[n]; if(typeof f0 !== 'function') return;
    P[n] = function(){
      if(!(api.on && api.scene === this)) return f0.apply(this, arguments);
      var b = this.bend; this.bend = head * this.RW * .5;
      try{ return f0.apply(this, arguments); } finally { this.bend = b; }
    };
  });
  return true;
}
if(!patch()){ var n = 0, iv = setInterval(function(){ if(patch() || ++n > 80) clearInterval(iv); }, 100); }
})();
