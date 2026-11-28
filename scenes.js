/* ═══ ZETWAL — fonds animés (vue de dessus) : akey · lavri · travay · games ═══
   Un seul fichier, 4 scènes. Chaque page ajoute <canvas id="zt-scene"> et data-scene="…" sur <body>.
   · Respecte le thème clair/sombre, prefers-reduced-motion et la visibilité de l'onglet.
   · La souris / le doigt ralentit les personnages à proximité.
   · Le voile (--veil) estompe la scène quand on défile, pour que le texte reste lisible. */
(function(){
'use strict';
var cv=document.getElementById('zt-scene'); if(!cv) return;
var kind=(document.body.getAttribute('data-scene')||'').toLowerCase(); if(!kind) return;
var g=cv.getContext('2d'), W=0,H=0,DPR=1,S=1,dark=false,P={},raf=0,last=0,hidden=false,t=0,ptr={x:-999,y:-999};
var CALM=false; try{ CALM=matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}
var TAU=Math.PI*2;
function rnd(a,b){ return a+Math.random()*(b-a); }
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }
function clamp(v,a,b){ return v<a?a:v>b?b:v; }
function rr(x,y,w,h,r){ r=Math.min(r,w/2,h/2); g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }
function circ(x,y,r){ g.beginPath(); g.arc(x,y,r,0,TAU); }
function star4(x,y,r,k){ g.beginPath(); for(var i=0;i<8;i++){ var a=i*Math.PI/4, q=i%2?r*(k||.3):r; g.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q); } g.closePath(); }

/* ── Thème ── */
function lum(c){ var m=/^#?([0-9a-f]{6})$/i.exec(c.trim()); if(!m) return 1; var n=parseInt(m[1],16); return (0.299*(n>>16)+0.587*((n>>8)&255)+0.114*(n&255))/255; }
function theme(){
  var cs=getComputedStyle(document.documentElement), bg=cs.getPropertyValue('--bg').trim()||'#fff';
  dark=lum(bg)<.4;
  P= dark ? { floor:'#0A0E1C', floor2:'#0E1426', tile:'rgba(255,255,255,.035)', line:'rgba(255,255,255,.07)', road:'#0F1528', lane:'rgba(212,175,55,.35)', walk:'#141B33', bld:['#18203C','#1B2442','#231F14','#1A2A33'], roof:['#222C52','#262F57','#2F2A18','#22343F'], sh:'rgba(0,0,0,.35)',
            ink:'#EEF0F6', navy:'#14234F', gold:'#D4AF37', glass:'#2B4C8C', mach:'#1D2748', mach2:'#273157', table:'#202B52', win:'rgba(212,175,55,.5)' }
        : { floor:'#F6F2E8', floor2:'#FBF9F4', tile:'rgba(20,35,79,.035)', line:'rgba(20,35,79,.09)', road:'#DCD8CC', lane:'rgba(184,145,42,.55)', walk:'#EFEADD', bld:['#E9E2D0','#DFE5F2','#F3E9C9','#E3EBE6'], roof:['#D6CCB2','#C6D0E6','#E6D6A3','#CBD9CF'], sh:'rgba(20,35,79,.14)',
            ink:'#14234F', navy:'#14234F', gold:'#B8912A', glass:'#6F94D6', mach:'#E4E0D4', mach2:'#D4CFBF', table:'#D9D2BE', win:'rgba(184,145,42,.7)' };
}
function size(){
  DPR=Math.min(window.devicePixelRatio||1, innerWidth<760?1.5:2);
  W=innerWidth; H=innerHeight; cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR); cv.style.width=W+'px'; cv.style.height=H+'px';
  g.setTransform(DPR,0,0,DPR,0,0); S=clamp(Math.min(W,H*1.15)/760,.72,1.35);
}

/* ── Personnages (vue de dessus) ── */
var SK=['#3a2a22','#4a3329','#5b3f31','#6d4b3a','#2e211b','#7a5440'];
function skin(){ return Math.random()<.93?pick(SK):'#c99b7b'; }
var SHIRT=['#D4AF37','#14234F','#B42318','#0F7B4F','#C77D1A','#7B3FA0','#2D6CDF','#E8E3D3','#E26D8F','#1F8A8A'];
function Person(o){ this.x=o.x; this.y=o.y; this.a=0; this.sp=o.sp||rnd(26,44); this.col=o.col||pick(SHIRT); this.sk=skin(); this.job=o.job||''; this.ph=rnd(0,TAU); this.r=(o.r||10); this.carry=o.carry||''; this.wait=0; this.tx=o.x; this.ty=o.y; this.dead=false; }
Person.prototype.slow=function(){ var dx=this.x-ptr.x, dy=this.y-ptr.y, d=Math.sqrt(dx*dx+dy*dy), R=95*S; return d<R?clamp((d-24*S)/(R-24*S),0,1):1; };
Person.prototype.move=function(dt){
  if(this.wait>0){ this.wait-=dt; return false; }
  var dx=this.tx-this.x, dy=this.ty-this.y, d=Math.sqrt(dx*dx+dy*dy);
  if(d<3){ return true; }
  var v=this.sp*S*this.slow()*dt; if(v>d) v=d;
  var na=Math.atan2(dy,dx), da=Math.atan2(Math.sin(na-this.a),Math.cos(na-this.a)); this.a+=da*Math.min(1,dt*9);
  this.x+=Math.cos(this.a)*v; this.y+=Math.sin(this.a)*v; this.ph+=v*.28; return false;
};
Person.prototype.draw=function(){
  var r=this.r*S, c=Math.cos(this.a), s=Math.sin(this.a), sw=Math.sin(this.ph)*r*.18;
  g.fillStyle=P.sh; g.beginPath(); g.ellipse(this.x+2,this.y+3,r*1.15,r*.8,this.a,0,TAU); g.fill();
  if(this.carry==='basket'){ g.fillStyle='#C77D1A'; rr(this.x+c*r*1.15-r*.55,this.y+s*r*1.15-r*.55,r*1.1,r*1.1,2); g.fill(); g.fillStyle='#F3E9C9'; circ(this.x+c*r*1.15,this.y+s*r*1.15,r*.32); g.fill(); }
  if(this.carry==='bag'){ g.fillStyle='#E8E3D3'; circ(this.x-s*r*1.0+c*r*.2,this.y+c*r*1.0+s*r*.2,r*.55); g.fill(); }
  if(this.carry==='case'){ g.fillStyle='#2b2f3d'; rr(this.x-s*r*1.05-r*.4,this.y+c*r*1.05-r*.3,r*.8,r*.6,1.5); g.fill(); }
  if(this.carry==='tool'){ g.fillStyle='#B42318'; rr(this.x+s*r*1.0-r*.45,this.y-c*r*1.0-r*.3,r*.9,r*.6,1.5); g.fill(); }
  g.fillStyle=this.col; g.beginPath(); g.ellipse(this.x+sw*s,this.y-sw*c,r*.95,r*1.25,this.a+Math.PI/2,0,TAU); g.fill();
  g.fillStyle=this.sk; circ(this.x+c*r*.18,this.y+s*r*.18,r*.62); g.fill();
  if(this.job==='hat'){ g.fillStyle='#F2A516'; circ(this.x+c*r*.18,this.y+s*r*.18,r*.7); g.fill(); g.fillStyle='rgba(255,255,255,.35)'; circ(this.x+c*r*.18-1,this.y+s*r*.18-1,r*.28); g.fill(); }
  else if(this.job==='hair'){ g.fillStyle='#17110e'; circ(this.x+c*r*.05,this.y+s*r*.05,r*.64); g.fill(); g.fillStyle=this.sk; circ(this.x+c*r*.3,this.y+s*r*.3,r*.42); g.fill(); }
};

/* ── Voitures (vue de dessus) ── */
function Car(o){ this.x=o.x; this.y=o.y; this.dir=o.dir; this.v=o.v||rnd(60,95); this.col=o.col||pick(['#E8E3D3','#C7CBD6','#14234F','#B42318','#4B5563','#2D6CDF']); this.len=o.len||rnd(34,44); this.taxi=!!o.taxi; if(this.taxi) this.col='#D4AF37'; this.lane=o.lane; }
Car.prototype.update=function(dt,list){
  if(this.hold>0){ this.hold-=dt; return; }
  var sl=1, dx=this.x-ptr.x, dy=this.y-ptr.y, d=Math.sqrt(dx*dx+dy*dy); if(d<110*S) sl=clamp((d-30*S)/(80*S),0,1);
  this.x+=this.dir[0]*this.v*S*sl*dt; this.y+=this.dir[1]*this.v*S*sl*dt;
  var m=80; if(this.x<-m) this.x=W+m; else if(this.x>W+m) this.x=-m; if(this.y<-m) this.y=H+m; else if(this.y>H+m) this.y=-m;
};
Car.prototype.draw=function(){
  var l=this.len*S, w=17*S, hz=this.dir[0]!==0, x=this.x, y=this.y, W2=hz?l:w, H2=hz?w:l;
  g.fillStyle=P.sh; rr(x-W2/2+2,y-H2/2+3,W2,H2,5*S); g.fill();
  g.fillStyle=this.col; rr(x-W2/2,y-H2/2,W2,H2,5*S); g.fill();
  g.fillStyle='rgba(20,35,79,.55)';
  if(hz){ rr(x-l*.12,y-w/2+2*S,l*.32,w-4*S,2*S); g.fill(); } else { rr(x-w/2+2*S,y-l*.12,w-4*S,l*.32,2*S); g.fill(); }
  if(this.taxi){ g.fillStyle='#fff'; rr(x-4*S,y-2*S,8*S,4*S,1.5); g.fill(); }
};

/* ═══ SCÈNE : lavri (laverie vue de dessus) ═══ */
var LV={};
function lavriInit(){
  LV.mach=[]; LV.dry=[]; LV.tab=[]; LV.ppl=[]; LV.bub=[]; LV.st=[];
  var n=Math.max(4,Math.min(8,Math.floor(W/150))), x0=W*.08, x1=W*.92, step=(x1-x0)/n, sz=Math.min(92*S,step*.78);
  for(var i=0;i<n;i++){ var cx=x0+step*(i+.5);
    LV.mach.push({x:cx,y:H*.15,s:sz,ph:rnd(0,TAU),w:rnd(1.6,3.2)*(i%2?1:-1),col:[pick(SHIRT),pick(SHIRT),pick(SHIRT)],on:Math.random()<.8});
    LV.dry.push({x:cx,y:H*.15+sz*1.28,s:sz*.92,ph:rnd(0,TAU),w:rnd(2.4,4)*(i%2?-1:1),col:[pick(SHIRT),pick(SHIRT)],on:Math.random()<.6});
    LV.st.push({x:cx,y:H*.15+sz*2.25});
  }
  var ty=H*.66; LV.tab=[{x:W*.2,y:ty,w:Math.min(190*S,W*.28),h:46*S},{x:W*.52,y:ty,w:Math.min(190*S,W*.28),h:46*S},{x:W*.84,y:ty,w:Math.min(190*S,W*.28),h:46*S}];
  LV.tab.forEach(function(q){ q.st=[]; for(var k=0;k<4;k++) q.st.push({dx:rnd(-.38,.38)*q.w,dy:rnd(-.22,.22)*q.h,w:rnd(15,22)*S,h:rnd(9,13)*S,c:pick(['#F3E9C9','#DDE3F0','#E8E3D3','#D4AF37','#C6D0E6'])}); });
  LV.door={x:W*.5,y:H+10}; LV.counter={x:W*.16,y:H*.9};
  for(var i2=0;i2<Math.min(9,Math.max(4,Math.floor(W/160)));i2++) lavriSpawn(true);
}
function lavriSpawn(scatter){
  var p=new Person({x:scatter?rnd(W*.1,W*.9):LV.door.x+rnd(-30,30),y:scatter?rnd(H*.3,H*.9):LV.door.y,carry:pick(['basket','basket','bag']),job:Math.random()<.4?'hair':''});
  p.stage=0; p.st=pick(LV.st); p.tx=p.st.x+rnd(-8,8); p.ty=p.st.y; LV.ppl.push(p);
}
function lavriTick(dt){
  LV.ppl.forEach(function(p){
    if(p.move(dt)){
      if(p.stage===0){ p.stage=1; p.wait=rnd(2.5,6); p.tab=pick(LV.tab); p.tx=p.tab.x+rnd(-p.tab.w*.5,p.tab.w*.5); p.ty=p.tab.y+p.tab.h*.85; }
      else if(p.stage===1){ p.stage=2; p.wait=rnd(2,5); p.carry=''; p.carry='basket'; p.tx=LV.counter.x+rnd(-30,60); p.ty=LV.counter.y-30*S; }
      else if(p.stage===2){ p.stage=3; p.tx=LV.door.x+rnd(-40,40); p.ty=LV.door.y; }
      else { p.dead=true; }
    }
  });
  LV.ppl=LV.ppl.filter(function(p){ return !p.dead; }); while(LV.ppl.length<Math.min(9,Math.max(4,Math.floor(W/160)))) lavriSpawn(false);
  LV.mach.forEach(function(m){ m.ph+=m.w*dt*(m.on?1:.1); });
  LV.dry.forEach(function(m){ m.ph+=m.w*dt*(m.on?1:.1); });
  if(Math.random()<dt*5){ var m=pick(LV.mach); if(m.on) LV.bub.push({x:m.x+rnd(-m.s*.3,m.s*.3),y:m.y+m.s*.55,r:rnd(2,5),l:0,v:rnd(10,22)}); }
  LV.bub.forEach(function(b){ b.l+=dt; b.y+=b.v*dt; b.x+=Math.sin(b.l*3+b.r)*6*dt; }); LV.bub=LV.bub.filter(function(b){ return b.l<2.4; });
}
function lavriMachine(m,dry){
  var s=m.s;
  g.fillStyle=P.sh; rr(m.x-s/2+3,m.y-s/2+4,s,s,s*.1); g.fill();
  g.fillStyle=P.mach; rr(m.x-s/2,m.y-s/2,s,s,s*.1); g.fill(); g.strokeStyle=P.line; g.lineWidth=1; g.stroke();
  g.fillStyle=P.mach2; rr(m.x-s/2+s*.06,m.y-s/2+s*.05,s*.88,s*.16,s*.04); g.fill();
  g.fillStyle=P.gold; circ(m.x+s*.3,m.y-s/2+s*.13,s*.04); g.fill();
  var cx=m.x, cy=m.y+s*.1, R=s*.32;
  g.fillStyle=dry?'#C9A24A':'#8A94AE'; circ(cx,cy,R*1.18); g.fill();
  g.fillStyle=dry?'#7A5B14':P.glass; circ(cx,cy,R); g.fill();
  if(m.on){
    g.save(); circ(cx,cy,R); g.clip();
    for(var i=0;i<m.col.length;i++){ var a=m.ph+i*TAU/m.col.length, rr_=R*(.38+.1*Math.sin(m.ph*1.7+i)); g.fillStyle=m.col[i]; g.globalAlpha=.9; circ(cx+Math.cos(a)*rr_,cy+Math.sin(a)*rr_,R*.34); g.fill(); }
    g.globalAlpha=1; if(!dry){ g.fillStyle='rgba(255,255,255,.35)'; for(var k=0;k<5;k++){ var a2=m.ph*1.3+k*1.7; circ(cx+Math.cos(a2)*R*.6,cy+Math.sin(a2*1.2)*R*.55,R*.07); g.fill(); } }
    g.restore();
  }
  g.fillStyle='rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(cx-R*.35,cy-R*.4,R*.28,R*.14,-.6,0,TAU); g.fill();
}
function lavriDraw(){
  LV.mach.forEach(function(m){ lavriMachine(m,false); }); LV.dry.forEach(function(m){ lavriMachine(m,true); });
  LV.tab.forEach(function(q){
    g.fillStyle=P.sh; rr(q.x-q.w/2+3,q.y-q.h/2+4,q.w,q.h,6); g.fill(); g.fillStyle=P.table; rr(q.x-q.w/2,q.y-q.h/2,q.w,q.h,6); g.fill(); g.strokeStyle=P.line; g.stroke();
    q.st.forEach(function(c){ g.fillStyle=c.c; rr(q.x+c.dx-c.w/2,q.y+c.dy-c.h/2,c.w,c.h,2); g.fill(); g.strokeStyle='rgba(0,0,0,.12)'; g.lineWidth=.8; g.stroke(); });
  });
  var c=LV.counter; g.fillStyle=P.sh; rr(c.x-70*S+3,c.y-14*S+4,140*S,28*S,6); g.fill(); g.fillStyle=P.navy; rr(c.x-70*S,c.y-14*S,140*S,28*S,6); g.fill(); g.fillStyle=P.gold; rr(c.x-60*S,c.y-3*S,36*S,6*S,2); g.fill();
  g.fillStyle=P.floor2; g.strokeStyle=P.line; rr(LV.door.x-48*S,H-8,96*S,8,2); g.fill(); g.stroke();
  LV.ppl.forEach(function(p){ p.draw(); });
  g.strokeStyle=dark?'rgba(255,255,255,.5)':'rgba(255,255,255,.95)'; g.lineWidth=1.2; LV.bub.forEach(function(b){ g.globalAlpha=1-b.l/2.4; circ(b.x,b.y,b.r); g.stroke(); }); g.globalAlpha=1;
}

/* ═══ SCÈNE : ville (index = Akèy, travay) ═══ */
var CT={};
function cityInit(){
  CT.blocks=[]; CT.ppl=[]; CT.cars=[]; CT.marks=[]; CT.pulses=[];
  var cols=W<700?2:W<1100?3:4, rows=H<640?2:3, rw=34*S, gx=W/cols, gy=H/rows;
  CT.rw=rw; CT.vx=[]; CT.hy=[];
  for(var c=1;c<cols;c++) CT.vx.push(gx*c+rnd(-10,10));
  for(var r=1;r<rows;r++) CT.hy.push(gy*r+rnd(-8,8));
  var xs=[0].concat(CT.vx,[W]), ys=[0].concat(CT.hy,[H]);
  for(var i=0;i<xs.length-1;i++) for(var j=0;j<ys.length-1;j++){
    var pad=rw/2+14*S, x=xs[i]+(i?pad:-40), y=ys[j]+(j?pad:-40), w=xs[i+1]-(i<xs.length-2?pad:-40)-x, h=ys[j+1]-(j<ys.length-2?pad:-40)-y;
    if(w<40||h<40) continue;
    var b={x:x,y:y,w:w,h:h,ci:Math.floor(Math.random()*4),det:[]};
    for(var k=0;k<Math.floor(w*h/9000);k++) b.det.push({x:rnd(.1,.8),y:rnd(.1,.8),w:rnd(.06,.16),h:rnd(.06,.16),t:Math.random()<.5?0:1});
    b.mark=(kind==='travay'||kind==='akey')&&Math.random()<(kind==='travay'?.55:.4); b.ph=rnd(0,TAU); b.icon=['wash','cart','dice','case'][(i+j)%4];
    CT.blocks.push(b);
  }
  var n=Math.max(8,Math.min(22,Math.floor(W*H/42000)));
  for(var q=0;q<n;q++) cityPed(true);
  var nc=Math.max(3,Math.min(9,Math.floor((W+H)/230)));
  for(var z=0;z<nc;z++) cityCar();
}
function cityPed(scatter){
  var b=pick(CT.blocks); if(!b) return; var o=CT.rw/2+6*S, ccw=Math.random()<.5;
  var p=new Person({x:0,y:0,sp:rnd(22,38),job:kind==='travay'&&Math.random()<.35?'hat':(Math.random()<.3?'hair':''),carry:pick(['','','bag','case','tool'])});
  p.b=b; p.ccw=ccw; p.o=o; p.pt=scatter?Math.floor(rnd(0,4)):0; p.i=p.pt;
  var cor=cityCorner(b,p.o,p.i); p.x=cor[0]; p.y=cor[1]; p.tx=p.x; p.ty=p.y; cityNext(p); CT.ppl.push(p);
}
function cityCorner(b,o,i){ var xs=[b.x-o,b.x+b.w+o,b.x+b.w+o,b.x-o], ys=[b.y-o,b.y-o,b.y+b.h+o,b.y+b.h+o]; return [xs[i%4],ys[i%4]]; }
function cityNext(p){ p.i=(p.i+(p.ccw?3:1))%4; var c=cityCorner(p.b,p.o,p.i); p.tx=c[0]+rnd(-3,3); p.ty=c[1]+rnd(-3,3); if(Math.random()<.18) p.wait=rnd(1,3); }
function cityCar(){
  var hz=Math.random()<.5, lanes=hz?CT.hy:CT.vx; if(!lanes.length) hz=!hz, lanes=hz?CT.hy:CT.vx; if(!lanes.length) return;
  var L=pick(lanes), dirS=Math.random()<.5?1:-1, off=(dirS>0?1:-1)*CT.rw*.22;
  var taxi=(kind==='akey')&&Math.random()<.4;
  CT.cars.push(new Car({x:hz?rnd(0,W):L+off,y:hz?L+off:rnd(0,H),dir:hz?[dirS,0]:[0,dirS],taxi:taxi}));
}
function cityTick(dt){
  CT.ppl.forEach(function(p){ if(p.move(dt)) cityNext(p); });
  CT.cars.forEach(function(c){ c.update(dt); });
  if(kind==='akey'&&Math.random()<dt*.7){ var hz=Math.random()<.5, L=pick(hz?CT.hy:CT.vx); if(L!=null) CT.pulses.push({hz:hz,L:L,p:hz?-20:-20,v:rnd(140,230)}); }
  CT.pulses.forEach(function(q){ q.p+=q.v*dt; }); CT.pulses=CT.pulses.filter(function(q){ return q.p<(q.hz?W:H)+30; });
}
function icon(b,cx,cy,s){
  g.save(); g.translate(cx,cy); g.strokeStyle=dark?'#E7C65A':P.navy; g.lineWidth=2*S; g.lineCap='round'; g.lineJoin='round'; g.fillStyle='none';
  if(b.icon==='wash'){ rr(-s/2,-s/2,s,s,s*.15); g.stroke(); circ(0,s*.08,s*.28); g.stroke(); }
  else if(b.icon==='cart'){ g.beginPath(); g.moveTo(-s*.5,-s*.38); g.lineTo(-s*.3,-s*.38); g.lineTo(-s*.15,s*.2); g.lineTo(s*.35,s*.2); g.lineTo(s*.45,-s*.15); g.lineTo(-s*.25,-s*.15); g.stroke(); circ(-s*.05,s*.36,s*.07); g.stroke(); circ(s*.28,s*.36,s*.07); g.stroke(); }
  else if(b.icon==='dice'){ rr(-s*.42,-s*.42,s*.84,s*.84,s*.15); g.stroke(); g.fillStyle=dark?'#E7C65A':P.navy; [[-.2,-.2],[.2,.2],[0,0],[.2,-.2],[-.2,.2]].forEach(function(d){ circ(d[0]*s,d[1]*s,s*.06); g.fill(); }); }
  else { rr(-s*.48,-s*.28,s*.96,s*.66,s*.1); g.stroke(); g.beginPath(); g.moveTo(-s*.18,-s*.28); g.lineTo(-s*.18,-s*.42); g.lineTo(s*.18,-s*.42); g.lineTo(s*.18,-s*.28); g.stroke(); }
  g.restore();
}
function cityDraw(){
  var rw=CT.rw;
  /* routes */
  g.fillStyle=P.road; CT.vx.forEach(function(x){ g.fillRect(x-rw/2,0,rw,H); }); CT.hy.forEach(function(y){ g.fillRect(0,y-rw/2,W,rw); });
  g.strokeStyle=P.lane; g.lineWidth=1.6; g.setLineDash([14*S,12*S]);
  CT.vx.forEach(function(x){ g.beginPath(); g.moveTo(x,0); g.lineTo(x,H); g.stroke(); }); CT.hy.forEach(function(y){ g.beginPath(); g.moveTo(0,y); g.lineTo(W,y); g.stroke(); }); g.setLineDash([]);
  /* passages piétons */
  g.fillStyle=dark?'rgba(255,255,255,.1)':'rgba(255,255,255,.7)';
  CT.vx.forEach(function(x){ CT.hy.forEach(function(y){ for(var k=-2;k<=2;k++){ g.fillRect(x-rw/2+2,y+rw/2+4+k*0+ (k+2)*5*S,rw-4,2.5*S); g.fillRect(x+rw/2+4+(k+2)*5*S,y-rw/2+2,2.5*S,rw-4); } }); });
  /* blocs */
  CT.blocks.forEach(function(b){
    g.fillStyle=P.walk; rr(b.x-10*S,b.y-10*S,b.w+20*S,b.h+20*S,14*S); g.fill();
    g.fillStyle=P.sh; rr(b.x+4,b.y+6,b.w,b.h,10*S); g.fill();
    g.fillStyle=P.bld[b.ci]; rr(b.x,b.y,b.w,b.h,10*S); g.fill(); g.strokeStyle=P.line; g.lineWidth=1; g.stroke();
    g.fillStyle=P.roof[b.ci]; rr(b.x+8*S,b.y+8*S,b.w-16*S,b.h-16*S,6*S); g.fill();
    b.det.forEach(function(d){ var dx=b.x+b.w*d.x, dy=b.y+b.h*d.y, dw=b.w*d.w, dh=b.h*d.h; g.fillStyle=d.t?P.bld[b.ci]:P.mach2; rr(dx,dy,dw,dh,3); g.fill(); if(d.t){ g.strokeStyle=P.line; g.stroke(); } });
    var sz=Math.min(46*S,Math.min(b.w,b.h)*.36);
    if(kind==='akey'&&b.w>90&&b.h>90) icon(b,b.x+b.w/2,b.y+b.h/2,sz);
    if(b.mark&&b.w>70&&b.h>70){ var pu=.55+.45*Math.sin(t*2.2+b.ph), cx=b.x+b.w-26*S, cy=b.y+26*S; g.fillStyle='rgba(212,175,55,'+(.18+.18*pu)+')'; circ(cx,cy,(16+6*pu)*S); g.fill(); g.fillStyle=dark?'#E7C65A':'#B8912A'; star4(cx,cy,11*S,.32); g.fill(); }
  });
  /* impulsions dorées sur les routes (akey) */
  g.fillStyle=P.gold; CT.pulses.forEach(function(q){ for(var k=0;k<7;k++){ g.globalAlpha=(1-k/7)*.8; var pp=q.p-k*9; if(q.hz) circ(pp,q.L,3.2*S*(1-k/9)); else circ(q.L,pp,3.2*S*(1-k/9)); g.fill(); } }); g.globalAlpha=1;
  CT.cars.forEach(function(c){ c.draw(); }); CT.ppl.forEach(function(p){ p.draw(); });
}

/* ═══ SCÈNE : games (le salon) ═══ */
var GA={};
function gamesInit(){
  GA.dig=[]; GA.stars=[]; GA.sh=[]; GA.pcs=[];
  var n=Math.max(18,Math.min(46,Math.floor(W*H/22000)));
  for(var i=0;i<n;i++) GA.dig.push({x:rnd(0,W),y:rnd(0,H),v:rnd(8,22),d:1+Math.floor(Math.random()*9),s:rnd(18,54),ph:rnd(0,TAU),a:rnd(.08,.3),rot:rnd(-.5,.5),gold:Math.random()<.35});
  for(var j=0;j<Math.floor(W*H/9000);j++) GA.stars.push({x:rnd(0,W),y:rnd(0,H),r:rnd(.5,1.6),ph:rnd(0,TAU),f:rnd(.6,2.2)});
  for(var k=0;k<Math.max(3,Math.floor(W/260));k++) GA.pcs.push({x:rnd(0,W),y:rnd(0,H),k:pick(['dice','pawn','card','king']),s:rnd(26,44),rot:rnd(0,TAU),w:rnd(-.25,.25),vx:rnd(-9,9),vy:rnd(-7,7),a:rnd(.2,.4)});
}
function gamesTick(dt){
  GA.dig.forEach(function(d){ d.y-=d.v*dt*S; d.x+=Math.sin(t*.4+d.ph)*6*dt; if(d.y<-60){ d.y=H+60; d.x=rnd(0,W); d.d=1+Math.floor(Math.random()*9); } });
  GA.pcs.forEach(function(p){ p.x+=p.vx*dt; p.y+=p.vy*dt; p.rot+=p.w*dt; if(p.x<-60) p.x=W+60; if(p.x>W+60) p.x=-60; if(p.y<-60) p.y=H+60; if(p.y>H+60) p.y=-60; });
  if(Math.random()<dt*.35) GA.sh.push({x:rnd(W*.2,W*1.1),y:rnd(-20,H*.4),l:0,vx:-rnd(380,620),vy:rnd(180,300)});
  GA.sh.forEach(function(s){ s.l+=dt; s.x+=s.vx*dt; s.y+=s.vy*dt; }); GA.sh=GA.sh.filter(function(s){ return s.l<1.1; });
}
function piece(p){
  g.save(); g.translate(p.x,p.y); g.rotate(p.rot); g.globalAlpha=p.a; g.strokeStyle=dark?'#E7C65A':P.navy; g.fillStyle=dark?'rgba(231,198,90,.14)':'rgba(20,35,79,.08)'; g.lineWidth=2; var s=p.s*S;
  if(p.k==='dice'){ rr(-s/2,-s/2,s,s,s*.2); g.fill(); g.stroke(); g.fillStyle=g.strokeStyle; [[-.22,-.22],[.22,.22],[0,0],[.22,-.22],[-.22,.22]].forEach(function(d){ circ(d[0]*s,d[1]*s,s*.07); g.fill(); }); }
  else if(p.k==='card'){ rr(-s*.38,-s*.55,s*.76,s*1.1,s*.1); g.fill(); g.stroke(); g.fillStyle=g.strokeStyle; star4(0,0,s*.26,.35); g.fill(); }
  else if(p.k==='pawn'){ circ(0,-s*.22,s*.2); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-s*.2,s*.38); g.quadraticCurveTo(-s*.08,-s*.02,-s*.04,-s*.02); g.lineTo(s*.04,-s*.02); g.quadraticCurveTo(s*.08,-s*.02,s*.2,s*.38); g.closePath(); g.fill(); g.stroke(); }
  else { g.beginPath(); g.moveTo(-s*.3,s*.4); g.lineTo(-s*.34,-s*.05); g.lineTo(-s*.14,s*.05); g.lineTo(0,-s*.3); g.lineTo(s*.14,s*.05); g.lineTo(s*.34,-s*.05); g.lineTo(s*.3,s*.4); g.closePath(); g.fill(); g.stroke(); }
  g.restore();
}
function gamesDraw(){
  /* grille de Sudoku géante, très discrète */
  var cs=Math.min(W,H)*.1, gx=W*.5-cs*4.5, gy=H*.5-cs*4.5; g.strokeStyle=dark?'rgba(212,175,55,.09)':'rgba(20,35,79,.06)';
  for(var i=0;i<=9;i++){ g.lineWidth=i%3?1:2.2; g.beginPath(); g.moveTo(gx+i*cs,gy); g.lineTo(gx+i*cs,gy+9*cs); g.stroke(); g.beginPath(); g.moveTo(gx,gy+i*cs); g.lineTo(gx+9*cs,gy+i*cs); g.stroke(); }
  GA.stars.forEach(function(s){ var a=.35+.65*Math.abs(Math.sin(t*s.f+s.ph)); g.fillStyle=dark?'rgba(255,255,255,'+(a*.7)+')':'rgba(184,145,42,'+(a*.55)+')'; circ(s.x,s.y,s.r); g.fill(); });
  GA.pcs.forEach(piece);
  GA.dig.forEach(function(d){ g.save(); g.translate(d.x,d.y); g.rotate(d.rot); g.globalAlpha=d.a*(.7+.3*Math.sin(t+d.ph)); g.font='600 '+(d.s*S)+'px "Cormorant Garamond",Georgia,serif'; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle=d.gold?(dark?'#E7C65A':'#B8912A'):(dark?'#C3CADF':P.navy); g.fillText(d.d,0,0); g.restore(); });
  GA.sh.forEach(function(s){ var a=1-s.l/1.1, L=120; var gr=g.createLinearGradient(s.x,s.y,s.x-s.vx*.2,s.y-s.vy*.2); gr.addColorStop(0,dark?'rgba(255,244,201,'+a+')':'rgba(184,145,42,'+a+')'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.strokeStyle=gr; g.lineWidth=2; g.beginPath(); g.moveTo(s.x,s.y); g.lineTo(s.x-s.vx*.2,s.y-s.vy*.2); g.stroke(); });
}

/* ── Boucle ── */
var SC={ lavri:{init:lavriInit,tick:lavriTick,draw:lavriDraw}, akey:{init:cityInit,tick:cityTick,draw:cityDraw}, travay:{init:cityInit,tick:cityTick,draw:cityDraw}, games:{init:gamesInit,tick:gamesTick,draw:gamesDraw} }[kind];
if(!SC) return;
function bg(){
  g.fillStyle=P.floor; g.fillRect(0,0,W,H);
  if(kind==='lavri'){ var ts=48*S; g.strokeStyle=P.tile; g.lineWidth=1; g.beginPath(); for(var x=0;x<W;x+=ts){ g.moveTo(x,0); g.lineTo(x,H); } for(var y=0;y<H;y+=ts){ g.moveTo(0,y); g.lineTo(W,y); } g.stroke(); }
  else if(kind==='games'){ var gr=g.createRadialGradient(W*.75,H*.15,0,W*.75,H*.15,Math.max(W,H)*.8); gr.addColorStop(0,dark?'rgba(212,175,55,.10)':'rgba(212,175,55,.12)'); gr.addColorStop(1,'rgba(0,0,0,0)'); g.fillStyle=gr; g.fillRect(0,0,W,H); }
}
function frame(now){
  raf=0; if(hidden) return;
  var dt=(now-last)/1000||.016;
  if(!CALM){ var lim=innerWidth<760?1/30:1/50; if(dt<lim*.9){ raf=requestAnimationFrame(frame); return; } dt=Math.min(.05,dt); last=now; t+=dt; SC.tick(dt); } else last=now;
  bg(); SC.draw(); if(!CALM) raf=requestAnimationFrame(frame);
}
function start(){ if(!raf&&!hidden) raf=requestAnimationFrame(function(n){ last=n; frame(n); }); }
function rebuild(){ theme(); size(); t=0; SC.init(); if(CALM){ for(var i=0;i<30;i++) SC.tick(.1); bg(); SC.draw(); } else { bg(); SC.draw(); start(); } }
var rt=0; addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(rebuild,200); });
addEventListener('zt-theme',function(){ theme(); if(CALM){ bg(); SC.draw(); } });
document.addEventListener('visibilitychange',function(){ hidden=document.hidden; if(!hidden) start(); });
addEventListener('pointermove',function(e){ ptr.x=e.clientX; ptr.y=e.clientY; },{passive:true});
addEventListener('pointerdown',function(e){ ptr.x=e.clientX; ptr.y=e.clientY; },{passive:true});
addEventListener('pointerleave',function(){ ptr.x=ptr.y=-999; });
var vt=0; function onScroll(){ if(vt) return; vt=requestAnimationFrame(function(){ vt=0; var v=clamp((scrollY-innerHeight*.08)/(innerHeight*.5),0,.94); document.documentElement.style.setProperty('--veil',v.toFixed(3)); }); }
addEventListener('scroll',onScroll,{passive:true}); onScroll();
rebuild();
/* Habitants qui peuvent parler (talk.js) : {x,y,ref,k:'p'|'c'|'o'} en pixels écran, y = au-dessus de la tête */
function ents(){
  var o=[];
  if(kind==='lavri'){ (LV.ppl||[]).forEach(function(p){ if(!p.dead) o.push({x:p.x,y:p.y-15*S,ref:p,k:'p'}); }); }
  else if(kind==='games'){ (GA.pcs||[]).forEach(function(p){ o.push({x:p.x,y:p.y-p.s*.55,ref:p,k:'o',t:p.k}); }); }
  else { (CT.ppl||[]).forEach(function(p){ if(!p.dead) o.push({x:p.x,y:p.y-15*S,ref:p,k:'p'}); }); (CT.cars||[]).forEach(function(c){ o.push({x:c.x,y:c.y-14*S,ref:c,k:'c'}); }); }
  return o;
}
window.__scene={kind:kind,ents:ents,ptr:function(){ return ptr; },dark:function(){ return dark; },scale:function(){ return S; },redraw:function(){ bg(); SC.draw(); },step:function(n){ for(var i=0;i<n;i++) SC.tick(.05); }};
})();
