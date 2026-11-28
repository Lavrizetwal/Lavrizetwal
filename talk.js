/* ═══ ZETWAL — habitants qui parlent (bulles dans le fond animé) ═══════════════
   Utilise scenes.js (window.__scene). Rien n'est lu à voix haute : décor seulement.
   · Une bulle s'écrit lettre par lettre au-dessus d'un habitant ou d'un véhicule.
   · Si on l'arrête (souris qui s'attarde, ou toucher), il répond tout de suite.
   · Un 2e toucher sur une bulle avec « ↗ » ouvre la page dont il parle.
   · Accueil : parle de toutes les pages (+ dernier article Edu et remise en direct).
     Lavri et Travay : parlent d'elles-mêmes (Travay : ton sobre). Jeux : fond opaque, pas de bulles.
   · Reduced-motion : texte affiché d'un coup. Onglet caché ou page défilée : silence.
   ► TEXTES EN CRÉOLE : tout est dans le bloc LINES juste dessous (à corriger librement). */
(function(){
'use strict';
var K=(document.body.getAttribute('data-scene')||'').toLowerCase(); if(!K) return;
var CALM=false; try{ CALM=matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}

/* ── Données en direct (toutes facultatives : si absentes, la ligne est sautée) ── */
var EDU=null, LP=null;
var SB_URL='https://mzwibzvdcwapqrtbhxox.supabase.co', SB_KEY='sb_publishable_2kZsCCv5jrAce6XIH8oxew_tTH2uL85';
var DEF={perKg:80,min:650,uniform:10,sechFrom:15};
function loadLive(){
  if(K==='akey'){
    fetch('edu-index.json',{cache:'no-cache'}).then(function(r){ return r.ok?r.json():null; }).then(function(j){ if(j&&j.items&&j.items.length) EDU=j.items; }).catch(function(){});
  }
  if(K==='akey'||K==='lavri'){
    fetch(SB_URL+'/rest/v1/site_settings?key=eq.lavri_prices&select=value',{headers:{apikey:SB_KEY}}).then(function(r){ return r.ok?r.json():null; }).then(function(rows){
      if(!Array.isArray(rows)) return;
      var p=null; try{ p=rows[0]&&rows[0].value?JSON.parse(rows[0].value):null; }catch(e){}
      LP=lpNorm(p);
    }).catch(function(){});
  }
}
/* Normalise un objet « tarifs » (venant de la base ou de la page Lavri) */
function lpNorm(p){
  if(!p||!p.plans) return {perKg:DEF.perKg,min:DEF.min,uniform:DEF.uniform,sechFrom:DEF.sechFrom};
  var petit=null; p.plans.forEach(function(x){ if(x.id==='petit') petit=x; });
  var sech=null; (p.options||[]).forEach(function(o){ if(o.id==='sechaj') sech=o; });
  var from=sech&&sech.free&&String(sech.free).indexOf('>=')===0?parseFloat(String(sech.free).slice(2)):null;
  return {perKg:p.perKg||DEF.perKg,min:petit&&petit.price?petit.price:DEF.min,uniform:p.uniform===undefined?DEF.uniform:Number(p.uniform&&p.uniform.pct)||0,sechFrom:from};
}
function lp(){ try{ if(K==='lavri'&&window.PRICES&&window.PRICES.plans) return lpNorm(window.PRICES); }catch(e){} return LP; }
function fmt(n){ return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g,' '); }
function xmasDays(){ var d=new Date(), t=new Date(d.getFullYear(),d.getMonth(),d.getDate()), x=new Date(d.getFullYear(),11,25); return Math.round((x-t)/86400000); }

/* ══ TEXTES (créole) ══════════════════════════════════════════════════════════
   { t:'texte' | function()→texte|null, href:'page' (facultatif), who:'p' (piéton) | 'c' (véhicule) | 'o' (objet) }  */
var LINES={
  akey:[
    {t:'Mwen pa gen tan pou m pèdi, m ap kouri ale !',who:'p'},
    {t:'Ou te wè nouvo paj Zetwal la ? Li bèl anpil !',who:'p'},
    {t:'Gonayiv toujou bèl, kèlkeswa tan an.',who:'p'},
    {t:function(){ return edu(0); },href:function(){ return eduHref(); },who:'p'},
    {t:function(){ return edu(1); },href:function(){ return eduHref(); },who:'p'},
    {t:function(){ return edu(2); },href:function(){ return eduHref(); },who:'p'},
    {t:'Zetwal Edu gen atik sou anpil matyè, an kreyòl, fransè, anglè ak ris.',href:'edu.html',who:'p'},
    {t:'Lavri ap lave rad ou : pi pwòp, pi santi bon.',href:'lavri.html',who:'p'},
    {t:function(){ var p=lp(); return p&&p.uniform>0?'Pitit ou gen inifòm pou lave ? Lavri ba w '+p.uniform+' % remiz sou inifòm lekòl yo !':null; },href:'lavri.html',who:'p'},
    {t:function(){ var p=lp(); return p?'Lavri lave pou '+fmt(p.perKg)+' HTG pa kilo.':null; },href:'lavri.html',who:'p'},
    {t:'Ou ap chèche travay ? Pase gade paj Travay la.',href:'travay.html',who:'p'},
    {t:'Gen jwèt pou granmoun sou Zetwal : Sudoku, Duel Mantal, Gomoku…',href:'games.html',who:'p'},
    {t:'Zetwal Kòmand ap vini talè !',href:'taxi.html',who:'p'},
    {t:'Boutik Zetwal la ap vini tou.',href:'shop.html',who:'p'},
    {t:function(){ var d=xmasDays(); return d>1&&d<=35?'Rete '+d+' jou anvan Nwèl !':(d===1?'Demen se Nwèl !':(d===0?'Jwaye Nwèl, zanmi !':null)); },who:'p'},
    {t:'M ap pote yon sak rad nan Lavri.',href:'lavri.html',who:'c'},
    {t:'Zetwal Kòmand ap vin chache w lakay ou, talè.',href:'taxi.html',who:'c'},
    {t:'Pa kanpe devan m, m ap pase !',who:'c'},
    {t:'Wout la lib, ann ale !',who:'c'}
  ],
  lavri:[
    {t:'M pote rad mwen pou lave.',who:'p'},
    {t:function(){ var p=lp(); return p?'Lavri lave pou '+fmt(p.perKg)+' HTG pa kilo.':null; },who:'p'},
    {t:function(){ var p=lp(); return p?'Forfè minimòm nan se '+fmt(p.min)+' HTG pou jiska 8 kg.':null; },who:'p'},
    {t:function(){ var p=lp(); return p&&p.sechFrom?'Sechaj gratis apati '+p.sechFrom+' kg.':null; },who:'p'},
    {t:function(){ var p=lp(); return p&&p.uniform>0?'Inifòm lekòl la ? Gen yon remiz '+p.uniform+' % pou yo.':null; },who:'p'},
    {t:'Mwen pran yon abònman pou fanmi an : pri pa kilo a bese.',who:'p'},
    {t:'Ou dwe viv lavi w. Men kite nou pran swen rad ou yo.',who:'p'},
    {t:'Kalkile pri ou nan kalkilatè a, pi ba nan paj la.',who:'p'},
    {t:'Machin yo ap vire, m gen tan al fè kous mwen.',who:'p'}
  ],
  travay:[
    {t:'Yon bon CV kout, klè, san fot.',who:'p'},
    {t:'Mwen gen yon entèvyou demen, m ap prepare m.',who:'p'},
    {t:'Anons yo revize anvan yo pibliye.',who:'p'},
    {t:'Pa janm bay lajan pou jwenn yon travay.',who:'p'},
    {t:'Verifye ki moun k ap rekrite anvan w ale nan yon randevou.',who:'p'},
    {t:'Si yon anons sanble sispèk, siyale l.',who:'p'},
    {t:'Chèchè travay oswa anplwayè : paj sa a se pou nou.',who:'p'},
    {t:'Anplwayè yo ka depoze yon anons pou jwenn moun.',who:'p'},
    {t:'M ap ale nan yon randevou.',who:'c'},
    {t:'Bon travay tout moun.',who:'c'}
  ]
};
/* Réponses quand on arrête quelqu'un (sans lien) */
var REPLY={
  akey:{p:['Eh, ou kenbe m ! Kote w ap mennen m ?','Bonjou ! Ou bezwen yon bagay ?','Ou stope m ? Anfòm, m ap tann ou yon ti moman.','Pa kenbe m twò lontan, m annaji !','Si w vle konnen sa k ap pase sou Zetwal, kontinye gade.'],
        c:['Ou bloke m ! Pa vle m rive an reta ?','Wi, m tande w. Fè vit !','Pase devan, m ap tann.']},
  lavri:{p:['Atansyon, se rad mwen ki nan machin nan !','Mwen tann pou machin nan fini.','Bonjou ! Ou vini lave tou ?','Rad la pral pare talè.']},
  travay:{p:['Bonjou. Mwen prese, men di m.','Wi, kisa ?','Bon chans nan rechèch travay ou.'],
          c:['Bonjou. M ap pase.','Bon jounen.']}
};

/* ── Articles Edu en direct ── */
var bagEdu=[];
function edu(variant){
  if(!EDU) return null;
  if(!bagEdu.length) bagEdu=shuffle(EDU.slice());
  var a=bagEdu[0]; LAST_EDU=a;
  var t='« '+a.t+' »';
  return [ 'Map fè vit rantre lakay mwen pou m al li nouvo atik la : '+t+' nan Zetwal Edu.',
           'Ou konnen sa ? Gen yon atik sou '+t+' nan Zetwal Edu.',
           'Mwen sot li '+t+' nan Zetwal Edu. Ou ta dwe li l tou !' ][variant%3];
}
var LAST_EDU=null;
function eduHref(){ var a=LAST_EDU; if(a&&bagEdu[0]===a) bagEdu.shift(); return a?'edu.html#/a/'+a.id:'edu.html'; }

/* ── Utilitaires ── */
function shuffle(a){ for(var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)), t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function rnd(a,b){ return a+Math.random()*(b-a); }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

/* ── Style + calque ── */
var st=document.createElement('style');
st.textContent='#zt-talk{position:fixed;inset:0;z-index:6;pointer-events:none;overflow:hidden;transition:opacity .35s}'
+'#zt-talk .ztb{position:absolute;left:0;top:0;max-width:min(236px,72vw);padding:8px 11px 9px;border-radius:12px;font:600 13px/1.38 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;'
+'background:rgba(255,255,255,.93);color:#14234F;border:1px solid rgba(184,145,42,.55);box-shadow:0 6px 18px rgba(20,35,79,.16);opacity:0;transition:opacity .25s;will-change:transform}'
+'#zt-talk .ztb.on{opacity:1}#zt-talk .ztb.off{opacity:0;transition:opacity .45s}'
+'#zt-talk .ztb:after{content:"";position:absolute;left:var(--tx,50%);bottom:-6px;width:10px;height:10px;margin-left:-5px;background:inherit;border-right:1px solid rgba(184,145,42,.55);border-bottom:1px solid rgba(184,145,42,.55);transform:rotate(45deg)}'
+'#zt-talk .ztb .r{visibility:hidden}#zt-talk .ztb .ar{color:#B8912A;font-weight:700}'
+'#zt-talk.ztdk .ztb{background:rgba(20,35,79,.94);color:#F3E9C9;border-color:rgba(212,175,55,.6);box-shadow:0 6px 18px rgba(0,0,0,.4)}#zt-talk.ztdk .ztb .ar{color:#D4AF37}';
document.head.appendChild(st);
var layer=document.createElement('div'); layer.id='zt-talk'; layer.setAttribute('aria-hidden','true'); document.body.appendChild(layer);

var SC=null, S=1, B=[], nextAt=0, veil=0, lastTs=0, hoverEnt=null, hoverT=0, mouse=false, lastReply=new WeakMap();
function W(){ return innerWidth; } function H(){ return innerHeight; }

/* ── Cibles possibles ── */
function ents(){ try{ return SC.ents(); }catch(e){ return []; } }
function inView(e){ return e.x>24&&e.x<W()-24&&e.y>70&&e.y<H()-30; }
/* Caché par un panneau (fond opaque ou verre dépoli) ? Alors on ne le voit pas : il ne parle pas, sauf sur petit écran. */
function covered(x,y){
  try{ var els=document.elementsFromPoint(x,y);
    for(var i=0;i<els.length&&i<8;i++){ var el=els[i]; if(el===document.documentElement||el===document.body) continue;
      var cs=getComputedStyle(el), bg=cs.backgroundColor, m=/rgba?\(([^)]+)\)/.exec(bg), a=1;
      if(m){ var q=m[1].split(','); a=q.length>3?parseFloat(q[3]):1; } else a=0;
      var bf=cs.backdropFilter||cs.webkitBackdropFilter||'none';
      if(a>.25||(bf&&bf!=='none')) return true; }
  }catch(e){}
  return false;
}
function cen(e){ return e.k==='c'?{x:e.x,y:e.y+14*S}:e.k==='o'?{x:e.x,y:e.y+(e.ref.s||30)*.55}:{x:e.x,y:e.y+15*S}; }
function visible(e){ if(!inView(e)) return false; var c=cen(e); return !covered(c.x,c.y); }
/* Candidats : ceux qu'on voit ; sur petit écran (panneau plein écran) tous ceux dans l'écran */
function candidates(){ var all=ents().filter(inView), vis=all.filter(visible); return vis.length?vis:(W()<760?all:[]); }
function speaking(ref){ for(var i=0;i<B.length;i++) if(B[i].ref===ref&&!B[i].gone) return true; return false; }
function lineText(l){ var t=typeof l.t==='function'?l.t():l.t; return t||null; }
function lineHref(l){ return typeof l.href==='function'?l.href():l.href; }
function poolFor(k){ return (LINES[K]||[]).filter(function(l){ return l.who===k; }); }

/* ── Création d'une bulle ── */
function say(e,text,href){
  if(!text||speaking(e.ref)) return false;
  var el=document.createElement('div'); el.className='ztb';
  var full=esc(text)+(href?' <span class="ar">↗</span>':'');
  el.innerHTML='<span class="v"></span><span class="r">'+full+'</span>';
  layer.appendChild(el);
  var b={el:el,ref:e.ref,k:e.k,txt:text,href:href||null,full:full,n:0,born:performance.now(),tw:CALM?0:performance.now(),typed:CALM,life:0,x:0,y:0,w:0,h:0,gone:false};
  if(CALM){ el.querySelector('.v').innerHTML=full; el.querySelector('.r').style.display='none'; }
  B.push(b); place(b,e); requestAnimationFrame(function(){ el.classList.add('on'); });
  return true;
}
function anchor(b){ var r=b.ref; if(b.k==='c') return {x:r.x,y:r.y-14*S}; if(b.k==='o') return {x:r.x,y:r.y-(r.s||30)*.55}; return {x:r.x,y:r.y-15*S}; }
function place(b){
  var a=anchor(b), el=b.el, w=el.offsetWidth, h=el.offsetHeight;
  var x=Math.max(8,Math.min(W()-w-8,a.x-w/2)), y=a.y-h-8; if(y<64) y=64;
  el.style.setProperty('--tx',Math.max(14,Math.min(w-14,a.x-x))+'px');
  el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)';
  b.x=a.x; b.y=a.y; b.w=w; b.h=h; b.bx=x; b.by=y;
}
function end(b){ if(b.gone) return; b.gone=true; b.el.classList.add('off'); setTimeout(function(){ if(b.el.parentNode) b.el.parentNode.removeChild(b.el); },520); }

/* ── Paroles d'ambiance ── */
function ambient(){
  var list=candidates().filter(function(e){ return !speaking(e.ref); });
  if(!list.length) return;
  var p=SC.ptr(); list=list.filter(function(e){ var dx=e.x-p.x, dy=e.y-p.y; return dx*dx+dy*dy>90*90*S*S; });
  shuffle(list);
  for(var i=0;i<list.length;i++){
    var e=list[i], pool=shuffle(poolFor(e.k).slice());
    for(var j=0;j<pool.length;j++){
      var t=lineText(pool[j]); if(!t) continue;
      var href=pool[j].href?lineHref(pool[j]):null;
      if(say(e,t,href)) return;
    }
  }
}
/* ── Réponse quand on arrête quelqu'un ── */
function reply(e){
  var now=performance.now(), last=lastReply.get(e.ref)||0; if(now-last<2500) return; lastReply.set(e.ref,now);
  /* une bulle d'ambiance en cours sur lui ? on la remplace */
  for(var i=0;i<B.length;i++) if(B[i].ref===e.ref) end(B[i]);
  var rp=(REPLY[K]&&REPLY[K][e.k])||[], text=null, href=null;
  var linked=poolFor(e.k).filter(function(l){ return l.href; });
  if(linked.length&&Math.random()<.5){ var l=pick(linked), t=lineText(l); if(t){ text=t; href=lineHref(l); } }
  if(!text&&rp.length) text=pick(rp);
  if(!text) return;
  var r=e.ref; if(e.k==='c') r.hold=3.4; else if(e.k==='p') r.wait=3.4;
  setTimeout(function(){ say(e,text,href); },60);
}

/* ── Entrées utilisateur ── */
function nearest(px,py,maxd){
  var best=null, bd=maxd*maxd;
  ents().forEach(function(e){ if(!inView(e)) return; var c=cen(e); var dx=c.x-px, dy=c.y-py, d=dx*dx+dy*dy; if(d<bd){ bd=d; best=e; } });
  return best;
}
function interactive(t){ return !!(t&&t.closest&&t.closest('a,button,input,select,textarea,label,summary,[role=button],[contenteditable],nav,dialog,[role=dialog]')); }
addEventListener('pointermove',function(e){ mouse=e.pointerType==='mouse'; },{passive:true});
addEventListener('pointerdown',function(e){
  if(!SC||veil>.5||document.hidden||interactive(e.target)) return;
  /* 2e toucher sur une bulle avec lien : on ouvre la page */
  for(var i=0;i<B.length;i++){ var b=B[i]; if(b.gone||!b.href) continue;
    var inb=e.clientX>=b.bx-14&&e.clientX<=b.bx+b.w+14&&e.clientY>=b.by-14&&e.clientY<=b.by+b.h+14;
    var dx=e.clientX-b.x, dy=e.clientY-(b.y+14*S), ne=dx*dx+dy*dy<(46*S)*(46*S);
    if((inb||ne)&&performance.now()-b.born>350){ location.href=b.href; return; } }
  var en=nearest(e.clientX,e.clientY,e.pointerType==='mouse'?34*S:52*S); if(en&&!covered(cen(en).x,cen(en).y)) reply(en);
},{passive:true});

/* ── Boucle ── */
function frame(ts){
  requestAnimationFrame(frame);
  if(document.hidden||!SC) return;
  var dt=Math.min(.1,(ts-lastTs)/1000||.016); lastTs=ts;
  veil=Math.max(0,Math.min(.94,(scrollY-innerHeight*.08)/(innerHeight*.5)));
  layer.style.opacity=veil>.45?0:1;
  S=SC.scale(); layer.className=SC.dark()?'ztdk':'';
  /* bulles actives */
  var now=performance.now();
  for(var i=B.length-1;i>=0;i--){ var b=B[i];
    if(b.gone){ if(!b.el.parentNode) B.splice(i,1); continue; }
    var a=anchor(b); if(Math.abs(a.x-b.x)>160||Math.abs(a.y-b.y)>160||veil>.45){ end(b); continue; }
    typeStep(b,now); place(b);
    if(b.typed){ if(!b.t0) b.t0=now; if(now-b.t0>Math.max(3600,b.txt.length*64)) end(b); }
  }
  /* arrêt prolongé à la souris */
  if(mouse&&veil<.5){ var p=SC.ptr(), e2=p.x>0?nearest(p.x,p.y,26*S):null; if(e2&&covered(cen(e2).x,cen(e2).y)) e2=null;
    if(e2&&e2.ref===hoverEnt){ hoverT+=dt; if(hoverT>.7){ hoverT=-99; reply(e2); } } else { hoverEnt=e2?e2.ref:null; hoverT=0; } }
  /* paroles d'ambiance */
  if(veil<.45&&now>nextAt){ if(B.filter(function(x){ return !x.gone; }).length<2) ambient(); nextAt=now+rnd(5200,9500); }
}
/* Écriture progressive (Unicode : on compte les lettres sur le texte brut) */
function typeStep(b,now){
  if(b.typed) return;
  if(!b.chars){ b.chars=Array.from(b.txt); b.txtLen=b.chars.length; }
  var n=Math.min(b.txtLen,Math.floor((now-b.tw)/30));
  if(n!==b.n){ b.n=n; var vis=esc(b.chars.slice(0,n).join('')); var el=b.el, v=el.querySelector('.v'), r=el.querySelector('.r');
    v.innerHTML=vis; var rest=esc(b.chars.slice(n).join(''))+(b.href?' <span class="ar">↗</span>':''); r.innerHTML=rest; }
  if(b.n>=b.txtLen){ b.typed=true; b.el.querySelector('.r').innerHTML=''; b.el.querySelector('.v').innerHTML=b.full; }
}
addEventListener('resize',function(){ B.forEach(end); B=[]; });
document.addEventListener('visibilitychange',function(){ if(document.hidden){ B.forEach(end); B=[]; } });

/* ── Démarrage : on attend scenes.js ── */
var tries=0;
(function boot(){
  if(window.__scene&&window.__scene.ents){ SC=window.__scene; loadLive(); nextAt=performance.now()+3200; requestAnimationFrame(frame); return; }
  if(++tries<40) setTimeout(boot,100);
})();
})();
