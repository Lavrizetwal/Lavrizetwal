/* ════════════════════════════════════════════════════════════════
   ZETWAL — Pwofil pataje ant tout paj sit la
   ────────────────────────────────────────────────────────────────
   Yon sèl fichye, mete nan chak paj (akèy, lavri, shop, jwèt) jis
   anvan </body> : <script src="zetwal-profile.js"></script>

   Li itilize sa paj la deja genyen — CONFIG, sb (Supabase), auth ak
   fs (Firebase) — pa gen dezyèm koneksyon pou fè. Li pran bouton
   #who-btn (non + pwen, anwo adwat) e li fè l louvri pwofil la
   dirèkteman, olye de ti meni kout ki te la anvan an.
   ════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  /* Menm baz Supabase ak Firebase ke tout lòt paj sit la itilize.
     Nou pa konte sou CONFIG/sb/auth/fs paj la — yo fèmen anndan yon
     IIFE prive, script deyò a pa ka wè yo. Nou kreye pwòp koneksyon
     nou, ak menm valè yo — kle piblik la, li deja nan 6 paj HTML. */
  var SUPABASE_URL = 'https://mzwibzvdcwapqrtbhxox.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16d2lienZkY3dhcHFydGJoeG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzcxNTIsImV4cCI6MjA5MTc1MzE1Mn0.utazGnMswFOiArB66kfok7n2ds1Zr2wyVBRYVOFRT6c';
  var FIREBASE_CONFIG = {
    apiKey: "AIzaSyAjCnmtvu0tqlsNDEtKraKBG79y12qYeCQ",
    authDomain: "lavrizetwal.firebaseapp.com",
    projectId: "lavrizetwal",
    storageBucket: "lavrizetwal.firebasestorage.app",
    messagingSenderId: "291921316186",
    appId: "1:291921316186:web:f55e8b34526960df394b63"
  };

  var sb = null, auth = null, fs = null;
  var bootTries = 0;

  function showBootError(reason){
    if(document.getElementById('zp-bootfail')) return;
    var box = document.createElement('div');
    box.id = 'zp-bootfail';
    box.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:320px;'
      + 'background:#3a1414;border:1px solid #a33;color:#ffd6d6;padding:10px 13px;border-radius:8px;'
      + 'font:12px/1.5 sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.5)';
    box.innerHTML = '<b>Pwofil pa chaje</b><br>' + reason
      + '<br><span style="opacity:.75">Verifye si zetwal-profile.js mete sou sèvè a, bò kot paj sa a.</span>'
      + '<span style="float:right;cursor:pointer;margin-left:8px;opacity:.7" onclick="this.parentNode.remove()">✕</span>';
    document.body.appendChild(box);
    console.warn('[ZetwalProfile] Pa reyisi lanse:', reason);
  }

  function boot(){
    bootTries++;
    if(!window.supabase || !window.firebase){
      if(bootTries > 40){ showBootError('Supabase oswa Firebase pa chaje apre 10s (script CDN ka bloke).'); return; }
      setTimeout(boot, 250); return;
    }
    try{ sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY); }
    catch(e){ if(bootTries > 40){ showBootError('Koneksyon Supabase echwe : ' + e.message); return; } setTimeout(boot, 400); return; }
    try{
      /* firebase.apps se yon rejis global — si paj la deja lanse Firebase,
         nou repran menm app lan olye de kreye yon dezyèm san rezon. */
      if(firebase.apps && firebase.apps.length === 0) firebase.initializeApp(FIREBASE_CONFIG);
      auth = firebase.auth(); fs = firebase.firestore();
    }catch(e){ if(bootTries > 40){ showBootError('Koneksyon Firebase echwe : ' + e.message); return; } setTimeout(boot, 400); return; }
    if(!window.$){ window.$ = function(s){ return document.querySelector(s); }; }
    if(!window.$$){ window.$$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }; }
    if(!document.getElementById('who-btn')){
      if(bootTries > 40){ showBootError('Pa jwenn #who-btn nan paj sa a (meni kont lan).'); return; }
      setTimeout(boot, 250); return;
    }
    console.log('[ZetwalProfile] Chaje ak siksè.');
    init();
  }

  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function initial(s){ return (s||'Z').trim().charAt(0).toUpperCase() || 'Z'; }
  function fmt(n){ return Math.round(n||0).toLocaleString('fr-FR'); }
  function toast(t){
    var el = $('#toast');
    if(!el){ el = document.createElement('div'); el.className='toast'; el.id='toast'; document.body.appendChild(el); }
    el.textContent = t; el.classList.add('show');
    clearTimeout(el._h); el._h = setTimeout(function(){ el.classList.remove('show'); }, 3200);
  }

  var CSS = ""
  + ".zp-panel{position:fixed;top:0;right:0;bottom:0;width:430px;max-width:96vw;z-index:1012;display:flex;"
  + "  flex-direction:column;background:rgba(8,8,8,.98);backdrop-filter:blur(24px);"
  + "  border-left:1px solid var(--line);box-shadow:-30px 0 70px rgba(0,0,0,.6);"
  + "  transform:translateX(102%);transition:transform .35s cubic-bezier(.4,0,.2,1)}"
  + ".zp-panel.open{transform:none}"
  + ".zp-h{display:flex;align-items:center;gap:12px;padding:20px 22px 16px;border-bottom:1px solid var(--line)}"
  + ".zp-t{font-family:var(--serif);font-size:1.2rem;font-weight:600;letter-spacing:.5px}"
  + ".zp-s{font-size:.56rem;letter-spacing:1.6px;text-transform:uppercase;color:var(--ink-4)}"
  + ".zp-x{margin-left:auto;width:30px;height:30px;border-radius:50%;border:1px solid var(--line);background:none;"
  + "  color:var(--ink-3);cursor:pointer;display:grid;place-items:center;flex-shrink:0}"
  + ".zp-x:hover{color:var(--gold);border-color:var(--g-24)}"
  + ".zp-x svg{width:14px;height:14px;stroke:currentColor;stroke-width:1.7;fill:none}"
  + ".zp-b{flex:1;overflow-y:auto;padding:18px 22px}"
  + ".zp-b::-webkit-scrollbar{width:3px}.zp-b::-webkit-scrollbar-thumb{background:var(--g-24);border-radius:2px}"
  + ".zpcard{padding:16px 17px;border-radius:11px;border:1px solid var(--line);"
  + "  background:rgba(255,255,255,.028);margin-bottom:14px}"
  + ".zpcard .k{font-size:.55rem;letter-spacing:1.7px;text-transform:uppercase;color:var(--ink-4);margin-bottom:6px}"
  + ".zpcard .v{font-family:var(--serif);font-size:1.9rem;font-weight:700;color:var(--gold)}"
  + ".zpcard .v s{font-family:var(--sans);font-size:.65rem;font-weight:600;color:var(--ink-3);text-decoration:none;margin-left:7px}"
  + ".zprole{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;"
  + "  border:1px solid var(--g-24);background:var(--g-08);color:var(--gold);font-size:.62rem;"
  + "  font-weight:700;letter-spacing:.6px;margin:4px 6px 0 0}"
  + ".zptabs{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;border-bottom:1px solid var(--line);padding-bottom:14px}"
  + ".zptabs button{padding:7px 13px;border-radius:99px;border:1px solid var(--line);background:none;"
  + "  color:var(--ink-3);font-family:var(--sans);font-size:.62rem;font-weight:600;letter-spacing:.3px;cursor:pointer}"
  + ".zptabs button.on{background:var(--gold);border-color:var(--gold);color:#0A0A0A}"
  + ".zptx{display:flex;align-items:flex-start;gap:12px;padding:12px 13px;border-radius:9px;margin-bottom:9px;"
  + "  border-left:3px solid var(--line);background:rgba(255,255,255,.025)}"
  + ".zptx.in{border-left-color:var(--ok,#0e8)}.zptx.out{border-left-color:var(--gold)}"
  + ".zptx .ic{width:32px;height:32px;border-radius:50%;flex-shrink:0;display:grid;place-items:center;background:rgba(255,255,255,.05)}"
  + ".zptx .ic svg{width:14px;height:14px;stroke:currentColor;stroke-width:1.8;fill:none}"
  + ".zptx.in .ic{color:var(--ok,#0e8)}.zptx.out .ic{color:var(--gold)}"
  + ".zptx .bd{flex:1;min-width:0}.zptx .bd b{display:block;font-size:.8rem}"
  + ".zptx .bd span{display:block;font-size:.66rem;color:var(--ink-4);margin-top:2px}"
  + ".zptx .am{font-family:var(--serif);font-weight:700;font-size:.95rem;white-space:nowrap}"
  + ".zptx.in .am{color:var(--ok,#0e8)}.zptx.out .am{color:var(--gold)}"
  + ".zp-fld{margin-bottom:14px}"
  + ".zp-fld label{display:block;font-size:.58rem;letter-spacing:1.4px;text-transform:uppercase;color:var(--ink-4);margin-bottom:7px}"
  + ".zp-fld input,.zp-fld textarea{width:100%;padding:11px 13px;border-radius:8px;border:1px solid var(--line);"
  + "  background:rgba(255,255,255,.03);color:var(--ink-1);font-family:var(--sans);font-size:.8rem}"
  + ".zp-fld textarea{min-height:74px;resize:vertical}"
  + ".zp-av-row{display:flex;align-items:center;gap:16px;margin-bottom:18px}"
  + ".zp-av-big{width:64px;height:64px;border-radius:50%;flex-shrink:0;overflow:hidden;background:var(--g-08);"
  + "  border:1px solid var(--g-24);color:var(--gold);font-family:var(--serif);font-size:1.5rem;font-weight:700;display:grid;place-items:center}"
  + ".zp-av-big img{width:100%;height:100%;object-fit:cover}"
  + ".zp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 18px;border-radius:8px;"
  + "  border:1px solid var(--g-24);background:none;color:var(--ink-1);font-family:var(--sans);font-size:.68rem;"
  + "  font-weight:700;letter-spacing:.4px;cursor:pointer;text-decoration:none}"
  + ".zp-btn:hover{border-color:var(--gold);color:var(--gold)}"
  + ".zp-btn.go{background:var(--gold);border-color:var(--gold);color:#0A0A0A;width:100%}"
  + ".zp-btn.go:hover{color:#0A0A0A;opacity:.9}"
  + ".zp-hint{font-size:.63rem;color:var(--ink-4);line-height:1.6;margin-top:10px}"
  + ".zp-empty{text-align:center;padding:40px 16px;color:var(--ink-4);font-size:.76rem}"
  + ".zp-rc{padding:13px 14px;border-radius:9px;border:1px solid var(--line);background:rgba(255,255,255,.025);margin-bottom:10px}"
  + ".msdot{display:inline-block;width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-bottom:3px}"
  + ".msdot.grey{background:#8a8a8a}.msdot.yellow{background:#FFB84D}.msdot.blue{background:#4DA6FF}"
  + ".zp-rc-h{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:6px}"
  + ".zp-rc-n{font-size:.8rem;font-weight:600}"
  + ".zp-rc-b{font-size:.56rem;font-weight:700;letter-spacing:.5px;padding:3px 9px;border-radius:99px;white-space:nowrap}"
  + ".zp-rc-v{font-size:.72rem;color:var(--ink-3)}";

  var STATUS_LABEL = {
    requested:'Ap tann', accepted:'Aksepte', on_way:'Sou wout', arrived:'Chofè rive',
    picked:'Kòmanse', done:'Fini', cancelled:'Anile', pending:'Ap tann'
  };
  var STATUS_STYLE = {
    requested:'color:#FFB84D;border-color:rgba(255,184,77,.3);background:rgba(255,184,77,.08)',
    pending:'color:#FFB84D;border-color:rgba(255,184,77,.3);background:rgba(255,184,77,.08)',
    accepted:'color:#0e8;border-color:rgba(0,224,138,.3);background:rgba(0,224,138,.08)',
    on_way:'color:#0e8;border-color:rgba(0,224,138,.3);background:rgba(0,224,138,.08)',
    arrived:'color:#0e8;border-color:rgba(0,224,138,.3);background:rgba(0,224,138,.08)',
    picked:'color:#0e8;border-color:rgba(0,224,138,.3);background:rgba(0,224,138,.08)',
    done:'color:var(--gold);border-color:var(--g-24);background:var(--g-08)',
    cancelled:'color:#FF6B6B;border-color:rgba(255,107,107,.3);background:rgba(255,107,107,.08)'
  };

  function init(){
    if(document.getElementById('zp-panel')) return;   /* deja poze */
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);

    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<aside class="zp-panel" id="zp-panel" aria-hidden="true">'
      + '<div class="zp-h"><div><div class="zp-t" id="zp-t">Pwofil mwen</div><div class="zp-s" id="zp-s">—</div></div>'
      + '<button class="zp-x" id="zp-x" type="button" aria-label="Fèmen"><svg viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>'
      + '<div class="zp-b" id="zp-b"></div></aside>';
    document.body.appendChild(wrap.firstElementChild);

    var panel = $('#zp-panel'), veil = $('#veil'), whoBtn = $('#who-btn'), acct = $('#acct');

    /* Retire tout sa #who-btn te gen deja kòm klik (ti meni kout la),
       pou pwofil la louvri touswit — jan itilizatè a mande l la. */
    if(whoBtn){
      var fresh = whoBtn.cloneNode(true);
      whoBtn.parentNode.replaceChild(fresh, whoBtn);
      whoBtn = fresh;
      whoBtn.addEventListener('click', function(e){
        e.stopPropagation();
        if(acct) acct.classList.remove('open');
        open();
      });
    }

    function open(){
      panel.classList.add('open'); panel.setAttribute('aria-hidden','false');
      if(veil) veil.classList.add('open');
      render();
    }
    function close(){
      panel.classList.remove('open'); panel.setAttribute('aria-hidden','true');
      if(veil) veil.classList.remove('open');
    }
    $('#zp-x').addEventListener('click', close);
    if(veil) veil.addEventListener('click', close);
    addEventListener('keydown', function(e){ if(e.key === 'Escape') close(); });
    window.ZetwalProfile = { open:open, close:close };

    /* Pwòp swiv itilizatè pa nou — nou pa depann de window._me, kèk
       paj (akèy, lavri) pa menm ekspoze l. Yon lòt «onAuthStateChanged»
       anplis pa gen danje, Firebase kite plizyè koute anmenmtan. */
    var currentUser = window._me || null;
    if(currentUser) claimPending(currentUser);
    auth.onAuthStateChanged(function(user){
      currentUser = user || null;
      if(panel.classList.contains('open')) render();
      if(user) claimPending(user);
    });

    /* Pwen ak mesaj ki te voye pou nou pandan nou pa t ko konekte —
       yo tann nan Supabase, nou reklame yo tousuit isit la. Sa pa
       depann de Firestore ditou, imel la soti nan sesyon Firebase la
       menm, kidonk pa gen kous ak korije imel paj la ap fè apa. */
    async function claimPending(user){
      if(!sb || !fs || !user || !user.email) return;
      var mail = user.email.toLowerCase();
      try{
        var pts = await sb.from('pending_points').select('*').eq('to_email', mail).eq('claimed', false);
        var rows = pts.data || [];
        for(var i=0;i<rows.length;i++){
          var r = rows[i];
          try{
            await fs.collection('users').doc(user.uid).set(
              { points: firebase.firestore.FieldValue.increment(Number(r.amount)) }, { merge:true });
            await sb.from('pending_points').update({ claimed:true, claimed_at:new Date().toISOString() }).eq('id', r.id);
          }catch(e){}
        }
        if(rows.length) toast(rows.length > 1
          ? rows.length + ' anvwa pwen te ap tann ou — yo antre sou kont ou'
          : 'Yon anvwa pwen te ap tann ou — li antre sou kont ou');
      }catch(e){}
      try{
        var msgs = await sb.from('pending_messages').select('*').eq('to_email', mail).eq('claimed', false);
        var mrows = msgs.data || [];
        for(var j=0;j<mrows.length;j++){
          var m = mrows[j];
          try{
            var cid = convId(user.uid, m.from_uid);
            var ref = fs.collection('conversations').doc(cid);
            var seed = { participants:[user.uid, m.from_uid], participantNames:{}, participantEmails:{} };
            seed.participantNames[user.uid] = user.displayName || user.email;
            seed.participantNames[m.from_uid] = m.from_name || m.from_email || 'Itilizatè';
            seed.participantEmails[user.uid] = user.email || '';
            seed.participantEmails[m.from_uid] = m.from_email || '';
            await ref.set(seed, { merge:true });
            await ref.collection('messages').add({
              from:m.from_uid, text:m.text_||'', link:m.link||null, created_at:m.created_at
            });
            var upd = { lastMessage:m.text_||('🔗 '+m.link), lastAt:m.created_at };
            upd['unread.' + user.uid] = firebase.firestore.FieldValue.increment(1);
            await ref.set(upd, { merge:true });
            await sb.from('pending_messages').update({ claimed:true, claimed_at:new Date().toISOString() }).eq('id', m.id);
          }catch(e){}
        }
      }catch(e){}
    }

    var tab = 'info';
    var role = { driver:null, partners:[] };
    var histCache = null, transferCache = null;

    function fsUser(){ return fs.collection('users').doc(currentUser.uid); }

    async function loadRole(){
      role = { driver:null, partners:[] };
      if(!sb || !currentUser || !currentUser.email) return;
      var mail = currentUser.email.toLowerCase(), uid = currentUser.uid;
      try{
        var d = await sb.from('drivers').select('*').eq('active', true).limit(50);
        role.driver = (d.data||[]).filter(function(x){
          return (x.user_uid && x.user_uid === uid) || (x.email && x.email.toLowerCase() === mail);
        })[0] || null;
      }catch(e){}
      try{
        var p = await sb.from('partners').select('*').eq('active', true).limit(100);
        role.partners = (p.data||[]).filter(function(x){
          return (x.owner_uid && x.owner_uid === uid) || (x.owner_email && x.owner_email.toLowerCase() === mail);
        });
      }catch(e){}
    }

    async function loadHistory(){
      var mail = currentUser && currentUser.email;
      if(!sb || !mail) return [];
      var out = [];
      try{
        var a = await sb.from('rides').select('*').eq('client_email', mail).order('created_at',{ascending:false}).limit(25);
        (a.data||[]).forEach(function(r){ out.push(Object.assign({_kind:'Kòmand', _t:'ride'}, r,
          { _title:(r.ride_mode==='object'?'Objè':r.ride_mode==='child'?'Timoun':'Kous') + ' · ' + (r.from_addr||'—').split(',')[0],
            _price:r.price_estimated, _track:['requested','accepted','on_way','arrived','picked'].indexOf(r.status)!==-1 })); });
      }catch(e){}
      try{
        var b = await sb.from('move_orders').select('*').eq('client_email', mail).order('created_at',{ascending:false}).limit(25);
        (b.data||[]).forEach(function(r){ out.push(Object.assign({_kind:'Kòmand', _t:'order'}, r,
          { _title:(r.kind==='manje'?'Manje':r.kind==='shop'?'Acha Shop':'Pake') + ' · ' + (r.partner_name||''),
            _price:r.total, _track:['requested','accepted','on_way','arrived','picked'].indexOf(r.status)!==-1 })); });
      }catch(e){}
      try{
        var c = await sb.from('orders').select('*').eq('client_email', mail).order('created_at',{ascending:false}).limit(25);
        (c.data||[]).forEach(function(r){ out.push(Object.assign({_kind:'Shop'}, r,
          { status:r.status||'pending', _title:'Shop · ' + (r.product_name||''), _price:r.total_estimated })); });
      }catch(e){}
      out.sort(function(x,y){ return new Date(y.created_at||0) - new Date(x.created_at||0); });
      return out;
    }

    async function loadTransfers(){
      if(!sb || !currentUser) return [];
      try{
        var uid = currentUser.uid;
        var r = await sb.from('point_transfers').select('*')
          .or('from_uid.eq.' + uid + ',to_uid.eq.' + uid)
          .order('created_at',{ascending:false}).limit(20);
        return r.data || [];
      }catch(e){ return []; }
    }

    async function currentPoints(){
      try{ var s = await fsUser().get(); return Number(s.exists ? (s.data().points||0) : 0) || 0; }
      catch(e){ return 0; }
    }
    async function currentProfileDoc(){
      try{ var s = await fsUser().get(); return s.exists ? s.data() : {}; }catch(e){ return {}; }
    }

    async function chargePoints(amount){
      if(!currentUser || amount <= 0) return false;
      try{
        return await fs.runTransaction(async function(tx){
          var ref = fsUser();
          var snap = await tx.get(ref);
          var cur = Number((snap.exists ? snap.data().points : 0) || 0);
          if(cur < amount) return false;
          tx.update(ref, { points: firebase.firestore.FieldValue.increment(-amount) });
          return true;
        });
      }catch(e){ return false; }
    }

    async function render(){
      var box = $('#zp-b');
      var u = currentUser;
      if(!u){
        $('#zp-t').textContent = 'Pwofil mwen'; $('#zp-s').textContent = '';
        box.innerHTML = '<div class="zp-empty">Konekte pou w wè pwofil ou.</div>';
        return;
      }
      $('#zp-t').textContent = u.displayName || u.email || 'Pwofil mwen';
      $('#zp-s').textContent = u.email || '';
      box.innerHTML = '<div class="zp-empty">K ap chaje…</div>';

      var pts = await currentPoints();
      await loadRole();

      var roles = [];
      if(role.driver) roles.push('Chofè');
      if(role.partners.length) roles.push(role.partners.length > 1 ? 'Patnè (' + role.partners.length + ')' : 'Patnè');

      var head = '<div class="zpcard"><div class="k">Solid pwen ou</div>'
        + '<div class="v">' + pts.toFixed(1) + '<s>pwen</s></div></div>'
        + (roles.length ? '<div style="margin-bottom:14px">' + roles.map(function(r){ return '<span class="zprole">'+r+'</span>'; }).join('') + '</div>' : '')
        + '<button class="zp-btn" id="zp-share" style="width:100%;margin-bottom:16px">Pataje pwofil mwen</button>';

      var tabs = '<div class="zptabs">'
        + ['info','msg','hist','notif','send','ask'].map(function(k){
            var lab = {info:'Enfo',msg:'Mesaj',hist:'Istwa',notif:'Notifikasyon',send:'Voye pwen',ask:'Mande pwen'}[k];
            return '<button class="' + (tab===k?'on':'') + '" data-t="' + k + '">' + lab + '</button>';
          }).join('') + '</div>';

      box.innerHTML = head + tabs + '<div id="zp-in"></div>';
      $('#zp-share').addEventListener('click', function(){ shareProfile(u); });
      $$('#zp-b .zptabs button').forEach(function(b){
        b.addEventListener('click', function(){ tab = b.getAttribute('data-t'); render(); });
      });

      if(tab === 'info') renderInfo();
      else if(tab === 'msg') renderMsgList();
      else if(tab === 'hist') renderHist();
      else if(tab === 'notif') renderNotif();
      else if(tab === 'ask') renderAsk();
      else renderSend();
    }

    function shareProfile(u){
      var url = location.origin + location.pathname.replace(/[^/]*$/, '') + 'taxi.html?moun=' + encodeURIComponent(u.uid);
      if(navigator.share){ navigator.share({ title:'Pwofil mwen sou Zetwal', url:url }).catch(function(){}); return; }
      if(navigator.clipboard){ navigator.clipboard.writeText(url).then(function(){ toast('Lyen pwofil la kopye'); }); }
      else toast(url);
    }

    async function renderInfo(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML = '<div class="zp-empty">K ap chaje…</div>';
      var prof = await currentProfileDoc();
      var u = currentUser;
      box.innerHTML =
          '<div class="zp-av-row"><div class="zp-av-big" id="zp-av-big">'
            + (prof.photo_url ? '<img src="' + esc(prof.photo_url) + '" alt="">' : initial(u.displayName||u.email))
          + '</div><label class="zp-btn" style="cursor:pointer">Chanje foto<input type="file" id="zp-photo" accept="image/*" style="display:none"></label></div>'
        + '<div class="zp-fld"><label for="zp-name">Non</label><input type="text" id="zp-name" value="' + esc(u.displayName||'') + '"></div>'
        + '<div class="zp-fld"><label for="zp-bday">Dat nesans</label><input type="date" id="zp-bday" value="' + esc(prof.birthdate||'') + '"></div>'
        + '<div class="zp-fld"><label for="zp-bio">Byografi</label><textarea id="zp-bio" placeholder="Kèk mo sou ou…">' + esc(prof.bio||'') + '</textarea></div>'
        + '<button class="zp-btn go" id="zp-save">Anrejistre chanjman yo</button>'
        + '<p class="zp-hint">Enfo sa yo parèt lè w pataje pwofil ou ak yon zanmi.</p>';
      $('#zp-photo').addEventListener('change', async function(e){
        var f = e.target.files && e.target.files[0]; if(!f) return;
        var av = $('#zp-av-big'); if(av) av.innerHTML = '<span style="font-size:.6rem">…</span>';
        try{
          var path = currentUser.uid + '/' + Date.now() + '.' + (f.name.split('.').pop()||'jpg');
          var up = await sb.storage.from('avatars').upload(path, f, { upsert:true });
          if(up.error) throw up.error;
          var url = sb.storage.from('avatars').getPublicUrl(path).data.publicUrl;
          await fsUser().set({ photo_url:url }, { merge:true });
          toast('Foto mete ajou');
        }catch(err){ toast('Nou pa ka voye foto a kounye a'); }
        renderInfo();
      });
      $('#zp-save').addEventListener('click', async function(){
        var btn = this; btn.disabled = true; btn.textContent = 'K ap anrejistre…';
        try{
          await fsUser().set({ birthdate:$('#zp-bday').value||null, bio:($('#zp-bio').value||'').trim() }, { merge:true });
          var name = ($('#zp-name').value||'').trim();
          if(name && auth.currentUser) await auth.currentUser.updateProfile({ displayName:name });
          toast('Pwofil ou anrejistre');
        }catch(e){ toast('Nou pa ka anrejistre kounye a'); }
        btn.disabled = false; btn.textContent = 'Anrejistre chanjman yo';
      });
    }

    async function renderHist(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML = '<div class="zp-empty">K ap chaje…</div>';
      histCache = histCache || await loadHistory();
      if(!histCache.length){ box.innerHTML = '<div class="zp-empty">Ou poko gen istwa sou Zetwal.</div>'; return; }
      box.innerHTML = histCache.map(function(o){
        var lab = STATUS_LABEL[o.status] || o.status;
        var sty = STATUS_STYLE[o.status] || STATUS_STYLE.requested;
        var track = o._track ? '<a class="zp-btn" style="margin-top:10px;padding:7px 13px;font-size:.6rem" '
          + 'href="taxi.html?swiv=' + esc(o.id) + '&t=' + (o._t==='ride'?'ride':'order') + '" target="_blank">Swiv →</a>' : '';
        return '<div class="zp-rc"><div class="zp-rc-h"><div class="zp-rc-n">' + esc(o._title) + '</div>'
          + '<span class="zp-rc-b" style="' + sty + '">' + esc(lab) + '</span></div>'
          + '<div class="zp-rc-v">' + fmt(o._price) + ' HTG · ' + (o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '—') + '</div>' + track + '</div>';
      }).join('');
    }

    async function renderNotif(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML = '<div class="zp-empty">K ap chaje…</div>';
      histCache = histCache || await loadHistory();
      var news = histCache.filter(function(o){ return o.status && o.status !== 'requested' && o.status !== 'pending'; });
      if(!news.length){ box.innerHTML = '<div class="zp-empty">Pa gen nouvo mizajou.</div>'; return; }
      box.innerHTML = news.map(function(o){
        var lab = STATUS_LABEL[o.status] || o.status;
        return '<div class="zptx in"><div class="ic"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></div>'
          + '<div class="bd"><b>' + esc(o._title) + ' — ' + esc(lab) + '</b>'
          + '<span>' + (o.updated_at||o.created_at ? new Date(o.updated_at||o.created_at).toLocaleString('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '') + '</span></div></div>';
      }).join('');
    }

    async function findUserByEmail(mail){
      mail = (mail||'').toLowerCase().trim();
      if(!mail) return null;
      var r = await fs.collection('users').where('email','==',mail).limit(1).get();
      if(r.empty) return null;
      var d = r.docs[0];
      return { uid:d.id, email:mail, name:(d.data()||{}).name || mail };
    }

    function renderSend(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML =
          '<div class="zp-fld"><label for="zs-mail">Imel moun w ap voye a (Gmail oswa lòt)</label>'
          + '<input type="email" id="zs-mail" placeholder="egzanp@imel.com"></div>'
        + '<div class="zp-fld"><label for="zs-amt">Konbe pwen</label><input type="number" id="zs-amt" min="1" step="0.1" placeholder="10"></div>'
        + '<div class="zp-fld"><label for="zs-note">Yon ti mo (fakiltatif)</label><input type="text" id="zs-note" placeholder="Pou bòdwo lekòl la…"></div>'
        + '<button class="zp-btn go" id="zs-go">Voye pwen yo</button>'
        + '<p class="zp-hint">Pwen yo soti sou kont ou tousuit, epi yo antre sou kont moun nan. Administratè a wè tout tranzaksyon.</p>'
        + '<div style="font-size:.58rem;letter-spacing:1.4px;text-transform:uppercase;color:var(--ink-4);margin:20px 0 10px">Dènye anvwa ou yo</div>'
        + '<div id="zs-hist"><div class="zp-empty">K ap chaje…</div></div>';
      $('#zs-go').addEventListener('click', async function(){
        var mail = ($('#zs-mail').value||'').trim().toLowerCase();
        var amt = parseFloat($('#zs-amt').value) || 0;
        var note = ($('#zs-note').value||'').trim();
        if(!mail){ toast('Ekri imel moun nan'); return; }
        if(amt <= 0){ toast('Konbe pwen ou vle voye ?'); return; }
        if(mail === (currentUser.email||'').toLowerCase()){ toast('Ou pa ka voye pwen pou tèt ou'); return; }
        var btn = this; btn.disabled = true; btn.textContent = 'K ap voye…';
        try{
          var ok = await chargePoints(amt);
          if(!ok){ toast('Ou pa gen ase pwen'); btn.disabled=false; btn.textContent='Voye pwen yo'; return; }
          var dest = await findUserByEmail(mail);
          if(dest){
            /* Nou jwenn kont lan tousuit — antre pwen yo dirèkteman. */
            await fs.collection('users').doc(dest.uid).set(
              { points: firebase.firestore.FieldValue.increment(amt) }, { merge:true });
            if(sb){ try{ await sb.from('point_transfers').insert({
              from_uid:currentUser.uid, from_name:currentUser.displayName||currentUser.email, from_email:currentUser.email||null,
              to_uid:dest.uid, to_name:dest.name, to_email:dest.email, amount:amt, note:note||null
            }); }catch(e){} }
            toast('Pwen voye bay ' + (dest.name||dest.email));
          } else {
            /* Nou pa jwenn kont lan kounye a — nou pa bloke pou sa.
               Pwen yo mete la, y ap antre otomatikman lè imel sa konekte. */
            if(sb){
              try{ await sb.from('pending_points').insert({
                to_email:mail, amount:amt, from_uid:currentUser.uid,
                from_name:currentUser.displayName||currentUser.email, from_email:currentUser.email||null, note:note||null
              }); }catch(e){}
              try{ await sb.from('point_transfers').insert({
                from_uid:currentUser.uid, from_name:currentUser.displayName||currentUser.email, from_email:currentUser.email||null,
                to_uid:null, to_name:null, to_email:mail, amount:amt, note:note||null
              }); }catch(e){}
            }
            toast('Pwen voye — y ap antre sou kont ' + mail + ' lè l konekte');
          }
          $('#zs-mail').value=''; $('#zs-amt').value=''; $('#zs-note').value='';
          transferCache = null; loadSendHistory();
        }catch(e){ toast('Nou pa ka voye pwen yo kounye a'); }
        btn.disabled = false; btn.textContent = 'Voye pwen yo';
      });
      loadSendHistory();
    }
    async function loadSendHistory(){
      var box = $('#zs-hist'); if(!box) return;
      transferCache = transferCache || await loadTransfers();
      var uid = currentUser.uid;
      box.innerHTML = transferCache.length ? transferCache.map(function(t){
        var out = t.from_uid === uid;
        var waiting = out && !t.to_uid;
        return '<div class="zptx ' + (out?'out':'in') + '"><div class="ic"><svg viewBox="0 0 24 24">'
          + (out ? '<path d="M5 12h14M13 6l6 6-6 6"/>' : '<path d="M19 12H5M11 6l-6 6 6 6"/>') + '</svg></div>'
          + '<div class="bd"><b>' + (out ? 'Voye bay ' + esc(t.to_name||t.to_email||'') : 'Resevwa nan men ' + esc(t.from_name||t.from_email||'')) + '</b>'
          + '<span>' + new Date(t.created_at).toLocaleString('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})
          + (t.note ? ' · ' + esc(t.note) : '') + (waiting ? ' · ap tann ' + esc(t.to_email) + ' konekte' : '') + '</span></div><div class="am">' + (out?'−':'+') + Number(t.amount).toFixed(1) + '</div></div>';
      }).join('') : '<div class="zp-empty">Ou poko voye ni resevwa pwen.</div>';
    }

    function renderAsk(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML =
          '<div class="zp-fld"><label for="za-amt">Konbe pwen ou ta renmen</label><input type="number" id="za-amt" min="1" step="0.1" placeholder="20"></div>'
        + '<div class="zp-fld"><label for="za-why">Poukisa</label><textarea id="za-why" placeholder="Yon ti mo pou administratè a konprann demann lan…"></textarea></div>'
        + '<button class="zp-btn go" id="za-go">Voye demann lan</button>'
        + '<p class="zp-hint">Yon administratè ap gade demann lan epi deside.</p>';
      $('#za-go').addEventListener('click', async function(){
        var amt = parseFloat($('#za-amt').value)||0, why = ($('#za-why').value||'').trim();
        if(amt <= 0){ toast('Konbe pwen ou ta renmen?'); return; }
        var btn = this; btn.disabled = true;
        try{
          await sb.from('point_asks').insert({
            uid:currentUser.uid, name:currentUser.displayName||currentUser.email, email:currentUser.email,
            amount:amt, reason:why||null
          });
          toast('Demann voye — n ap gade l'); $('#za-amt').value=''; $('#za-why').value='';
        }catch(e){ toast('Nou pa ka voye demann lan kounye a'); }
        btn.disabled = false;
      });
    }

    /* ════════════════════════════════════════════════════════════
       MESAJ — konvèsasyon prive ant de itilizatè, stoke nan Firestore.
       Id konvèsasyon an se de uid triye + kole (menm rezilta pou
       de moun yo, kèlkeswa kilès ki kòmanse l).
       ════════════════════════════════════════════════════════════ */
    function convId(uidA, uidB){ return [uidA, uidB].sort().join('_'); }
    var msgUnsub = null, msgOpenId = null, convCache = null;

    async function loadConversations(){
      if(!fs || !currentUser) return [];
      try{
        var r = await fs.collection('conversations')
          .where('participants', 'array-contains', currentUser.uid)
          .orderBy('lastAt', 'desc').limit(50).get();
        return r.docs.map(function(d){ return Object.assign({ id:d.id }, d.data()); });
      }catch(e){ return []; }
    }
    function otherOf(conv){
      var uid = (conv.participants||[]).filter(function(x){ return x !== currentUser.uid; })[0];
      var names = conv.participantNames || {}, emails = conv.participantEmails || {};
      return { uid:uid, name:names[uid] || emails[uid] || 'Itilizatè', email:emails[uid] || '' };
    }
    async function renderMsgList(){
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML =
          '<div class="zp-fld"><label for="mg-mail">Kòmanse yon nouvo konvèsasyon (imel)</label>'
          + '<div style="display:flex;gap:8px"><input type="email" id="mg-mail" placeholder="zanmi@imel.com" style="flex:1">'
          + '<button class="zp-btn" id="mg-start">Kòmanse</button></div></div>'
        + '<div style="font-size:.58rem;letter-spacing:1.4px;text-transform:uppercase;color:var(--ink-4);margin:18px 0 10px">Konvèsasyon ou yo</div>'
        + '<div id="mg-list" class="zp-empty">K ap chaje…</div>';
      $('#mg-start').addEventListener('click', async function(){
        var mail = ($('#mg-mail').value||'').trim().toLowerCase();
        if(!mail){ toast('Ekri imel zanmi w lan'); return; }
        if(mail === (currentUser.email||'').toLowerCase()){ toast('Ou pa ka voye tèt ou mesaj'); return; }
        var dest = await findUserByEmail(mail);
        if(dest) await openThread(dest.uid, dest.name, dest.email);
        else await openThread(null, mail, mail);   /* pa jwenn kont — nou kòmanse yon fil k ap tann */
      });
      var convs = await loadConversations();
      convCache = convs;
      /* Mesaj mwen te voye bay yon moun ki poko gen kont — yo pa nan
         Firestore ankò, yo nan kès datant lan. Nou montre yo tou, pou
         yo pa disparèt nan lis la. */
      var pendingByEmail = {};
      if(sb && currentUser){
        try{
          var pp = await sb.from('pending_messages').select('*').eq('from_uid', currentUser.uid).eq('claimed', false);
          (pp.data||[]).forEach(function(r){
            var k = r.to_email;
            if(!pendingByEmail[k]) pendingByEmail[k] = { email:k, lastMessage:r.text_||('🔗 '+r.link), lastAt:r.created_at };
            else if(new Date(r.created_at) > new Date(pendingByEmail[k].lastAt)){ pendingByEmail[k].lastMessage = r.text_||('🔗 '+r.link); pendingByEmail[k].lastAt = r.created_at; }
          });
        }catch(e){}
      }
      var list = $('#mg-list'); if(!list) return;
      var items = convs.map(function(c){
        var o = otherOf(c);
        var unread = (c.unread && c.unread[currentUser.uid]) || 0;
        return { key:o.uid, html: '<div class="zptx' + (unread?' out':'') + '" style="cursor:pointer" data-conv="' + esc(o.uid) + '|' + esc(o.name) + '|' + esc(o.email) + '">'
          + '<div class="ic"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>'
          + '<div class="bd"><b>' + esc(o.name) + (unread ? ' · ' + unread + ' nouvo' : '') + '</b>'
          + '<span>' + esc(c.lastMessage||'') + '</span></div></div>' };
      });
      Object.keys(pendingByEmail).forEach(function(k){
        var p = pendingByEmail[k];
        items.push({ key:k, html: '<div class="zptx" style="cursor:pointer" data-conv="|' + esc(k) + '|' + esc(k) + '">'
          + '<div class="ic"><svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>'
          + '<div class="bd"><b>' + esc(k) + '</b><span><span class="msdot grey" style="margin-right:5px"></span>' + esc(p.lastMessage) + '</span></div></div>' });
      });
      list.innerHTML = items.length ? items.map(function(x){ return x.html; }).join('')
        : '<div class="zp-empty">Ou poko gen konvèsasyon. Ekri yon imel anwo pou kòmanse.</div>';
      $$('#mg-list [data-conv]').forEach(function(el){
        el.addEventListener('click', function(){
          var p = el.getAttribute('data-conv').split('|');
          openThread(p[0]||null, p[1], p[2]);
        });
      });
    }
    var convUnsub2 = null, threadRows = [], threadReadUpTo = {};
    function stopThreadListeners(){
      if(msgUnsub){ msgUnsub(); msgUnsub = null; }
      if(convUnsub2){ convUnsub2(); convUnsub2 = null; }
    }
    async function openThread(otherUid, otherName, otherEmail){
      stopThreadListeners();
      msgOpenId = otherUid ? convId(currentUser.uid, otherUid) : null;
      var box = $('#zp-in'); if(!box) return;
      box.innerHTML =
          '<button class="trk-back" id="mg-back" type="button" style="border:0;background:none;color:var(--ink-3);'
          + 'cursor:pointer;font-family:var(--sans);font-size:.68rem;padding:0 0 14px">← Tounen nan lis la</button>'
        + '<div style="font-weight:600;font-size:.9rem;margin-bottom:12px">' + esc(otherName) + '</div>'
        + (otherUid ? '' : '<p class="zp-hint" style="margin-bottom:12px">' + esc(otherEmail) + ' poko gen kont sou Zetwal. Mesaj ou yo ap tann li konekte pou yo rive.</p>')
        + '<div id="mg-thread" style="max-height:360px;overflow-y:auto;margin-bottom:14px"></div>'
        + '<div style="display:flex;gap:8px"><input type="text" id="mg-input" placeholder="Ekri yon mesaj…" style="flex:1;padding:11px 13px;'
          + 'border-radius:8px;border:1px solid var(--line);background:rgba(255,255,255,.03);color:var(--ink-1);font-family:var(--sans);font-size:.8rem">'
        + '<button class="zp-btn go" id="mg-send" style="width:auto;padding:11px 16px">Voye</button></div>';
      $('#mg-back').addEventListener('click', function(){ stopThreadListeners(); msgOpenId=null; renderMsgList(); });
      $('#mg-send').addEventListener('click', function(){ sendMessage(otherUid, otherName, otherEmail); });
      $('#mg-input').addEventListener('keydown', function(e){ if(e.key==='Enter') sendMessage(otherUid, otherName, otherEmail); });

      if(!otherUid){ renderPendingThread(otherEmail); return; }

      var ref = fs.collection('conversations').doc(msgOpenId);
      var seed = { participants:[currentUser.uid, otherUid], participantNames:{}, participantEmails:{} };
      seed.participantNames[currentUser.uid] = currentUser.displayName || currentUser.email;
      seed.participantNames[otherUid] = otherName;
      seed.participantEmails[currentUser.uid] = currentUser.email || '';
      seed.participantEmails[otherUid] = otherEmail || '';
      try{ await ref.set(seed, { merge:true }); }catch(e){}
      try{
        var u = {}; u[currentUser.uid] = 0;
        var ru = {}; ru[currentUser.uid] = firebase.firestore.FieldValue.serverTimestamp();
        await ref.set({ unread:u, readUpTo:ru }, { merge:true });
      }catch(e){}

      threadRows = []; threadReadUpTo = {};
      convUnsub2 = ref.onSnapshot(function(doc){
        threadReadUpTo = (doc.exists && doc.data().readUpTo) || {};
        paintThread(otherUid);
      });
      msgUnsub = ref.collection('messages').orderBy('created_at', 'asc').limit(200)
        .onSnapshot(function(snap){
          threadRows = []; snap.forEach(function(d){ threadRows.push(d.data()); });
          paintThread(otherUid);
          /* Chak fwa mesaj nouvo rive pandan fil la ouvri, yo li tousuit */
          var ru2 = {}; ru2[currentUser.uid] = firebase.firestore.FieldValue.serverTimestamp();
          ref.set({ readUpTo:ru2 }, { merge:true }).catch(function(){});
        }, function(){});
    }
    function toMillis(t){
      if(!t) return 0;
      if(t.toMillis) return t.toMillis();
      if(t.seconds) return t.seconds*1000;
      return new Date(t).getTime() || 0;
    }
    function paintThread(otherUid){
      var thread = $('#mg-thread'); if(!thread) return;
      var otherRead = toMillis(threadReadUpTo[otherUid]);
      thread.innerHTML = threadRows.length ? threadRows.map(function(m){
        var mine = m.from === currentUser.uid;
        var dot = '';
        if(mine){
          var mt = toMillis(m.created_at);
          var cls = (otherRead && otherRead >= mt) ? 'blue' : 'yellow';
          var lbl = cls === 'blue' ? 'Li li' : 'Resevwa';
          dot = '<span class="msdot ' + cls + '" title="' + lbl + '"></span>';
        }
        return '<div style="display:flex;justify-content:' + (mine?'flex-end':'flex-start') + ';margin-bottom:8px;align-items:flex-end;gap:5px">'
          + (mine ? dot : '')
          + '<div style="max-width:78%;padding:9px 12px;border-radius:10px;font-size:.78rem;'
          + (mine ? 'background:var(--gold);color:#0A0A0A' : 'background:rgba(255,255,255,.06);color:var(--ink-1)') + '">'
          + (m.link ? '<a href="' + esc(m.link) + '" target="_blank" style="color:inherit;text-decoration:underline;display:block;margin-bottom:4px">' + esc(m.text||m.link) + '</a>' : esc(m.text||''))
          + '</div></div>';
      }).join('') : '<div class="zp-empty">Ekri premye mesaj la.</div>';
      thread.scrollTop = thread.scrollHeight;
    }
    async function renderPendingThread(otherEmail){
      var thread = $('#mg-thread'); if(!thread) return;
      thread.innerHTML = '<div class="zp-empty">K ap chaje…</div>';
      var rows = [];
      if(sb && currentUser){
        try{
          var r = await sb.from('pending_messages').select('*')
            .eq('from_uid', currentUser.uid).eq('to_email', otherEmail).order('created_at',{ascending:true});
          rows = r.data || [];
        }catch(e){}
      }
      thread.innerHTML = rows.length ? rows.map(function(m){
        return '<div style="display:flex;justify-content:flex-end;margin-bottom:8px;align-items:flex-end;gap:5px">'
          + '<span class="msdot grey" title="Ap tann li konekte"></span>'
          + '<div style="max-width:78%;padding:9px 12px;border-radius:10px;font-size:.78rem;background:var(--gold);color:#0A0A0A">'
          + (m.link ? '<a href="' + esc(m.link) + '" target="_blank" style="color:inherit;text-decoration:underline;display:block;margin-bottom:4px">' + esc(m.text_||m.link) + '</a>' : esc(m.text_||''))
          + '</div></div>';
      }).join('') : '<div class="zp-empty">Ekri premye mesaj la — l ap tann ' + esc(otherEmail) + ' konekte.</div>';
      thread.scrollTop = thread.scrollHeight;
    }
    async function deliverMessage(otherUid, otherEmail, text, link){
      if(!otherUid){
        if(sb){
          try{ await sb.from('pending_messages').insert({
            to_email: otherEmail, from_uid:currentUser.uid,
            from_name:currentUser.displayName||currentUser.email, from_email:currentUser.email||null,
            text_: text||null, link: link||null
          }); }catch(e){}
        }
        return;
      }
      var cid = convId(currentUser.uid, otherUid);
      var ref = fs.collection('conversations').doc(cid);
      await ref.collection('messages').add({ from:currentUser.uid, text:text||null, link:link||null, created_at: firebase.firestore.FieldValue.serverTimestamp() });
      var upd = { lastMessage: link ? '🔗 ' + (text||link) : text, lastAt: firebase.firestore.FieldValue.serverTimestamp() };
      upd['unread.' + otherUid] = firebase.firestore.FieldValue.increment(1);
      await ref.set(upd, { merge:true });
    }
    async function sendMessage(otherUid, otherName, otherEmail){
      var inp = $('#mg-input'); var text = (inp.value||'').trim();
      if(!text) return;
      inp.value = '';
      try{ await deliverMessage(otherUid, otherEmail, text, null); }
      catch(e){ toast('Mesaj la pa pase — eseye ankò'); }
      if(!otherUid) renderPendingThread(otherEmail);
    }
    /* API piblik pou lòt paj yo (shop.html, move.html) pataje yon atik
       dirèkteman nan yon mesaj — sèvi ak lyen an sèlman, san mete non yon
       moun deja, itilizatè a chwazi zanmi an nan panno a. */
    window.ZetwalProfile.shareLink = function(url, label){
      open(); tab = 'msg'; render();
      setTimeout(function(){
        var mail = prompt('Imel zanmi ou vle pataje ' + (label||'sa') + ' la avè l :');
        if(!mail) return;
        mail = mail.trim().toLowerCase();
        findUserByEmail(mail).then(function(dest){
          var uid = dest ? dest.uid : null;
          var name = dest ? dest.name : mail;
          var em = dest ? dest.email : mail;
          openThread(uid, name, em).then(function(){
            deliverMessage(uid, em, label||url, url).then(function(){
              if(!uid) renderPendingThread(em);
            });
          });
        });
      }, 400);
    };

    /* Yon lyen pataje (?moun=uid) — envite moun nan konekte pou l wè l */
    var qs = new URLSearchParams(location.search);
    if(qs.get('moun') && !currentUser){
      setTimeout(function(){ toast('Yon pwofil pataje avè w — konekte pou wè l'); }, 700);
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
