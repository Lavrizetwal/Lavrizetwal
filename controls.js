/* controls.js — commandes de « La course vers la mort » : tactile, inclinaison du téléphone, ou les deux.
   L'inclinaison ne fait qu'appeler la même action « gauche / droite » que le doigt : le journal des actions
   [[temps, code]] et ce que le serveur rejoue (zc_sim) ne changent donc pas.
   Réglages (localStorage « zc-ctl ») : mode, sensibilité, zone morte. Calibration automatique au départ + bouton.
   Sans capteur, ou permission refusée : retour automatique au tactile. Par défaut : tactile seul (rien ne change). */
(function(){
'use strict';
var KEY = 'zc-ctl';
var S = { m:'touch', s:5, dz:6 };                  /* m : touch | tilt | both ; s : 1..10 ; dz : degrés */
try{ var j = JSON.parse(localStorage.getItem(KEY) || 'null'); if(j){ if(/^(touch|tilt|both)$/.test(j.m)) S.m = j.m; if(j.s >= 1 && j.s <= 10) S.s = +j.s; if(j.dz >= 2 && j.dz <= 15) S.dz = +j.dz; } }catch(e){}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }

var host = null;                                    /* { act(code, ts), state() } fourni par course.html */
var raw = null, g = 0, base = 0, armed = true, wasRun = false, listening = false, got = 0, perm = 'unknown', sensor = 'unknown', timer = 0, ui = null, bar = null;

function hasSensor(){ return 'DeviceOrientationEvent' in window; }
function coarse(){ try{ return matchMedia('(pointer:coarse)').matches; }catch(e){ return false; } }
function tiltWanted(){ return S.m !== 'touch' && (got > 0 || (sensor !== 'none' && perm !== 'denied')); }
function trig(){ return Math.max(S.dz + 4, 26 - 2 * S.s); }

/* angle de roulis selon l'orientation de l'écran : portrait = gamma ; paysage = bêta (signes non vérifiés sur appareil) */
function roll(e){
  var a = 0; try{ a = (screen.orientation && screen.orientation.angle) || window.orientation || 0; }catch(x){}
  a = ((a % 360) + 360) % 360;
  if(a === 90) return e.beta; if(a === 270) return -e.beta; if(a === 180) return -e.gamma;
  return e.gamma;
}
function onOri(e){
  var r = roll(e); if(r == null || !isFinite(r)) return;
  got++; sensor = 'ok'; raw = r;
  g += (r - g) * (got < 3 ? 1 : .4);                /* lissage */
  var st = host ? host.state() : '';
  if(st === 'run' && !wasRun){ base = g; armed = false; }   /* calibration automatique : la position de départ est le « neutre » */
  wasRun = st === 'run';
  var d = g - base, t = trig();
  paintBar(d, t, st === 'run');
  if(st !== 'run' || !tiltWanted()) return;
  if(Math.abs(d) < S.dz){ armed = true; return; }
  if(armed && Math.abs(d) >= t){ armed = false; host.act(d > 0 ? 1 : 0, e.timeStamp); }
}
function listen(){
  if(listening || !hasSensor()) return; listening = true;
  window.addEventListener('deviceorientation', onOri, true);
  clearTimeout(timer); timer = setTimeout(function(){ if(!got){ sensor = 'none'; note(); } }, 2500);
}
function unlisten(){ if(!listening) return; listening = false; window.removeEventListener('deviceorientation', onOri, true); clearTimeout(timer); }

/* iOS : permission explicite, uniquement après un geste de l'utilisateur */
function ask(cb){
  var D = window.DeviceOrientationEvent;
  if(D && typeof D.requestPermission === 'function'){
    try{ D.requestPermission().then(function(r){ perm = r === 'granted' ? 'granted' : 'denied'; if(perm === 'granted') listen(); note(); cb && cb(perm); }, function(){ perm = 'denied'; note(); cb && cb(perm); }); }
    catch(e){ perm = 'denied'; note(); cb && cb(perm); }
  } else { perm = 'granted'; listen(); note(); cb && cb(perm); }
}

var CSS = '.cs-ctls{display:grid;gap:12px;max-width:560px}.cs-ctls .seg{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}'
 + '.cs-ctls .seg button{min-height:46px;padding:6px 8px;border-radius:14px;border:1px solid rgba(240,217,138,.28);background:rgba(255,255,255,.05);color:#e9ecf7;font:600 .9rem Inter,system-ui,sans-serif;cursor:pointer}'
 + '.cs-ctls .seg button[aria-checked=true]{border-color:#F0D98A;background:rgba(212,175,55,.16);box-shadow:0 0 0 1px #F0D98A inset;color:#fff}'
 + '.cs-ctls label{display:grid;gap:4px;font-size:.85rem;color:#b9c1da}.cs-ctls label b{color:#F0D98A}.cs-ctls input[type=range]{width:100%;accent-color:#D4AF37;min-height:32px}'
 + '.cs-ctls .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.cs-ctls .mini{min-height:42px;padding:0 14px;border-radius:99px;border:1px solid rgba(240,217,138,.35);background:rgba(8,14,38,.6);color:#F0D98A;font:600 .88rem Inter,system-ui,sans-serif;cursor:pointer}'
 + '.cs-ctls .nt{font-size:.82rem;line-height:1.45;color:#aab2d0;margin:0}.cs-ctls button:focus-visible,.cs-ctls input:focus-visible{outline:2px solid #F0D98A;outline-offset:3px}'
 + '#cs-tilt{position:absolute;left:50%;bottom:calc(10px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(60%,260px);height:8px;border-radius:99px;background:rgba(255,255,255,.14);pointer-events:none;display:none;z-index:4}'
 + '#cs-tilt i{position:absolute;top:-3px;left:50%;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#F0D98A;box-shadow:0 0 0 2px rgba(8,14,38,.8)}'
 + '#cs-tilt u{position:absolute;top:-2px;bottom:-2px;width:2px;background:rgba(255,255,255,.55)}';

var cssOk = 0;
function css(){ if(cssOk) return; cssOk = 1; var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st); }

function note(){
  if(!ui) return; var n = ui.querySelector('.nt'), b = ui.querySelector('[data-ask]'), t = '';
  var needAsk = S.m !== 'touch' && !got && perm !== 'granted' && perm !== 'denied' && typeof (window.DeviceOrientationEvent || {}).requestPermission === 'function';
  if(S.m === 'touch') t = 'Mode tactile : glissez ou touchez les boutons. Rien d’autre à régler.';
  else if(!got && sensor === 'none') t = 'Aucun capteur d’inclinaison détecté sur cet appareil : le jeu reste en mode tactile.';
  else if(!got && perm === 'denied') t = 'L’accès à l’inclinaison est refusé : le jeu reste en mode tactile. Vous pouvez l’autoriser dans les réglages du navigateur.';
  else if(needAsk) t = 'Autorisez l’inclinaison pour l’utiliser (l’appareil vous le demandera).';
  else t = 'Tenez le téléphone comme vous le souhaitez : la position de départ sert de neutre. Inclinez à gauche ou à droite pour changer de voie' + (S.m === 'both' ? ' ; le doigt reste actif.' : ' ; sauter et se glisser dessous restent au doigt.');
  n.textContent = t; if(b) b.hidden = !needAsk;
}
function mount(){
  var sum = document.getElementById('cs-sum'); if(!sum || document.getElementById('cs-ctlg') || !hasSensor() || !coarse()) return;
  css();
  var grp = document.createElement('div'); grp.className = 'cs-grp'; grp.id = 'cs-ctlg';
  grp.innerHTML = '<h3>Commandes</h3><div class="cs-ctls"><div class="seg" role="radiogroup" aria-label="Mode de commande">'
    + '<button type="button" role="radio" data-m="touch">Tactile</button><button type="button" role="radio" data-m="tilt">Inclinaison</button><button type="button" role="radio" data-m="both">Les deux</button></div>'
    + '<div data-adv><label>Sensibilité <b data-sv></b><input type="range" min="1" max="10" step="1" data-s aria-label="Sensibilité de l’inclinaison"></label>'
    + '<label>Zone morte <b data-dv></b><input type="range" min="2" max="15" step="1" data-dz aria-label="Zone morte de l’inclinaison"></label>'
    + '<div class="row"><button type="button" class="mini" data-cal>Calibrer maintenant</button><button type="button" class="mini" data-ask hidden>Autoriser l’inclinaison</button></div></div>'
    + '<p class="nt" aria-live="polite"></p></div>';
  sum.parentNode.insertBefore(grp, sum); ui = grp;
  function paint(){
    grp.querySelectorAll('[data-m]').forEach(function(b){ b.setAttribute('aria-checked', b.dataset.m === S.m ? 'true' : 'false'); });
    grp.querySelector('[data-adv]').style.display = S.m === 'touch' ? 'none' : '';
    grp.querySelector('[data-s]').value = S.s; grp.querySelector('[data-dz]').value = S.dz;
    grp.querySelector('[data-sv]').textContent = S.s + ' / 10'; grp.querySelector('[data-dv]').textContent = S.dz + '°'; note();
  }
  grp.addEventListener('click', function(e){
    var m = e.target.closest('[data-m]'); if(m){ S.m = m.dataset.m; save(); if(S.m !== 'touch'){ sensor = got ? 'ok' : 'unknown'; ask(); listen(); } paint(); return; }
    if(e.target.closest('[data-cal]')){ base = g; armed = false; note(); var n = ui.querySelector('.nt'); n.textContent = 'Position neutre enregistrée.'; setTimeout(note, 1800); return; }
    if(e.target.closest('[data-ask]')) ask(paint);
  });
  grp.addEventListener('input', function(e){ var t = e.target; if(t.matches('[data-s]')) S.s = +t.value; else if(t.matches('[data-dz]')) S.dz = +t.value; else return; save(); paint(); });
  paint(); if(S.m !== 'touch') listen();
}
function paintBar(d, t, run){
  if(!bar){
    var stg = document.querySelector('.cs-stage'); if(!stg) return; css();
    bar = document.createElement('div'); bar.id = 'cs-tilt'; bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<u style="left:10%"></u><u style="right:10%"></u><i></i>'; stg.appendChild(bar);
  }
  var on = run && tiltWanted(); bar.style.display = on ? 'block' : 'none'; if(!on) return;
  var k = Math.max(-1, Math.min(1, d / (t * 1.25)));   /* les repères marquent le seuil de changement de voie */
  bar.querySelector('i').style.left = (50 + k * 50) + '%';
}

/* le tactile latéral est coupé en mode « Inclinaison » seulement quand l'inclinaison fonctionne vraiment */
function touchOk(code){ if(code > 1) return true; if(S.m !== 'tilt') return true; return !(got > 0); }

window.ZCtl = { init:function(h){ host = h; if(document.readyState !== 'loading') setTimeout(mount, 0); else document.addEventListener('DOMContentLoaded', mount); if(S.m !== 'touch') listen(); },
  mount:mount, touchOk:touchOk, ask:ask, settings:function(){ return { m:S.m, s:S.s, dz:S.dz, sensor:sensor, perm:perm, base:base, trig:trig() }; } };
/* demande de permission (iOS) au geste « Prendre la route » : ne bloque rien */
document.addEventListener('click', function(e){ if(S.m !== 'touch' && e.target.closest && e.target.closest('#cs-go')) ask(); }, true);
})();
