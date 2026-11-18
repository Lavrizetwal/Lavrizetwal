/* ZETWAL — annonces (bandeau doré en haut des pages) et publicités (carte qui monte en bas).
   Tout est piloté par l'admin (tables z_announcements / z_ads, lecture via la fonction z_site_promos).
   · Annonce : bordure fine haut et bas où coule un liquide doré, grains d'or qui s'en échappent.
   · Publicité : image ou vidéo (15 s), étiquette « Piblisite » toujours visible, bouton Fèmen après un délai fixé par l'admin.
   Aucune donnée personnelle : seuls des compteurs anonymes (vues / clics) sont envoyés. */
(function(){
  'use strict';
  var URL_ = 'https://mzwibzvdcwapqrtbhxox.supabase.co';
  var KEY_ = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16d2lienZkY3dhcHFydGJoeG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzcxNTIsImV4cCI6MjA5MTc1MzE1Mn0.utazGnMswFOiArB66kfok7n2ds1Zr2wyVBRYVOFRT6c';

  var REDUCED = false; try{ REDUCED = !!(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches); }catch(e){}
  var CSS = [
    /* ── Bandeau d'annonce ── */
    '.zpa{position:fixed;top:0;left:0;right:0;z-index:900;height:var(--zpa-h,38px);display:flex;align-items:center;justify-content:center;',
    'background:linear-gradient(180deg,#0b0a07,#17130a);color:#f6e8b4;font:600 .8rem/1.2 var(--sans,Montserrat,system-ui,sans-serif);letter-spacing:.2px;}',
    '.zpa.in{position:relative;height:38px;border-radius:12px;overflow:visible}',
    '.zpa-l{position:absolute;left:0;right:0;height:2px;background:rgba(212,175,55,.22);overflow:hidden;pointer-events:none}',
    '.zpa-l.t{top:0}.zpa-l.b{bottom:0}',
    '.zpa-l::before,.zpa-l::after{content:"";position:absolute;top:0;bottom:0;width:38%;left:-40%;',
    'background:linear-gradient(90deg,rgba(212,175,55,0),#b8912a 25%,#fff0b0 50%,#d4af37 75%,rgba(212,175,55,0));filter:drop-shadow(0 0 3px rgba(240,200,80,.9));animation:zpaflow 5.2s linear infinite}',
    '.zpa-l::after{width:22%;animation-duration:7.4s;animation-delay:-2.6s;opacity:.85}',
    '.zpa-l.b::before,.zpa-l.b::after{animation-direction:reverse}',
    '@keyframes zpaflow{from{left:-40%}to{left:105%}}',
    '.zpa-c{position:absolute;left:0;top:0;width:100%;pointer-events:none}',
    '.zpa-m{position:relative;z-index:1;min-width:0;max-width:calc(100% - 96px);overflow:hidden;white-space:nowrap;text-align:center}',
    '.zpa-m>span{display:inline-block;padding:0 4px}',
    '.zpa-m.mq>span{animation:zpamq 16s linear infinite;padding-left:100%}',
    '@keyframes zpamq{to{transform:translateX(-100%)}}',
    '.zpa-m a{color:inherit;text-decoration:none}',
    '.zpa-m a:hover b,.zpa-m a:focus-visible b{text-decoration:underline}',
    '.zpa-m b{font-weight:700;color:#ffe9a0;margin-left:10px;border:1px solid rgba(212,175,55,.5);border-radius:99px;padding:2px 9px;font-size:.72rem}',
    '.zpa-x{position:absolute;right:max(4px,env(safe-area-inset-right,0px));top:0;bottom:0;width:40px;z-index:2;border:0;background:none;color:#e9d48a;cursor:pointer;font-size:1.05rem;line-height:1;touch-action:manipulation}',
    '.zpa-x:hover{color:#fff}.zpa-x:focus-visible,.zpa-m a:focus-visible{outline:2px solid #d4af37;outline-offset:-3px}',
    'html.zpa-on body{padding-top:var(--zpa-h,38px)}',
    '@media (max-width:520px){.zpa{font-size:.74rem}}',
    '@media (prefers-reduced-motion:reduce){.zpa-l::before,.zpa-l::after{animation:none;left:10%;width:80%;opacity:.5}.zpa-m.mq>span{animation:none;padding-left:4px}}',
    /* ── Publicité ── */
    '.zpad{position:fixed;z-index:880;bottom:calc(84px + env(safe-area-inset-bottom,0px));width:var(--w,240px);max-width:calc(100vw - 32px);',
    'border:1px solid rgba(212,175,55,.55);background:#0d0c09;color:#fff;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.4);',
    'transform:translateY(calc(100% + 40px));opacity:0;transition:transform .55s cubic-bezier(.22,1,.36,1),opacity .35s ease;font-family:var(--sans,Montserrat,system-ui,sans-serif)}',
    '.zpad.in{position:relative;bottom:auto;transform:none;opacity:1;margin:0 auto}',
    '.zpad.on{transform:none;opacity:1}',
    '.zpad.br{right:max(16px,env(safe-area-inset-right,0px))}.zpad.bl{left:max(16px,env(safe-area-inset-left,0px))}.zpad.bc{left:50%;margin-left:calc(var(--w,240px) / -2)}',
    '@media (max-width:520px){.zpad.bc{margin-left:0;left:16px;right:16px;width:auto}}',
    '.zpad.sq{--w:220px;aspect-ratio:1/1;border-radius:6px}',
    '.zpad.rd{--w:250px;aspect-ratio:4/5;border-radius:22px}',
    '.zpad.wd{--w:340px;aspect-ratio:16/9;border-radius:16px}',
    '.zpad.ar{--w:240px;aspect-ratio:4/5;border-radius:120px 120px 18px 18px}',
    '.zpad-med{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:#000}',
    '.zpad-sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45) 0,rgba(0,0,0,0) 28%,rgba(0,0,0,0) 48%,rgba(0,0,0,.82) 100%);pointer-events:none}',
    '.zpad-tag{position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:3;font-size:.62rem;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;padding:3px 10px;border-radius:99px;background:rgba(0,0,0,.6);border:1px solid rgba(212,175,55,.6);color:#f2dc8e}',
    '.zpad.ar .zpad-tag{top:20px}',
    '.zpad-x{position:absolute;top:6px;right:6px;z-index:4;min-width:36px;height:36px;border-radius:99px;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.6);color:#fff;font:600 .72rem var(--sans,system-ui);cursor:pointer;padding:0 10px;touch-action:manipulation}',
    '.zpad-x[disabled]{opacity:.7;cursor:default}.zpad-x:focus-visible,.zpad-snd:focus-visible,.zpad-cta:focus-visible,.zpad-hit:focus-visible{outline:2px solid #d4af37;outline-offset:2px}',
    '.zpad-snd{position:absolute;top:6px;left:6px;z-index:4;width:36px;height:36px;border-radius:99px;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.6);color:#fff;cursor:pointer;font-size:.95rem;touch-action:manipulation}',
    '.zpad-hit{position:absolute;inset:0;z-index:2;display:block}',
    '.zpad-tx{position:absolute;left:0;right:0;bottom:6px;z-index:3;padding:10px 14px 12px;text-align:left;pointer-events:none}',
    '.zpad.ar .zpad-tx{text-align:center}',
    '.zpad-tx b{display:block;font-family:var(--serif,Georgia,serif);font-size:1.05rem;line-height:1.2;margin-bottom:3px}',
    '.zpad-tx span{display:block;font-size:.76rem;line-height:1.4;opacity:.9}',
    '.zpad-cta{pointer-events:auto;margin-top:9px;display:inline-block;min-height:36px;line-height:36px;padding:0 16px;border-radius:99px;background:#d4af37;color:#17130a;font-weight:700;font-size:.76rem;text-decoration:none;cursor:pointer;border:0;position:relative;z-index:5}',
    '.zpad-bar{position:absolute;left:0;bottom:0;height:3px;width:100%;z-index:5;background:rgba(212,175,55,.2)}',
    '.zpad-bar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#b8912a,#ffe9a0);transform-origin:left;transform:scaleX(1)}',
    '@media (prefers-reduced-motion:reduce){.zpad{transition:opacity .2s ease;transform:none}}'
  ].join('');

  function el(t, c, txt){ var e = document.createElement(t); if(c) e.className = c; if(txt != null) e.textContent = txt; return e; }
  function style(){ if(document.getElementById('zpa-css')) return; var s = el('style'); s.id = 'zpa-css'; s.textContent = CSS; document.head.appendChild(s); }
  function safeHref(u){
    u = String(u || '').trim(); if(!u) return null;
    if(/^https?:\/\/[^\s]+$/i.test(u)) return { href:u, ext:true };
    if(/^[A-Za-z0-9_\-./?=&#%]+$/.test(u) && !/^(javascript|data|vbscript):/i.test(u) && u.indexOf('//') !== 0) return { href:u, ext:false };
    return null;
  }
  function safeMedia(u){ u = String(u || '').trim(); return /^https:\/\/[^\s"'<>]+$/i.test(u) ? u : null; }
  function store(kind){ try{ return window[kind]; }catch(e){ return null; } }
  function sget(kind, k){ try{ var s = store(kind); return s ? s.getItem(k) : null; }catch(e){ return null; } }
  function sset(kind, k, v){ try{ var s = store(kind); if(s) s.setItem(k, v); }catch(e){} }
  function pageKey(){ var p = (location.pathname.split('/').pop() || '').replace(/\.html$/i, '').toLowerCase(); return p || 'index'; }

  var hdrs = function(tok){ var h = { apikey:KEY_, 'Content-Type':'application/json' }; h.Authorization = 'Bearer ' + (tok || KEY_); return h; };
  function sendEvent(kind, id, ev){
    try{ fetch(URL_ + '/rest/v1/rpc/z_promo_event', { method:'POST', keepalive:true, headers:hdrs(null), body:JSON.stringify({ p_kind:kind, p_id:id, p_ev:ev }) }).catch(function(){}); }catch(e){}
  }

  /* ── Grains d'or qui s'échappent des deux bordures ── */
  function grains(host, h){
    var cv = el('canvas', 'zpa-c'); cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv);
    var ctx = cv.getContext && cv.getContext('2d'); if(!ctx || REDUCED) return { stop:function(){ if(cv.parentNode) cv.parentNode.removeChild(cv); } };
    var W = 0, H = h + 14, dpr = Math.min(2, window.devicePixelRatio || 1), P = [], raf = 0, last = 0, dead = false;
    function size(){ W = host.clientWidth || 300; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); var ro = null; try{ ro = new ResizeObserver(size); ro.observe(host); }catch(e){ window.addEventListener('resize', size); }
    var COL = ['255,236,160', '240,200,80', '212,175,55', '255,250,215'];
    function spawn(){
      var top = Math.random() < .5, dir = top ? 1 : (Math.random() < .7 ? 1 : -1);
      P.push({ x:Math.random() * W, y:top ? 1.2 : h - 1.2, vx:(Math.random() - .5) * .25, vy:dir * (.12 + Math.random() * .38), life:0, max:46 + Math.random() * 50, r:.5 + Math.random() * 1.1, c:COL[(Math.random() * COL.length) | 0] });
    }
    function frame(t){
      if(dead) return; raf = requestAnimationFrame(frame);
      if(document.hidden || t - last < 33) return; last = t;
      ctx.clearRect(0, 0, W, H);
      if(P.length < 44 && Math.random() < .6) spawn();
      for(var i = P.length - 1; i >= 0; i--){
        var p = P[i]; p.life++; p.x += p.vx; p.y += p.vy;
        var k = p.life / p.max; if(k >= 1 || p.y < -2 || p.y > H){ P.splice(i, 1); continue; }
        var a = (k < .2 ? k / .2 : 1 - (k - .2) / .8) * (.55 + .45 * Math.sin(p.life * .5));
        ctx.beginPath(); ctx.fillStyle = 'rgba(' + p.c + ',' + Math.max(0, a).toFixed(3) + ')'; ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
    }
    raf = requestAnimationFrame(frame);
    return { stop:function(){ dead = true; cancelAnimationFrame(raf); try{ if(ro) ro.disconnect(); else window.removeEventListener('resize', size); }catch(e){} if(cv.parentNode) cv.parentNode.removeChild(cv); } };
  }

  /* ── Décalage des éléments collés en haut (menus fixes) pour que le bandeau ne gêne rien ── */
  var shifted = [];
  function shiftFixed(h){
    unshift();
    try{
      var all = document.querySelectorAll('body > *, body > * > *');
      for(var i = 0; i < all.length; i++){
        var n = all[i]; if(n.id === 'zpa' || n.id === 'zpad') continue;
        var cs = getComputedStyle(n);
        var rc = n.getBoundingClientRect();
        if((cs.position === 'fixed' || cs.position === 'sticky') && cs.top === '0px' && rc.top <= 1 && rc.height > 0 && rc.height < window.innerHeight * .6 && cs.display !== 'none'){
          shifted.push({ n:n, top:n.style.top }); n.style.top = h + 'px';
        }
      }
    }catch(e){}
  }
  function unshift(){ shifted.forEach(function(s){ try{ s.n.style.top = s.top; }catch(e){} }); shifted = []; }

  /* ── Construction du bandeau ── */
  function buildAnn(items, opt){
    opt = opt || {};
    var bar = el('div', 'zpa' + (opt.inline ? ' in' : '')); if(!opt.preview) bar.id = 'zpa'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Anons');
    bar.appendChild(el('i', 'zpa-l t')); bar.appendChild(el('i', 'zpa-l b'));
    var msg = el('div', 'zpa-m'); msg.setAttribute('aria-live', 'polite'); bar.appendChild(msg);
    var x = null, idx = 0, timer = 0, g = null;
    function show(i){
      var a = items[i], sp = el('span'); msg.className = 'zpa-m'; msg.innerHTML = '';
      var link = safeHref(a.link_url);
      if(link){
        var an = el('a'); an.href = link.href; if(link.ext){ an.target = '_blank'; an.rel = 'noopener noreferrer'; }
        an.appendChild(document.createTextNode(a.text || ''));
        if(a.link_label) an.appendChild(el('b', '', a.link_label));
        if(!opt.preview) an.addEventListener('click', function(){ sendEvent('ann', a.id, 'click'); });
        sp.appendChild(an);
      } else sp.textContent = a.text || '';
      msg.appendChild(sp);
      requestAnimationFrame(function(){ if(sp.scrollWidth > msg.clientWidth + 4 && !REDUCED) msg.classList.add('mq'); });
      if(!opt.preview && !a._seen){ a._seen = 1; sendEvent('ann', a.id, 'view'); }
    }
    show(0);
    if(items.length > 1){ timer = setInterval(function(){ idx = (idx + 1) % items.length; show(idx); }, 7500); }
    if(opt.dismissible){
      x = el('button', 'zpa-x', '✕'); x.type = 'button'; x.setAttribute('aria-label', 'Fèmen anons lan');
      x.addEventListener('click', function(){ if(opt.onClose) opt.onClose(items); api.removeAnn(); }); bar.appendChild(x);
    }
    bar.__stop = function(){ clearInterval(timer); if(g) g.stop(); };
    bar.__grains = function(){ g = grains(bar, bar.clientHeight || 38); };
    return bar;
  }

  /* ── Construction de la publicité ── */
  function buildAd(ad, opt){
    opt = opt || {};
    var pos = ad.position === 'bottom-left' ? 'bl' : ad.position === 'bottom-center' ? 'bc' : 'br';
    var shp = ad.shape === 'square' ? 'sq' : ad.shape === 'wide' ? 'wd' : ad.shape === 'arch' ? 'ar' : 'rd';
    var card = el('div', 'zpad ' + shp + ' ' + (opt.inline ? 'in' : pos)); if(!opt.preview) card.id = 'zpad'; card.setAttribute('role', 'complementary'); card.setAttribute('aria-label', 'Piblisite');
    var url = (opt.preview && /^blob:/.test(String(ad.media_url || ''))) ? ad.media_url : safeMedia(ad.media_url), med = null;
    if(!url) return null;
    if(ad.kind === 'video'){
      med = el('video', 'zpad-med'); med.muted = true; med.defaultMuted = true; med.setAttribute('muted', ''); med.playsInline = true; med.setAttribute('playsinline', ''); med.preload = 'auto';
      var po = safeMedia(ad.poster_url); if(po) med.poster = po; med.src = url; med.disablePictureInPicture = true;
    } else { med = el('img', 'zpad-med'); med.alt = ad.title || 'Piblisite'; med.decoding = 'async'; med.src = url; }
    card.appendChild(med); card.appendChild(el('div', 'zpad-sh'));
    card.appendChild(el('span', 'zpad-tag', 'Piblisite'));
    var link = safeHref(ad.cta_url), cta = null;
    if(link){ var hit = el('a', 'zpad-hit'); hit.href = link.href; hit.setAttribute('aria-label', ad.title || 'Louvri piblisite a'); if(link.ext){ hit.target = '_blank'; hit.rel = 'noopener noreferrer'; } card.appendChild(hit);
      hit.addEventListener('click', function(){ if(!opt.preview) sendEvent('ad', ad.id, 'click'); }); }
    if(ad.title || ad.body || (link && ad.cta_label)){
      var tx = el('div', 'zpad-tx');
      if(ad.title) tx.appendChild(el('b', '', ad.title)); if(ad.body) tx.appendChild(el('span', '', ad.body));
      if(link && ad.cta_label){ cta = el('a', 'zpad-cta', ad.cta_label); cta.href = link.href; if(link.ext){ cta.target = '_blank'; cta.rel = 'noopener noreferrer'; }
        cta.addEventListener('click', function(){ if(!opt.preview) sendEvent('ad', ad.id, 'click'); }); tx.appendChild(cta); }
      card.appendChild(tx);
    }
    var bar = el('div', 'zpad-bar'), fill = el('i'); bar.appendChild(fill); card.appendChild(bar);
    var x = el('button', 'zpad-x'); x.type = 'button'; x.setAttribute('aria-label', 'Fèmen piblisite a'); card.appendChild(x);
    if(ad.kind === 'video' && ad.sound){
      var sn = el('button', 'zpad-snd', '🔇'); sn.type = 'button'; sn.setAttribute('aria-label', 'Mete son an');
      sn.addEventListener('click', function(){ med.muted = !med.muted; sn.textContent = med.muted ? '🔇' : '🔊'; sn.setAttribute('aria-label', med.muted ? 'Mete son an' : 'Koupe son an'); }); card.appendChild(sn);
    }
    /* minuterie : démarre quand l'image est chargée / la vidéo joue */
    var total = Math.max(3, Math.min(60, Number(ad.show_s) || 15)) * 1000, skip = Math.max(0, Number(ad.skip_after_s) || 0) * 1000;
    var t0 = 0, acc = 0, raf = 0, done = false, started = false;
    function closeNow(){ if(done) return; done = true; cancelAnimationFrame(raf); try{ if(med.pause) med.pause(); }catch(e){} if(opt.onClose) opt.onClose(); card.classList.remove('on');
      setTimeout(function(){ if(card.parentNode) card.parentNode.removeChild(card); }, 600); }
    x.addEventListener('click', function(){ if(!x.disabled) closeNow(); });
    function tick(now){
      if(done) return; raf = requestAnimationFrame(tick);
      if(document.hidden){ t0 = now; return; }
      acc += now - t0; t0 = now;
      var left = total - acc; fill.style.transform = 'scaleX(' + Math.max(0, left / total).toFixed(4) + ')';
      if(acc < skip){ x.disabled = true; x.textContent = Math.ceil((skip - acc) / 1000); } else { x.disabled = false; x.textContent = '✕ Fèmen'; }
      if(left <= 0 && !opt.noAuto) closeNow();
    }
    function start(){ if(started) return; started = true; if(opt.onStart) opt.onStart(); t0 = performance.now(); raf = requestAnimationFrame(tick); if(ad.kind === 'video'){ try{ var pr = med.play(); if(pr && pr.catch) pr.catch(function(){}); }catch(e){} } }
    card.__go = function(){
      if(ad.kind === 'video'){
        var ok = false;
        med.addEventListener('playing', function(){ ok = true; start(); }, { once:true });
        med.addEventListener('ended', function(){ if(!opt.noAuto) closeNow(); else { try{ med.currentTime = 0; med.play(); }catch(e){} } });
        med.addEventListener('error', function(){ if(!ok){ if(opt.onFail) opt.onFail(); closeNow(); } });
        try{ var p = med.play(); if(p && p.catch) p.catch(function(){ if(!ok){ if(opt.onFail) opt.onFail(); closeNow(); } }); }catch(e){}
        setTimeout(function(){ if(!ok && !done){ if(opt.onFail) opt.onFail(); closeNow(); } }, 9000);
      } else {
        if(med.complete && med.naturalWidth) start(); else { med.addEventListener('load', start, { once:true }); med.addEventListener('error', function(){ if(opt.onFail) opt.onFail(); closeNow(); }); }
      }
    };
    card.__close = closeNow;
    return card;
  }

  /* ── Orchestration ── */
  var annEl = null, adEl = null, ro2 = null;
  var api = {
    removeAnn:function(){
      if(!annEl) return; try{ annEl.__stop(); }catch(e){} if(annEl.parentNode) annEl.parentNode.removeChild(annEl); annEl = null;
      document.documentElement.classList.remove('zpa-on'); document.documentElement.style.removeProperty('--zpa-h'); unshift(); if(ro2){ ro2.disconnect(); ro2 = null; }
    },
    showAnn:function(items){
      if(!items.length) return; style(); api.removeAnn();
      var dismissible = items.every(function(a){ return a.dismissible; });
      annEl = buildAnn(items, { dismissible:dismissible, onClose:function(list){ list.forEach(function(a){ sset('sessionStorage', 'zpa:' + a.id + ':' + a.v, '1'); }); } });
      document.body.insertBefore(annEl, document.body.firstChild);
      var h = annEl.offsetHeight || 38; document.documentElement.style.setProperty('--zpa-h', h + 'px'); document.documentElement.classList.add('zpa-on');
      shiftFixed(h); annEl.__grains();
      try{ ro2 = new MutationObserver(function(){ clearTimeout(ro2._t); ro2._t = setTimeout(function(){ if(annEl) shiftFixed(annEl.offsetHeight || h); }, 300); }); ro2.observe(document.body, { childList:true }); }catch(e){}
      setTimeout(function(){ if(annEl) shiftFixed(annEl.offsetHeight || h); }, 1200);
    },
    showAd:function(ad){
      style(); if(adEl) return;
      var c = buildAd(ad, { onStart:function(){ sendEvent('ad', ad.id, 'view'); }, onClose:function(){ adEl = null; } });
      if(!c) return; adEl = c; document.body.appendChild(c);
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ c.classList.add('on'); }); }); c.__go();
    },
    /* Aperçus pour l'admin : rendus dans un conteneur, sans compteurs, sans stockage */
    previewAnn:function(host, item){
      style(); host.innerHTML = ''; var bar = buildAnn([item], { inline:true, preview:true, dismissible:false }); host.appendChild(bar); bar.__grains(); return bar;
    },
    previewAd:function(host, ad){
      style(); host.innerHTML = ''; var c = buildAd(ad, { inline:true, preview:true, noAuto:true }); if(!c) return null; host.appendChild(c); c.classList.add('on'); c.__go(); return c;
    }
  };

  function eligibleAd(ad){
    var key = 'zpad:' + ad.id + ':' + ad.v;
    if(ad.frequency === 'session') return !sget('sessionStorage', key);
    if(ad.frequency === 'day'){ var t = Number(sget('localStorage', key) || 0); return !t || Date.now() - t > 86400000; }
    return true;
  }
  function markAd(ad){
    var key = 'zpad:' + ad.id + ':' + ad.v;
    if(ad.frequency === 'session') sset('sessionStorage', key, '1'); else if(ad.frequency === 'day') sset('localStorage', key, String(Date.now()));
  }
  async function load(){
    var tok = null; try{ if(window.ZB && ZB.token) tok = await ZB.token(); }catch(e){}
    var r = await fetch(URL_ + '/rest/v1/rpc/z_site_promos', { method:'POST', headers:hdrs(tok), body:JSON.stringify({ p_page:pageKey() }) });
    if(!r.ok) return null; return r.json();
  }
  async function init(){
    if(window.ZPROMO_OFF) return;
    try{
      var d = await load(); if(!d) return;
      var anns = (d.announcements || []).filter(function(a){ return !sget('sessionStorage', 'zpa:' + a.id + ':' + a.v); });
      if(anns.length) api.showAnn(anns);
      var ad = (window.ZMinor && ZMinor.active()) ? null : (d.ads || []).filter(eligibleAd)[0];
      if(ad) setTimeout(function(){
        if(document.hidden){ document.addEventListener('visibilitychange', function f(){ if(!document.hidden){ document.removeEventListener('visibilitychange', f); go(); } }); } else go();
        function go(){ if(adEl || (window.ZMinor && ZMinor.active())) return; var ok = true; api.showAd(Object.assign({}, ad)); if(adEl){ markAd(ad); } }
      }, Math.max(0, Number(ad.delay_s) || 0) * 1000);
    }catch(e){}
  }
  window.ZPromo = api;
  function boot(){
    /* On attend que Firebase ait dit si quelqu'un est connecté (audience « connectés »), 2,5 s au plus. */
    var fired = false; function go(){ if(fired) return; fired = true; init(); }
    try{ if(window.firebase && firebase.apps && firebase.apps.length){ var un = firebase.auth().onAuthStateChanged(function(){ try{ un(); }catch(e){} setTimeout(go, 300); }); } }catch(e){}
    setTimeout(go, 2500);
  }
  if(document.readyState === 'complete') boot(); else window.addEventListener('load', boot);
})();
