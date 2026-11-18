/* ZETWAL — Mòd timoun (protection des mineurs)
   Un mineur peut utiliser le site avec l'accord d'un parent. Le parent appuie sur « Telefòn lan nan men yon timoun » :
   les paiements, commandes, dépenses de points, jeux et publicités sont alors désactivés, jusqu'à ce que le parent
   saisisse son code (PIN) pour quitter le mode.
   Garde-fou par date de naissance : si le profil indique moins de 18 ans, le mode est imposé et ne se désactive pas
   avec le PIN. Sans date de naissance (ou date invalide / future), la personne est considérée comme majeure : aucune limite.
   Ce script doit être chargé tôt (avant la création des clients Supabase) pour garder la main sur fetch. */
(function(){
  'use strict';
  if(window.ZMinor) return;
  var LS = 'zmin', native = window.fetch ? window.fetch.bind(window) : null;
  var birthMinor = false, birthKnown = false, lastNotice = 0, fab = null, wall = null;

  function ls(op, k, v){ try{ var s = window.localStorage; if(op === 'g') return s.getItem(k); if(op === 's') s.setItem(k, v); else s.removeItem(k); }catch(e){ return null; } return null; }
  function devState(){ try{ var o = JSON.parse(ls('g', LS) || 'null'); return o && o.on ? o : null; }catch(e){ return null; } }
  birthMinor = ls('g', 'zmin:b') === '1';
  function active(){ return !!devState() || birthMinor; }
  function pageKey(){ return (location.pathname.split('/').pop() || '').replace(/\.html$/i, '').toLowerCase() || 'index'; }
  var GAME_PAGES = { games:1, sudoku:1, duel:1 };

  /* ── Âge à partir de la date de naissance (AAAA-MM-JJ). Invalide / absente / future => null (= majeur) ── */
  function age(bd){
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(bd || '')); if(!m) return null;
    var y = +m[1], mo = +m[2] - 1, d = +m[3], dt = new Date(y, mo, d);
    if(isNaN(dt.getTime()) || y < 1900 || dt.getFullYear() !== y || dt.getMonth() !== mo || dt > new Date()) return null;
    var n = new Date(), a = n.getFullYear() - y; if(n.getMonth() < mo || (n.getMonth() === mo && n.getDate() < d)) a--; return a;
  }

  /* ── Petites fabriques DOM ── */
  function el(t, css, txt){ var e = document.createElement(t); if(css) e.style.cssText = css; if(txt != null) e.textContent = txt; return e; }
  var GOLD = '#D4AF37', INK = '#13203f';
  function modal(build){
    var prev = document.activeElement, ov = el('div', 'position:fixed;inset:0;z-index:2147483300;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(8,10,20,.72);backdrop-filter:blur(3px)');
    ov.className = 'zmin-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
    var box = el('div', 'width:100%;max-width:420px;max-height:92vh;overflow:auto;background:#fff;color:' + INK + ';border:1px solid ' + GOLD + ';border-radius:22px;padding:22px 20px;box-shadow:0 24px 70px rgba(0,0,0,.5);font-family:var(--sans,Montserrat,system-ui,sans-serif)');
    ov.appendChild(box);
    function close(){ if(ov.parentNode) ov.parentNode.removeChild(ov); document.removeEventListener('keydown', onKey, true); try{ if(prev && prev.focus) prev.focus(); }catch(e){} }
    function onKey(e){ if(e.key === 'Escape'){ e.stopPropagation(); close(); } }
    document.addEventListener('keydown', onKey, true);
    ov.addEventListener('click', function(e){ if(e.target === ov) close(); });
    build(box, close); document.body.appendChild(ov);
    var f = box.querySelector('input,button'); if(f) setTimeout(function(){ try{ f.focus(); }catch(e){} }, 30);
    return close;
  }
  function btn(txt, primary, fn){
    var b = el('button', 'display:block;width:100%;min-height:46px;margin-top:10px;padding:12px 16px;border-radius:99px;font:700 .92rem var(--sans,system-ui);cursor:pointer;border:1px solid ' + GOLD + ';' + (primary ? 'background:' + GOLD + ';color:#17130a' : 'background:transparent;color:' + INK), txt);
    b.type = 'button'; b.addEventListener('click', fn); return b;
  }
  function pinInput(label){
    var w = el('label', 'display:block;margin-top:12px;font-size:.82rem;font-weight:600'), t = document.createTextNode(label), i = el('input', 'display:block;width:100%;margin-top:6px;padding:12px;border:1px solid #b9bfce;border-radius:12px;font-size:1.2rem;letter-spacing:.5em;text-align:center;box-sizing:border-box');
    i.type = 'password'; i.inputMode = 'numeric'; i.maxLength = 4; i.autocomplete = 'off'; i.pattern = '[0-9]*';
    i.addEventListener('input', function(){ i.value = i.value.replace(/\D/g, '').slice(0, 4); });
    w.appendChild(t); w.appendChild(i); w.input = i; return w;
  }
  function hash(pin, salt){
    var data = new TextEncoder().encode(salt + ':' + pin);
    if(window.crypto && crypto.subtle) return crypto.subtle.digest('SHA-256', data).then(function(b){ return Array.prototype.map.call(new Uint8Array(b), function(x){ return ('0' + x.toString(16)).slice(-2); }).join(''); });
    var h = 5381; for(var i = 0; i < data.length; i++) h = ((h << 5) + h + data[i]) | 0; return Promise.resolve('d' + (h >>> 0).toString(16));
  }

  /* ── Message affiché quand une action est bloquée ── */
  function notice(what){
    var t = Date.now(); if(t - lastNotice < 1500) return; lastNotice = t;
    modal(function(b, close){
      b.appendChild(el('h2', 'margin:0 0 8px;font:600 1.35rem var(--serif,Georgia,serif)', 'Mòd timoun aktif'));
      b.appendChild(el('p', 'margin:6px 0;font-size:.92rem;line-height:1.6', (what || 'Aksyon sa a') + ' pa disponib nan mòd timoun. Peman, kòmand, jwèt ak depans pwen fèt pou granmoun sèlman.'));
      b.appendChild(el('p', 'margin:6px 0;font-size:.8rem;line-height:1.55;color:#667', birthMinor ? 'Dat nesans nan pwofil la montre yon moun ki poko gen 18 an.' : 'Yon paran ka dezaktive mòd la ak kòd li (PIN).'));
      b.appendChild(btn('Dakò', true, close));
      if(!birthMinor && devState()) b.appendChild(btn('Mwen se paran an — dezaktive', false, function(){ close(); openOff(); }));
    });
  }

  /* ── Garde-fou central : toute écriture d'argent / commande / jeu est refusée tant que le mode est actif ── */
  var SPEND = { charge:1, transfer_qr:1, transfer_to:1, transfer_email:1 };
  function verdict(input, init){
    try{
      var u = String((input && input.url) || input || ''), m = String((init && init.method) || (input && input.method) || 'GET').toUpperCase();
      if(m === 'GET' || m === 'HEAD' || m === 'OPTIONS') return null;
      if(/\/rest\/v1\/(move_orders|rides)(\?|$)/.test(u) && m === 'POST') return 'Kòmand sa a';
      if(/\/rest\/v1\/rpc\/zj_/.test(u)) return 'Jwèt la';
      if(/\/functions\/v1\/zpoints/.test(u)){
        var body = init && init.body; if(typeof body === 'string'){ var o = JSON.parse(body); if(o && SPEND[o.op]) return o.op === 'charge' ? 'Peman sa a' : 'Don pwen sa a'; }
      }
    }catch(e){}
    return null;
  }
  if(native){
    window.fetch = function(input, init){
      if(active()){
        var v = verdict(input, init);
        if(v){ notice(v); return Promise.resolve(new Response(JSON.stringify({ error:'minor_mode', message:'Mòd timoun aktif' }), { status:403, headers:{ 'content-type':'application/json' } })); }
      }
      return native(input, init);
    };
  }

  /* ── Interface : feuille de réglage pour le parent ── */
  function openOn(){
    modal(function(b, close){
      b.appendChild(el('h2', 'margin:0 0 8px;font:600 1.4rem var(--serif,Georgia,serif)', 'Telefòn lan nan men yon timoun?'));
      b.appendChild(el('p', 'margin:6px 0;font-size:.9rem;line-height:1.6', 'Si yon timoun pral sèvi ak telefòn lan, aktive mòd timoun. Sa retire:'));
      var ul = el('ul', 'margin:6px 0 6px 18px;padding:0;font-size:.88rem;line-height:1.7'); ['Peman ak kòmand (Shop, Kòmand)', 'Depans ak don pwen', 'Jwèt ak jeton', 'Piblisite'].forEach(function(t){ ul.appendChild(el('li', '', t)); }); b.appendChild(ul);
      b.appendChild(el('p', 'margin:6px 0;font-size:.82rem;line-height:1.55;color:#556', 'Chwazi yon kòd 4 chif (PIN) ki pral mande pou dezaktive mòd la. Sèlman paran an dwe konnen l.'));
      var p1 = pinInput('Kòd PIN (4 chif)'), p2 = pinInput('Konfime kòd la'); b.appendChild(p1); b.appendChild(p2);
      var lab = el('label', 'display:flex;gap:10px;align-items:flex-start;margin:14px 0 0;font-size:.82rem;line-height:1.5'), cb = el('input', 'width:20px;height:20px;flex:none;margin-top:2px;accent-color:#B8912A'); cb.type = 'checkbox';
      lab.appendChild(cb); lab.appendChild(el('span', '', 'Mwen se paran oswa gadyen, e mwen konprann sa mòd sa a retire.')); b.appendChild(lab);
      var err = el('p', 'margin:8px 0 0;font-size:.82rem;color:#b3261e;min-height:1.2em'); err.setAttribute('role', 'alert'); b.appendChild(err);
      b.appendChild(btn('Aktive mòd timoun', true, function(){
        var a = p1.input.value, c = p2.input.value;
        if(!/^\d{4}$/.test(a)) return err.textContent = 'Kòd la dwe gen 4 chif.';
        if(a !== c) return err.textContent = 'De kòd yo pa menm.';
        if(!cb.checked) return err.textContent = 'Konfime ou se paran oswa gadyen an.';
        var salt = Math.random().toString(36).slice(2);
        hash(a, salt).then(function(h){ ls('s', LS, JSON.stringify({ on:1, salt:salt, pin:h, at:new Date().toISOString() })); close(); apply(); });
      }));
      b.appendChild(btn('Anile', false, close));
    });
  }
  function openOff(){
    if(birthMinor){ notice('Mòd la'); return; }
    var st = devState(); if(!st) return;
    modal(function(b, close){
      b.appendChild(el('h2', 'margin:0 0 8px;font:600 1.35rem var(--serif,Georgia,serif)', 'Dezaktive mòd timoun'));
      b.appendChild(el('p', 'margin:6px 0;font-size:.9rem;line-height:1.6', 'Antre kòd PIN paran an pou retounen nan mòd nòmal.'));
      var p = pinInput('Kòd PIN'); b.appendChild(p);
      var err = el('p', 'margin:8px 0 0;font-size:.82rem;color:#b3261e;min-height:1.2em'); err.setAttribute('role', 'alert'); b.appendChild(err);
      b.appendChild(btn('Dezaktive', true, function(){
        var lock = Number(ls('g', 'zmin:lock') || 0); if(Date.now() < lock) return err.textContent = 'Twòp eseye. Tann ' + Math.ceil((lock - Date.now()) / 1000) + ' segonn.';
        hash(p.input.value, st.salt).then(function(h){
          if(h === st.pin){ ls('d', LS); ls('d', 'zmin:fail'); ls('d', 'zmin:lock'); close(); apply(); return; }
          var n = Number(ls('g', 'zmin:fail') || 0) + 1; ls('s', 'zmin:fail', String(n));
          if(n >= 5){ ls('s', 'zmin:lock', String(Date.now() + 30000)); ls('d', 'zmin:fail'); err.textContent = 'Twòp eseye. Tann 30 segonn.'; } else err.textContent = 'Kòd la pa bon (' + (5 - n) + ' eseye ki rete).';
          p.input.value = '';
        });
      }));
      b.appendChild(el('p', 'margin:12px 0 0;font-size:.76rem;line-height:1.5;color:#667', 'Ou bliye kòd la ? Efase done sit la nan paramèt navigatè a, epi rekòmanse.'));
      b.appendChild(btn('Anile', false, close));
    });
  }

  /* ── Application de l'état à la page ── */
  var CSS = 'html.zminor a[href^="games"],html.zminor a[href^="sudoku"],html.zminor a[href^="duel"]{display:none!important}'
    + '#zmin-fab{position:fixed;left:max(12px,env(safe-area-inset-left,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:860;min-width:44px;height:44px;border-radius:99px;border:1px solid rgba(212,175,55,.7);background:rgba(13,12,9,.82);color:#f2dc8e;display:flex;align-items:center;justify-content:center;gap:6px;padding:0 12px;cursor:pointer;font:700 .72rem var(--sans,system-ui);backdrop-filter:blur(4px);touch-action:manipulation}'
    + '#zmin-fab.on{background:#D4AF37;color:#17130a;padding:0 14px}#zmin-fab:focus-visible{outline:2px solid #fff;outline-offset:2px}#zmin-fab svg{width:20px;height:20px;flex:none}'
    + '@media (max-width:520px){#zmin-fab:not(.on){opacity:.75}}';
  var SHIELD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z"/><circle cx="12" cy="10" r="2"/><path d="M8.8 16c.7-1.7 2-2.5 3.2-2.5s2.5.8 3.2 2.5"/></svg>';
  function ensureUI(){
    if(!document.body) return;
    if(!document.getElementById('zmin-css')){ var s = el('style'); s.id = 'zmin-css'; s.textContent = CSS; document.head.appendChild(s); }
    if(!fab){
      fab = el('button'); fab.id = 'zmin-fab'; fab.type = 'button'; document.body.appendChild(fab);
      fab.addEventListener('click', function(){ if(active()) openOff(); else openOn(); });
    }
  }
  function apply(){
    ensureUI();
    var on = active(); document.documentElement.classList.toggle('zminor', on);
    if(fab){
      fab.classList.toggle('on', on);
      fab.innerHTML = SHIELD + (on ? '<span>Mòd timoun</span>' : '');
      fab.setAttribute('aria-label', on ? 'Mòd timoun aktif. Paran: dezaktive' : 'Telefòn lan nan men yon timoun ? Aktive mòd timoun');
      fab.title = on ? 'Mòd timoun aktif' : 'Telefòn lan nan men yon timoun';
    }
    if(GAME_PAGES[pageKey()]){
      if(on && !wall){
        wall = el('div', 'position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;background:#0d0c09;color:#f6e8b4;font-family:var(--sans,system-ui)');
        var c = el('div', 'max-width:360px');
        c.appendChild(el('h1', 'margin:0 0 10px;font:600 1.6rem var(--serif,Georgia,serif)', 'Jwèt yo pa disponib'));
        c.appendChild(el('p', 'margin:0 0 18px;line-height:1.6;font-size:.95rem', 'Mòd timoun aktif sou telefòn sa a. Jwèt yo fèt pou granmoun 18 an ak plis sèlman.'));
        var a = el('a', 'display:inline-block;padding:13px 24px;border-radius:99px;background:#D4AF37;color:#17130a;font-weight:700;text-decoration:none', 'Retounen lakay'); a.href = 'index.html'; c.appendChild(a);
        wall.appendChild(c); document.body.appendChild(wall);
      } else if(!on && wall){ wall.remove(); wall = null; }
    }
    try{ window.dispatchEvent(new CustomEvent('zminor:changed', { detail:{ active:on, byBirth:birthMinor } })); }catch(e){}
  }
  function setBirth(isMinor){
    var was = birthMinor; birthMinor = !!isMinor; birthKnown = true;
    if(birthMinor) ls('s', 'zmin:b', '1'); else ls('d', 'zmin:b');
    if(was !== birthMinor) apply();
  }

  /* ── Surveillance du compte : date de naissance du profil (Firestore users/{uid}.birthdate) ── */
  function watch(tries){
    try{
      if(window.firebase && firebase.apps && firebase.apps.length && firebase.auth){
        firebase.auth().onAuthStateChanged(function(u){
          if(!u){ setBirth(false); return; }
          try{
            firebase.firestore().collection('users').doc(u.uid).get().then(function(s){
              var a = age(s && s.exists ? s.data().birthdate : null);
              setBirth(a !== null && a < 18);
            }).catch(function(){});
          }catch(e){}
        });
        return;
      }
    }catch(e){}
    if(tries < 40) setTimeout(function(){ watch(tries + 1); }, 400);
  }

  window.ZMinor = { active:active, byBirth:function(){ return birthMinor; }, open:function(){ if(active()) openOff(); else openOn(); }, age:age, notice:notice };
  function boot(){ apply(); watch(0); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  /* Boutons de confirmation de commande : message clair avant même l'envoi */
  document.addEventListener('click', function(e){
    if(!active()) return; var t = e.target && e.target.closest && e.target.closest('#cart-go'); if(!t) return;
    e.preventDefault(); e.stopImmediatePropagation(); notice('Kòmand sa a');
  }, true);
})();
