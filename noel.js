/* ZETWAL — Thème de Noël (sobre, aux couleurs de Zetwal)
   Actif automatiquement du 1er décembre au 15 janvier ; l'administrateur peut le forcer ou le couper
   (site_settings.xmas_mode = auto | on | off). Un visiteur peut couper la neige avec le petit bouton ❄. */
(function(){
  'use strict';
  if(window.ZNoel) return; window.ZNoel = true;
  var SB='https://mzwibzvdcwapqrtbhxox.supabase.co', KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16d2lienZkY3dhcHFydGJoeG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNzcxNTIsImV4cCI6MjA5MTc1MzE1Mn0.utazGnMswFOiArB66kfok7n2ds1Zr2wyVBRYVOFRT6c', CK='zxm', TTL=10*60*1000;
  function ls(op,k,v){ try{ var s=window.localStorage; if(op==='g') return s.getItem(k); if(op==='s') s.setItem(k,v); }catch(e){} return null; }
  function inWindow(){ var d=new Date(), m=d.getMonth()+1; return m===12 || (m===1 && d.getDate()<=15); }
  function isOn(mode){ return mode==='on' || (mode!=='off' && inWindow()); }
  var on=false, started=false, cv=null, raf=0, flakes=[], ribbon=null, chip=null, btn=null, glow=null, foot=null;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function cached(){ try{ var j=JSON.parse(ls('g',CK)||'null'); return j&&j.v?j:null; }catch(e){ return null; } }
  function greeting(){
    var d=new Date(), m=d.getMonth()+1, day=d.getDate(), n=daysToXmas();
    if(m===1 && day<=15) return 'Bònn ane '+d.getFullYear()+' !';
    if(m===12 && day>=26) return 'Bòn fèt ! Bònn ane '+(d.getFullYear()+1)+' !';
    if(n===0) return 'Jwayezo Nwèl !';
    if(n===1) return 'Demen se Nwèl !';
    if(n>1 && n<=40) return 'Rete '+n+' jou anvan Nwèl';
    return 'Jwayezo Nwèl !';
  }
  function swag(c1,c2,c3){
    var b=function(x,y,c){ return '<rect x="'+(x-2)+'" y="'+(y-6)+'" width="4" height="3.2" fill="#3d3d3d"/><ellipse cx="'+x+'" cy="'+(y+0.5)+'" rx="3.4" ry="4.4" fill="'+c+'"/><ellipse cx="'+(x-1.1)+'" cy="'+(y-1)+'" rx="1" ry="1.5" fill="#fff" fill-opacity=".55"/>'; };
    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="140" height="30" viewBox="0 0 140 30"><path d="M0 3Q70 17 140 3" fill="none" stroke="#1F4A3A" stroke-width="1.8"/>'+b(35,16,c1)+b(70,18,c2)+b(105,16,c3)+'</svg>';
    return 'url("data:image/svg+xml,'+encodeURIComponent(svg)+'")';
  }
  function setLights(){
    var r=document.documentElement.style;
    r.setProperty('--zxm-a',swag('#C0283E','#E3B93C','#2E7D5B'));
    r.setProperty('--zxm-b',swag('#E3B93C','#2E7D5B','#C0283E'));
    var t='<svg xmlns="http://www.w3.org/2000/svg" width="56" height="34" viewBox="0 0 56 34"><rect y="29" width="56" height="5" fill="#14234F"/><rect x="12" y="24" width="4" height="6" fill="#5a3b22"/><path d="M14 1L22 13H18L25 24H3L10 13H6Z" fill="#1F4A3A"/><path d="M14 1L17.4 6.5H10.6Z" fill="#fff"/><rect x="40" y="26" width="4" height="4" fill="#5a3b22"/><path d="M42 8L48 17H45L51 26H33L39 17H36Z" fill="#2E6B52"/><path d="M42 8L44.6 12H39.4Z" fill="#fff"/><circle cx="14" cy="14" r="1.3" fill="#D4AF37"/><circle cx="11" cy="20" r="1.3" fill="#C0283E"/><circle cx="42" cy="19" r="1.2" fill="#D4AF37"/></svg>';
    r.setProperty('--zxm-t','url("data:image/svg+xml,'+encodeURIComponent(t)+'")');
  }
  function daysToXmas(){ var d=new Date(), t=new Date(d.getFullYear(),d.getMonth(),d.getDate()), x=new Date(d.getFullYear(),11,25); return Math.round((x-t)/86400000); }
  function css(){
    if(document.getElementById('zxm-css')) return;
    var st=document.createElement('style'); st.id='zxm-css';
    st.textContent=
    '.zxm-rib{position:fixed;left:0;right:0;top:0;height:30px;z-index:2147483000;pointer-events:none;background:var(--zxm-a) repeat-x 0 0/140px 30px;filter:drop-shadow(0 0 3px rgba(255,196,80,.55))}'+
    '.zxm-rib:after{content:"";position:absolute;inset:0;background:var(--zxm-b) repeat-x 0 0/140px 30px;animation:zxm-tw 2.6s ease-in-out infinite}'+
    '@keyframes zxm-tw{0%,100%{opacity:0}50%{opacity:1}}'+
    '@media (prefers-reduced-motion:reduce){.zxm-rib:after{animation:none;opacity:.5}}'+
    'html.zxm ::selection{background:#8E1B2E;color:#fff}'+
    '.zxm-cv{position:fixed;inset:0;width:100%;height:100%;z-index:2147482990;pointer-events:none}'+
    '.zxm-chip{position:fixed;left:50%;top:78px;transform:translate(-50%,-10px);opacity:0;z-index:2147483001;pointer-events:none;background:#14234F;color:#F4E7B0;border:1px solid #D4AF37;border-radius:999px;padding:9px 20px;font:600 14px/1.2 "Cormorant Garamond",Georgia,serif;letter-spacing:.04em;box-shadow:0 6px 22px rgba(20,35,79,.35);transition:opacity .6s,transform .6s;white-space:nowrap}'+
    '.zxm-chip.on{opacity:1;transform:translate(-50%,0)}'+
    '.zxm-btn{position:fixed;left:max(64px,calc(env(safe-area-inset-left,0px) + 64px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:2147483001;width:34px;height:34px;border-radius:50%;border:1px solid #D4AF37;background:#14234F;color:#F4E7B0;font:16px/1 sans-serif;cursor:pointer;opacity:.75;padding:0}'+
    '.zxm-btn:hover,.zxm-btn:focus-visible{opacity:1;outline:2px solid #D4AF37;outline-offset:2px}'+
    '.zxm-btn[aria-pressed="false"]{opacity:.45}'+
    '.zxm-glow{position:fixed;inset:0;pointer-events:none;z-index:2147482980;background:radial-gradient(60% 38% at 0% 0%,rgba(142,27,46,.075),transparent 72%),radial-gradient(60% 38% at 100% 0%,rgba(31,74,58,.09),transparent 72%)}'+
    '.zxm-foot{position:relative;display:block;width:100%;margin:0;padding:0;background:transparent;text-align:center;font-family:"Cormorant Garamond",Georgia,serif}'+
    '.zxm-trees{height:34px;background:var(--zxm-t) repeat-x center bottom/56px 34px}'+
    '.zxm-msg{background:#14234F;color:#F4E7B0;padding:14px 16px calc(18px + env(safe-area-inset-bottom,0px));font-size:1.05rem;letter-spacing:.05em;border-top:0}'+
    '.zxm-msg b{display:block;font-weight:600;font-size:1.25rem;color:#D4AF37;margin-bottom:2px}'+
    '@media (max-width:640px){.zxm-msg{padding-bottom:calc(76px + env(safe-area-inset-bottom,0px))}}'+
    '@media print{.zxm-rib,.zxm-cv,.zxm-chip,.zxm-btn,.zxm-glow,.zxm-foot{display:none!important}}';
    document.head.appendChild(st);
  }
  var FOOT=/(^\/$|\/(index|shop|lavri|travay|taxi|tarifs|mall|legal|cejjd|projetmike)(\.html)?\/?$)/;
  function snowOn(){ return ls('g','zxm-snow')!=='0'; }
  function size(){ if(!cv) return; var r=Math.min(window.devicePixelRatio||1,2); cv.width=Math.floor(innerWidth*r); cv.height=Math.floor(innerHeight*r); cv._r=r; }
  function seed(){
    var n=Math.max(18,Math.min(46,Math.round(innerWidth/32))); flakes=[];
    for(var i=0;i<n;i++) flakes.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:1+Math.random()*2.4,v:.3+Math.random()*.7,s:Math.random()*6.28,w:.4+Math.random()*.8});
  }
  function frame(){
    raf=0; if(!on||!cv||document.hidden||!snowOn()) return;
    var c=cv.getContext('2d'), r=cv._r||1; c.setTransform(r,0,0,r,0,0); c.clearRect(0,0,innerWidth,innerHeight);
    for(var i=0;i<flakes.length;i++){ var f=flakes[i]; f.y+=f.v; f.s+=.012; f.x+=Math.sin(f.s)*f.w*.5;
      if(f.y>innerHeight+4){ f.y=-4; f.x=Math.random()*innerWidth; } if(f.x<-4) f.x=innerWidth+4; if(f.x>innerWidth+4) f.x=-4;
      if(f.r>2.5){ c.save(); c.translate(f.x,f.y); c.rotate(f.s*.3); c.strokeStyle='rgba(255,255,255,.95)'; c.lineWidth=1.3; var R=f.r*2; c.beginPath(); for(var k=0;k<3;k++){ var a=k*1.0472; c.moveTo(-Math.cos(a)*R,-Math.sin(a)*R); c.lineTo(Math.cos(a)*R,Math.sin(a)*R); } c.stroke(); c.strokeStyle='rgba(70,100,160,.35)'; c.lineWidth=.6; c.stroke(); c.restore(); }
      else { c.beginPath(); c.arc(f.x,f.y,f.r,0,6.283); c.fillStyle='rgba(255,255,255,.92)'; c.fill(); c.lineWidth=.8; c.strokeStyle='rgba(70,100,160,.38)'; c.stroke(); } }
    raf=requestAnimationFrame(frame);
  }
  function startSnow(){
    if(reduce||!snowOn()||!on) return;
    if(!cv){ cv=document.createElement('canvas'); cv.className='zxm-cv'; cv.setAttribute('aria-hidden','true'); document.body.appendChild(cv); size(); seed(); window.addEventListener('resize',function(){ size(); seed(); }); }
    cv.style.display='block'; if(!raf) raf=requestAnimationFrame(frame);
  }
  function stopSnow(){ if(raf){ cancelAnimationFrame(raf); raf=0; } if(cv){ cv.style.display='none'; cv.getContext('2d').clearRect(0,0,cv.width,cv.height); } }
  function build(){
    css(); setLights();
    document.documentElement.classList.add('zxm');
    if(!ribbon){ ribbon=document.createElement('div'); ribbon.className='zxm-rib'; ribbon.setAttribute('aria-hidden','true'); document.body.appendChild(ribbon); }
    if(!glow){ glow=document.createElement('div'); glow.className='zxm-glow'; glow.setAttribute('aria-hidden','true'); document.body.appendChild(glow); }
    if(!foot && FOOT.test(location.pathname)){ foot=document.createElement('div'); foot.className='zxm-foot'; foot.setAttribute('aria-hidden','true'); foot.innerHTML='<div class="zxm-trees"></div><div class="zxm-msg"><b>Jwayezo Nwèl ak Bònn Ane !</b>Zetwal Organisation te swete nou lapè, sante ak lajwa.</div>'; document.body.appendChild(foot); }
    if(!btn){
      btn=document.createElement('button'); btn.type='button'; btn.className='zxm-btn'; btn.textContent='❄'; btn.title='Nèj'; btn.setAttribute('aria-label','Nèj / Neige / Snow');
      btn.setAttribute('aria-pressed',snowOn()?'true':'false');
      btn.onclick=function(){ var v=snowOn()?'0':'1'; ls('s','zxm-snow',v); btn.setAttribute('aria-pressed',v==='1'?'true':'false'); if(v==='1') startSnow(); else stopSnow(); };
      document.body.appendChild(btn);
    }
    startSnow();
    if(!chip && !ls('g','zxm-seen-'+new Date().getFullYear()+'-'+(new Date().getMonth()+1)) && !sessionStorage.getItem('zxm-greet')){
      try{ sessionStorage.setItem('zxm-greet','1'); }catch(e){}
      chip=document.createElement('div'); chip.className='zxm-chip'; chip.setAttribute('role','status'); chip.textContent='✦ '+greeting()+' ✦'; document.body.appendChild(chip);
      setTimeout(function(){ chip.classList.add('on'); },700); setTimeout(function(){ chip.classList.remove('on'); },7000); setTimeout(function(){ if(chip&&chip.parentNode) chip.parentNode.removeChild(chip); },8000);
    }
  }
  function teardown(){
    document.documentElement.classList.remove('zxm'); stopSnow();
    [ribbon,btn,chip,glow,foot].forEach(function(e){ if(e&&e.parentNode) e.parentNode.removeChild(e); }); ribbon=btn=chip=glow=foot=null;
  }
  function apply(mode){ var n=isOn(mode); if(n===on&&started) return; on=n; started=true; if(on) build(); else teardown(); }
  document.addEventListener('visibilitychange',function(){ if(!document.hidden&&on&&!raf) startSnow(); });
  function init(){
    var c=cached(); apply(c?c.v:'auto');
    if(c && Date.now()-c.t<TTL) return;
    if(!window.fetch) return;
    fetch(SB+'/rest/v1/site_settings?key=eq.xmas_mode&select=value',{headers:{apikey:KEY,Accept:'application/json'}})
      .then(function(r){ return r.ok?r.json():null; })
      .then(function(j){ var v=(j&&j[0]&&j[0].value)||'auto'; if(v!=='on'&&v!=='off') v='auto'; ls('s',CK,JSON.stringify({t:Date.now(),v:v})); apply(v); })
      .catch(function(){});
  }
  if(document.body) init(); else document.addEventListener('DOMContentLoaded',init);
})();
