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
  var on=false, started=false, cv=null, raf=0, flakes=[], ribbon=null, chip=null, btn=null;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function cached(){ try{ var j=JSON.parse(ls('g',CK)||'null'); return j&&j.v?j:null; }catch(e){ return null; } }
  function greeting(){
    var d=new Date(), m=d.getMonth()+1, day=d.getDate();
    if(m===1 && day<=15) return 'Bònn ane '+d.getFullYear()+' !';
    if(m===12 && day>=26) return 'Bònn ane '+(d.getFullYear()+1)+' !';
    return 'Jwayezo Nwèl !';
  }
  function css(){
    if(document.getElementById('zxm-css')) return;
    var st=document.createElement('style'); st.id='zxm-css';
    st.textContent=
    '.zxm-rib{position:fixed;left:0;right:0;top:0;height:4px;z-index:2147483000;pointer-events:none;background:linear-gradient(90deg,#8E1B2E 0,#8E1B2E 12%,#D4AF37 12%,#D4AF37 18%,#1F4A3A 18%,#1F4A3A 30%,#D4AF37 30%,#D4AF37 36%,#8E1B2E 36%,#8E1B2E 48%,#D4AF37 48%,#D4AF37 54%,#1F4A3A 54%,#1F4A3A 66%,#D4AF37 66%,#D4AF37 72%,#8E1B2E 72%,#8E1B2E 84%,#D4AF37 84%,#D4AF37 90%,#1F4A3A 90%)}'+
    '.zxm-cv{position:fixed;inset:0;width:100%;height:100%;z-index:2147482990;pointer-events:none}'+
    '.zxm-chip{position:fixed;left:50%;top:78px;transform:translate(-50%,-10px);opacity:0;z-index:2147483001;pointer-events:none;background:#14234F;color:#F4E7B0;border:1px solid #D4AF37;border-radius:999px;padding:9px 20px;font:600 14px/1.2 "Cormorant Garamond",Georgia,serif;letter-spacing:.04em;box-shadow:0 6px 22px rgba(20,35,79,.35);transition:opacity .6s,transform .6s;white-space:nowrap}'+
    '.zxm-chip.on{opacity:1;transform:translate(-50%,0)}'+
    '.zxm-btn{position:fixed;left:max(64px,calc(env(safe-area-inset-left,0px) + 64px));bottom:calc(14px + env(safe-area-inset-bottom,0px));z-index:2147483001;width:34px;height:34px;border-radius:50%;border:1px solid #D4AF37;background:#14234F;color:#F4E7B0;font:16px/1 sans-serif;cursor:pointer;opacity:.75;padding:0}'+
    '.zxm-btn:hover,.zxm-btn:focus-visible{opacity:1;outline:2px solid #D4AF37;outline-offset:2px}'+
    '.zxm-btn[aria-pressed="false"]{opacity:.45}'+
    '@media print{.zxm-rib,.zxm-cv,.zxm-chip,.zxm-btn{display:none!important}}';
    document.head.appendChild(st);
  }
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
      c.beginPath(); c.arc(f.x,f.y,f.r,0,6.283); c.fillStyle='rgba(255,255,255,.92)'; c.fill(); c.lineWidth=.8; c.strokeStyle='rgba(70,100,160,.38)'; c.stroke(); }
    raf=requestAnimationFrame(frame);
  }
  function startSnow(){
    if(reduce||!snowOn()||!on) return;
    if(!cv){ cv=document.createElement('canvas'); cv.className='zxm-cv'; cv.setAttribute('aria-hidden','true'); document.body.appendChild(cv); size(); seed(); window.addEventListener('resize',function(){ size(); seed(); }); }
    cv.style.display='block'; if(!raf) raf=requestAnimationFrame(frame);
  }
  function stopSnow(){ if(raf){ cancelAnimationFrame(raf); raf=0; } if(cv){ cv.style.display='none'; cv.getContext('2d').clearRect(0,0,cv.width,cv.height); } }
  function build(){
    css();
    document.documentElement.classList.add('zxm');
    if(!ribbon){ ribbon=document.createElement('div'); ribbon.className='zxm-rib'; ribbon.setAttribute('aria-hidden','true'); document.body.appendChild(ribbon); }
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
    [ribbon,btn,chip].forEach(function(e){ if(e&&e.parentNode) e.parentNode.removeChild(e); }); ribbon=btn=chip=null;
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
