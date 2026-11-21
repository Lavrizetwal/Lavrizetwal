/* roadgraph.js — tracé de route de « La course vers la mort » (étape 3 : courbes, aperçu).
   Le tracé est une pure décoration visuelle : il ne change ni les voies, ni les obstacles, ni le temps,
   ni rien de ce que le serveur rejoue (zc_sim). Il est déterministe : mêmes étapes → même route.
   Actif seulement avec ?road=curves (ou localStorage zc-road=1) ; ?road=off le coupe.
   Modèle : chaque étape « option » (après une fourche) est un segment avec 1 ou 2 virages en S
   (enveloppe sin², cap net = 0) ; routes de départ/arrivée et approches de fourche = ligne droite. */
(function(){
'use strict';
var ON = false;
try{
  var q = /[?&]road=(\w+)/.exec(location.search);
  if(q) ON = q[1] === 'curves' || q[1] === 'on'; else ON = localStorage.getItem('zc-road') === '1';
}catch(e){}
var N = 40, D = 12, K = 3.2;           /* échantillons, profondeur max (unités de « lead »), perspective du jeu */
var AMP = { montagne:1, foret:.85, ville:.6, desert:.9, glace:.8, volcan:1, jungle:.9, ruines:.7 };
var tab = new Float32Array(N + 1);      /* décalage latéral X(d), en fraction de la demi-largeur de route */
var head = 0, plan = [], planKey = '', GAIN = 6;
try{ var g = /[?&]roadgain=([\d.]+)/.exec(location.search); if(g) GAIN = +g[1]; }catch(e){}

function hash(s){ var h = 2166136261 >>> 0; for(var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
function r01(h, k){ h = Math.imul(h ^ (k * 2654435761 >>> 0), 2246822519) >>> 0; h ^= h >>> 13; h = Math.imul(h, 3266489917) >>> 0; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }

/* Segment de route : { t0, t1 (ms), a (amplitude de courbure), k (nombre de périodes), sg (sens) } */
function segFor(entry, idx){
  var o = entry.opt; if(!entry.fork || !o) return null;
  var h = hash((o.label || '') + '|' + (o.theme || '') + '|' + Math.round(o.dur) + '|' + idx);
  var a = (AMP[o.theme] || .8) * (o.ok ? 1 : 1.25);
  return { t0: entry.base, t1: entry.base + entry.dur, a: a, k: (o.dur > 12000 || r01(h, 2) > .55) ? 2 : 1, sg: r01(h, 1) > .5 ? 1 : -1 };
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
  if(api._eng !== eng){ api._eng = eng; planKey = ''; plan = []; }
  if(key !== planKey){ planKey = key; plan = []; tl.forEach(function(en, i){ var s = segFor(en, i); if(s) plan.push(s); }); }
  var lead = c.lead || 1800, du = D / N, dt = du * lead, X = 0, V = 0;
  tab[0] = 0;
  for(var i = 1; i <= N; i++){
    var t = now + (i - .5) * dt;
    V += curv(t) * du; X += V * du; tab[i] = X * GAIN / 2;   /* double intégrale de la courbure : cap puis écart latéral */
  }
  head = tab[Math.round(N / 2)];
  api.on = true; api.scene = scene;
}
function off(s){ /* décalage latéral (fraction de RW) à l'écran pour une profondeur d'écran s */
  var d = (1 / s - 1) / K; if(d <= 0) return 0; if(d >= D) d = D - 1e-6;
  var f = d / D * N, i = f | 0, w = f - i; return tab[i] * (1 - w) + tab[i + 1] * w;
}

var api = { on:false, _eng:null, scene:null, sync:sync, head:function(){ return head; }, off:off, enabled:function(){ return ON; },
  /* pour les tests : courbure à l'instant t pour un tracé donné */
  _plan:function(){ return plan; }, _curv:curv };
window.ZRoad = api;

function patch(){
  var Z = window.ZScene; if(!Z || !Z.prototype || Z.prototype.__zroad) return !!(Z && Z.prototype && Z.prototype.__zroad);
  var P = Z.prototype; P.__zroad = 1;
  var cx0 = P.cxAt;
  P.cxAt = function(s){
    if(api.on && api.scene === this) return this.CX + off(s) * this.RW * s - this.sway * s;
    return cx0.call(this, s);
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
