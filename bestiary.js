/* Bestiaire de « La course vers la mort » — fiches des personnages, animaux et créatures.
   Chargé à la demande (bouton « Personnages »). N'influence aucune règle du jeu.
   Les images sont toujours affichées ; la 3D tournante s'ajoute quand l'appareil la supporte. */
(function(){
'use strict';
if(window.ZBest) return;
var DATA = [
{
"id": "coureuse",
"n": "La coureuse",
"k": "coureuse",
"e": "Toutes les routes",
"d": "Jeune femme aux cheveux bouclés, veste rouge croisée, jupe noire et bottes. Le modèle est fourni en pose en T.",
"r": "Deuxième coureuse jouable : choisis-la avant de prendre la route.",
"s": "jeu"
},
{
"id": "bandit-homme",
"n": "Bandit",
"k": "humain",
"e": "Ville abandonnée",
"d": "Homme brun en blouson de cuir beige et gilet noir, ceinture à étuis, foulard au cou et bottes. Allure de pillard des routes.",
"r": "Guette les voyageurs dans les rues désertes et leur barre le passage.",
"s": "bientot"
},
{
"id": "bandit-femme",
"n": "Bandite",
"k": "humain",
"e": "Ville abandonnée",
"d": "Femme aux cheveux relevés, gilet beige à poches, foulard, sac à dos et gants. Équipement léger de pillarde.",
"r": "Surgit des ruelles pour couper la route aux coureurs trop lents.",
"s": "bientot"
},
{
"id": "colosse",
"n": "Colosse bandit",
"k": "humain",
"e": "Ville abandonnée",
"d": "Homme massif aux épaulières métalliques, ceinturon chargé et gants de cuir. Bien plus large que les autres bandits.",
"r": "Occupe presque toute la route : il faut l’éviter ou sauter à temps.",
"s": "bientot"
},
{
"id": "zombie",
"n": "Zombie",
"k": "humain",
"e": "Ville abandonnée",
"d": "Homme maigre à la peau grise, débardeur déchiré, short en lambeaux, pieds nus, bras pendants.",
"r": "Avance lentement mais en nombre dans les rues de la ville.",
"s": "bientot"
},
{
"id": "tigre",
"n": "Tigre",
"k": "animal",
"e": "Jungle ancienne",
"d": "Tigre du Bengale : fourrure orange rayée de noir, poitrail blanc. Rendu très naturel.",
"r": "Prédateur rapide qui bondit sur le sentier.",
"s": "bientot"
},
{
"id": "crocodile",
"n": "Crocodile",
"k": "animal",
"e": "Jungle ancienne",
"d": "Crocodile couleur sable, gueule fermée, longue queue. Le modèle le plus léger du lot (4 364 triangles).",
"r": "Rôde au bord des rivières et traverse la route sans prévenir.",
"s": "bientot"
},
{
"id": "loup",
"n": "Loup gris",
"k": "animal",
"e": "Région glaciale",
"d": "Loup au pelage gris et beige, queue touffue, posture alerte.",
"r": "Court en meute derrière le coureur.",
"s": "bientot"
},
{
"id": "grand-loup",
"n": "Le grand méchant loup",
"k": "animal",
"e": "Région glaciale",
"d": "Grand loup blanc au pelage épais, tête basse et gueule entrouverte. Plus massif et plus menaçant que le loup gris.",
"r": "Plus grand et plus rapide que la meute : ne le laisse pas approcher.",
"s": "bientot"
},
{
"id": "ours",
"n": "Ours brun",
"k": "animal",
"e": "Région glaciale",
"d": "Grizzly à fourrure brune, démarche lourde, tête arrondie. Proportions réussies.",
"r": "Lent mais puissant, il se plante au milieu du chemin.",
"s": "bientot"
},
{
"id": "serpent",
"n": "Serpent à sonnette",
"k": "animal",
"e": "Canyon désertique",
"d": "Serpent enroulé en spirale, motifs beige et brun, sonnette au bout de la queue, tête dressée.",
"r": "Enroulé au sol : saute-le dès que la sonnette retentit.",
"s": "bientot"
},
{
"id": "araignee-noire",
"n": "Araignée noire",
"k": "creature",
"e": "Jungle ancienne",
"d": "Grosse araignée à pattes fines et abdomen bombé. Sa texture est presque entièrement noire.",
"r": "Tisse ses pièges entre les arbres et sous les ponts.",
"s": "bientot"
},
{
"id": "araignee-monstre",
"n": "Araignée monstrueuse",
"k": "creature",
"e": "Ville abandonnée",
"d": "Araignée noire rayée de jaune, crocs blancs et yeux rouges. Plus détaillée et plus agressive que l'araignée noire.",
"r": "Agressive et rapide, elle sort des bâtiments en ruine.",
"s": "bientot"
},
{
"id": "dimon",
"n": "Dimon",
"k": "creature",
"e": "Zone volcanique",
"d": "Petit démon ailé : grandes ailes de chauve-souris, cornes, queue fine. Ailes écartées.",
"r": "Démon ailé qui attaque en piqué : baisse-toi au bon moment.",
"s": "bientot"
},
{
"id": "manon-fire",
"n": "Manon Fire",
"k": "creature",
"e": "Zone volcanique",
"d": "Géant de roche noire hérissé de pointes, avec des fissures rougeoyantes sur le torse et les bras.",
"r": "Golem de roche et de lave qui barre la route.",
"s": "bientot"
},
{
"id": "roi-scorpion",
"n": "Le roi scorpion",
"k": "creature",
"e": "Canyon désertique",
"d": "Scorpion géant brun et doré : grandes pinces, queue recourbée terminée par un dard.",
"r": "Ses pinces et son dard bloquent le passage dans le canyon.",
"s": "bientot"
},
{
"id": "ver-geant",
"n": "Ver géant",
"k": "creature",
"e": "Canyon désertique",
"d": "Ver de sable géant : corps annelé et piquants, gueule ronde garnie de crocs, pinces.",
"r": "Surgit du sable devant le coureur et ouvre une brèche dans la route.",
"s": "bientot"
},
{
"id": "cerbere",
"n": "Cerbère ancestral",
"k": "boss",
"e": "Ville abandonnée",
"d": "Bête gris-noir au corps de félin et à la longue queue, avec deux têtes bien visibles.",
"r": "Boss de la ville abandonnée : un gardien à deux têtes qui poursuit le coureur.",
"s": "bientot"
},
{
"id": "dragon",
"n": "Dragon dévoreur",
"k": "boss",
"e": "Zone volcanique",
"d": "Dragon brun foncé aux ailes déployées, cornes sur la tête et longue queue épineuse.",
"r": "Boss de la zone volcanique : il survole la route et crache le feu.",
"s": "bientot"
},
{
"id": "roi-sables",
"n": "Roi des sables",
"k": "boss",
"e": "Canyon désertique",
"d": "Créature debout couleur sable : tête de crocodile, torse musclé, griffes et longue queue épineuse.",
"r": "Boss du canyon : il jaillit des dunes pour couper la route.",
"s": "bientot"
},
{
"id": "yeti",
"n": "Yéti ancestral",
"k": "boss",
"e": "Région glaciale",
"d": "Gorille géant au pelage gris-blanc et au dos bleu sombre, bras énormes, crocs jaunes.",
"r": "Boss de la région glaciale : un géant des neiges aux bras immenses.",
"s": "bientot"
},
{
"id": "croco-geant",
"n": "Mère des profondeurs",
"k": "boss",
"e": "Jungle ancienne",
"d": "Crocodile géant sombre, dos hérissé de pointes, gueule pleine de dents, pattes puissantes.",
"r": "Boss de la jungle : une créature des eaux sombres qui sort des marais.",
"s": "bientot"
}
];
var KINDS = [['all','Tous'],['coureuse','Coureuse'],['humain','Humains'],['animal','Animaux'],['creature','Créatures'],['boss','Boss']];
var KLAB = { coureuse:'Coureuse', humain:'Humain', animal:'Animal', creature:'Créature', boss:'Boss' };
var BASE = 'bestiaire/';
var Z3V = 'course3d.js?v=6';
var root = null, st = { filter:'all', cur:-1, view:null, opener:null }, cssDone = false;

function el(t, c, h){ var e = document.createElement(t); if(c) e.className = c; if(h != null) e.innerHTML = h; return e; }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }

var CSS = '.zb{position:fixed;inset:0;z-index:99990;display:flex;flex-direction:column;background:radial-gradient(1100px 520px at 18% -8%,rgba(212,175,55,.13),transparent 60%),linear-gradient(180deg,#08102a,#0d1a42 60%,#08102a);color:#f4f1e8;font-family:Inter,system-ui,sans-serif;overscroll-behavior:contain}'
 + '.zb *{box-sizing:border-box}.zb[hidden]{display:none!important}'
 + '.zb-top{display:flex;align-items:center;gap:14px;padding:max(14px,env(safe-area-inset-top)) max(16px,env(safe-area-inset-right)) 12px max(16px,env(safe-area-inset-left));border-bottom:1px solid rgba(240,217,138,.22)}'
 + '.zb-top h2{margin:0;flex:1;font:600 clamp(1.5rem,4.6vw,2.3rem)/1 var(--serif,"Cormorant Garamond",Georgia,serif);color:#fff}'
 + '.zb-top h2 small{display:block;margin-top:5px;font:500 .8rem/1.3 Inter,system-ui,sans-serif;color:#b9c1da;letter-spacing:0}'
 + '.zb-x,.zb-nav button{min-width:44px;min-height:44px;padding:0 16px;border-radius:99px;border:1px solid rgba(240,217,138,.3);background:rgba(8,14,38,.7);color:#f4f1e8;font:600 .95rem Inter,system-ui,sans-serif;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px}'
 + '.zb-x:hover,.zb-nav button:hover:not(:disabled){border-color:#D4AF37;color:#F0D98A}.zb-nav button:disabled{opacity:.4;cursor:default}'
 + '.zb button:focus-visible{outline:2px solid #F0D98A;outline-offset:3px}'
 + '.zb-body{flex:1;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch}'
 + '.zb-in{padding:16px max(16px,env(safe-area-inset-right)) max(28px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));max-width:1180px;margin:0 auto}'
 + '.zb-f{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px}'
 + '.zb-f button{min-height:40px;padding:0 16px;border-radius:99px;border:1px solid rgba(240,217,138,.26);background:rgba(255,255,255,.04);color:#dfe4f3;font:600 .9rem Inter,system-ui,sans-serif;cursor:pointer}'
 + '.zb-f button[aria-pressed=true]{background:rgba(212,175,55,.2);border-color:#F0D98A;color:#fff}'
 + '.zb-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px;margin:0;padding:0;list-style:none}'
 + '.zb-c{width:100%;display:block;text-align:left;padding:0;border-radius:16px;overflow:hidden;border:1px solid rgba(240,217,138,.22);background:rgba(255,255,255,.04);color:inherit;cursor:pointer;transition:transform .15s,border-color .15s}'
 + '.zb-c:hover{transform:translateY(-3px);border-color:#D4AF37}'
 + '.zb-c img{display:block;width:100%;aspect-ratio:16/10;object-fit:cover;background:#0d1a42}'
 + '.zb-c div{padding:10px 12px 12px}.zb-c b{display:block;font:700 1.25rem/1.1 "Barlow Condensed",Inter,sans-serif;letter-spacing:.02em;color:#fff}'
 + '.zb-c span{display:block;margin-top:4px;font-size:.8rem;line-height:1.35;color:#b9c1da}'
 + '.zb-tag{display:inline-block;margin:0 6px 0 0;padding:2px 8px;border-radius:99px;font-size:.72rem;font-weight:700;background:rgba(212,175,55,.18);color:#F0D98A}'
 + '.zb-tag.b{background:rgba(255,107,97,.2);color:#ffb3ac}'
 + '.zb-d{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:22px;align-items:start}'
 + '.zb-v{position:relative;border-radius:20px;overflow:hidden;border:1px solid rgba(240,217,138,.26);background:radial-gradient(circle at 50% 30%,rgba(240,217,138,.2),rgba(8,16,42,.9));aspect-ratio:4/3;max-height:68vh;width:100%}'
 + '.zb-v img,.zb-v canvas{position:absolute;inset:0;width:100%;height:100%;display:block}'
 + '.zb-v img{object-fit:cover;filter:saturate(.9)}.zb-v canvas{touch-action:pan-y;cursor:grab}.zb-v canvas:active{cursor:grabbing}'
 + '.zb-v .zb-msg{position:absolute;left:12px;bottom:10px;padding:5px 11px;border-radius:99px;background:rgba(8,14,38,.75);font-size:.76rem;color:#dfe4f3}'
 + '.zb-t h3{margin:0 0 8px;font:600 clamp(2rem,6vw,3rem)/1 var(--serif,"Cormorant Garamond",Georgia,serif);color:#fff}'
 + '.zb-t p{margin:12px 0 0;line-height:1.65;color:#dfe4f3;max-width:60ch}.zb-t .lb{display:block;margin-top:18px;font:700 .8rem Inter,system-ui,sans-serif;letter-spacing:.06em;color:#F0D98A}'
 + '.zb-nav{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap}.zb-nav button{padding:0 14px}.zb-nav [data-back]{flex:1 1 100%}.zb-nav [data-prev],.zb-nav [data-next]{flex:1 1 0}@media (min-width:761px){.zb-nav [data-back]{flex:0 0 auto}.zb-nav [data-prev],.zb-nav [data-next]{flex:0 0 auto}}'
 + '@media (max-width:760px){.zb-d{grid-template-columns:1fr}.zb-v{max-height:50vh}.zb-g{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}}'
 + '@media (prefers-reduced-motion:reduce){.zb-c{transition:none}}';

function build(){
  if(root) return;
  if(!cssDone){ var s = el('style'); s.textContent = CSS; document.head.appendChild(s); cssDone = true; }
  root = el('div', 'zb'); root.hidden = true; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Personnages de La course vers la mort');
  root.innerHTML = '<div class="zb-top"><h2>Personnages<small>Les coureurs, les dangers et les boss de la route</small></h2><button type="button" class="zb-x" data-x>Fermer</button></div><div class="zb-body"><div class="zb-in" id="zb-in"></div></div>';
  document.body.appendChild(root);
  root.addEventListener('click', function(e){
    var t = e.target;
    if(t.closest('[data-x]')){ close(); return; }
    var f = t.closest('[data-f]'); if(f){ st.filter = f.dataset.f; showList(); return; }
    var c = t.closest('[data-i]'); if(c){ showOne(+c.dataset.i); return; }
    if(t.closest('[data-back]')){ showList(true); return; }
    if(t.closest('[data-prev]')) step(-1); else if(t.closest('[data-next]')) step(1);
  });
  root.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ e.preventDefault(); if(st.cur >= 0) showList(true); else close(); }
    else if(st.cur >= 0 && e.key === 'ArrowLeft'){ step(-1); } else if(st.cur >= 0 && e.key === 'ArrowRight'){ step(1); }
    else if(e.key === 'Tab'){
      var q = root.querySelectorAll('button:not(:disabled)'); if(!q.length) return;
      var a = q[0], z = q[q.length - 1];
      if(e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); } else if(!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); }
    }
  });
}
function vis(){ return DATA.map(function(d, i){ return i; }).filter(function(i){ return st.filter === 'all' || DATA[i].k === st.filter; }); }

function showList(keepFocus){
  stop3d(); st.cur = -1;
  var box = root.querySelector('#zb-in'), ids = vis();
  var h = '<div class="zb-f" role="group" aria-label="Filtrer">' + KINDS.map(function(k){ return '<button type="button" data-f="' + k[0] + '" aria-pressed="' + (st.filter === k[0]) + '">' + k[1] + '</button>'; }).join('') + '</div><ul class="zb-g">';
  ids.forEach(function(i){
    var d = DATA[i];
    h += '<li><button type="button" class="zb-c" data-i="' + i + '"><img src="' + BASE + d.id + '.jpg" alt="" loading="lazy" decoding="async" width="560" height="330"><div><b>' + esc(d.n) + '</b><span><i class="zb-tag' + (d.k === 'boss' ? ' b' : '') + '">' + KLAB[d.k] + '</i>' + esc(d.e) + '</span></div></button></li>';
  });
  box.innerHTML = h + '</ul>';
  root.querySelector('.zb-body').scrollTop = 0;
  var tgt = box.querySelector('[data-f][aria-pressed=true]'); if(tgt && keepFocus !== 'noFocus') try{ tgt.focus({ preventScroll:true }); }catch(e){}
}

function step(dx){
  var ids = vis(), p = ids.indexOf(st.cur); if(p < 0) return;
  showOne(ids[(p + dx + ids.length) % ids.length]);
}

function showOne(i){
  stop3d(); st.cur = i;
  var d = DATA[i], ids = vis(), box = root.querySelector('#zb-in');
  box.innerHTML = '<div class="zb-d"><div class="zb-v" id="zb-v"><img src="' + BASE + d.id + '.jpg" alt="' + esc(d.n) + ' en 3D"><div class="zb-msg" id="zb-msg" hidden></div></div>'
    + '<div class="zb-t"><span><i class="zb-tag' + (d.k === 'boss' ? ' b' : '') + '">' + KLAB[d.k] + '</i><i class="zb-tag">' + (d.s === 'jeu' ? 'Dans le jeu' : 'Bientôt sur la route') + '</i></span>'
    + '<h3>' + esc(d.n) + '</h3><span class="lb">Où le croiser</span><p>' + esc(d.e) + '</p><span class="lb">Description</span><p>' + esc(d.d) + '</p><span class="lb">Rôle dans le jeu</span><p>' + esc(d.r) + '</p>'
    + '<div class="zb-nav"><button type="button" data-back>Tous les personnages</button><button type="button" data-prev' + (ids.length < 2 ? ' disabled' : '') + ' aria-label="Précédent">Précédent</button><button type="button" data-next' + (ids.length < 2 ? ' disabled' : '') + ' aria-label="Suivant">Suivant</button></div></div></div>';
  root.querySelector('.zb-body').scrollTop = 0;
  var bk = box.querySelector('[data-back]'); try{ bk.focus({ preventScroll:true }); }catch(e){}
  start3d(d);
}

/* ── Visionneuse 3D (facultative) ── */
function can3d(){
  try{
    if(/[?&]q3d=off/.test(location.search)) return false;
    var n = navigator; if((n.deviceMemory && n.deviceMemory <= 1) || (n.connection && n.connection.saveData)) return false;
  }catch(e){}
  return true;
}
function needZ3D(cb){
  var ok = function(){ return window.Z3D && window.Z3D.THREE && window.Z3D.GLTFLoader; };
  if(ok()) return cb(true);
  var t0 = Date.now(), sc = null;
  var ss = document.getElementsByTagName('script');
  for(var i = 0; i < ss.length; i++) if(/course3d\.js/.test(ss[i].src)) sc = ss[i];
  if(!sc){ sc = document.createElement('script'); sc.src = Z3V; sc.async = true; document.head.appendChild(sc); }
  var iv = setInterval(function(){
    if(ok()){ clearInterval(iv); cb(true); } else if(Date.now() - t0 > 20000){ clearInterval(iv); cb(false); }
  }, 120);
  sc.addEventListener('error', function(){ clearInterval(iv); cb(false); });
}
function note(t){ var m = root && root.querySelector('#zb-msg'); if(!m) return; if(t){ m.textContent = t; m.hidden = false; } else m.hidden = true; }

function start3d(d){
  if(!can3d()){ return; }
  var token = {}; st.view = { token:token };
  note('Chargement du modèle 3D…');
  needZ3D(function(ok){
    if(st.view !== null && st.view.token !== token) return;
    if(!ok){ note(''); return; }
    var T = window.Z3D.THREE, host = root.querySelector('#zb-v'); if(!host) return;
    var renderer, cv;
    try{
      cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true');
      renderer = new T.WebGLRenderer({ canvas:cv, antialias:true, alpha:true, powerPreference:'low-power' });
    }catch(e){ note(''); return; }
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr); renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.5;
    var scene = new T.Scene();
    scene.add(new T.HemisphereLight(0xffffff, 0x707078, 2.6)); scene.add(new T.AmbientLight(0xffffff, 1.1));
    var key = new T.DirectionalLight(0xfff1dd, 3.2); key.position.set(3, 5, 4); scene.add(key);
    var fill = new T.DirectionalLight(0xffffff, 1.6); fill.position.set(-2, 2, 5); scene.add(fill);
    var back = new T.DirectionalLight(0xffffff, 1.8); back.position.set(1, 2, -5); scene.add(back);
    var rim = new T.DirectionalLight(0x9db8ff, 1.6); rim.position.set(-4, 3, -4); scene.add(rim);
    var cam = new T.PerspectiveCamera(32, 1, .01, 500);
    var pivot = new T.Group(); scene.add(pivot);
    var V = { token:token, renderer:renderer, scene:scene, cv:cv, raf:0, rot:0.5, vel:0, drag:null, zoom:1, dist:3, ready:false, dead:false, host:host, cam:cam, pivot:pivot, auto:!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) };
    st.view = V;
    new window.Z3D.GLTFLoader().load(BASE + d.id + '.glb', function(g){
      if(V.dead) { disposeScene(scene); return; }
      var m = g.scene, box = new T.Box3().setFromObject(m), c = box.getCenter(new T.Vector3()), sph = box.getBoundingSphere(new T.Sphere());
      m.position.sub(c); pivot.add(m);
      var r = Math.max(sph.radius, .001);
      V.dist = r * .88 / Math.sin(cam.fov * Math.PI / 360); V.r = r;
      host.appendChild(cv); V.ready = true; note('');
      var im = host.querySelector('img'); if(im) im.style.opacity = '0';
      size(V); loop(V);
    }, undefined, function(){ if(!V.dead) note(''); });
    cv.addEventListener('pointerdown', function(e){ V.drag = { x:e.clientX, id:e.pointerId }; V.vel = 0; try{ cv.setPointerCapture(e.pointerId); }catch(x){} });
    cv.addEventListener('pointermove', function(e){ if(!V.drag || e.pointerId !== V.drag.id) return; var dx = e.clientX - V.drag.x; V.drag.x = e.clientX; V.rot += dx * .011; V.vel = dx * .011; });
    var up = function(){ V.drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', function(e){ e.preventDefault(); V.zoom = Math.max(.55, Math.min(1.6, V.zoom * (e.deltaY > 0 ? 1.08 : .92))); }, { passive:false });
    V.ro = (window.ResizeObserver ? new ResizeObserver(function(){ size(V); }) : null); if(V.ro) V.ro.observe(host);
  });
}
function size(V){
  if(!V.ready || V.dead) return; var w = V.host.clientWidth, h = V.host.clientHeight; if(w < 2 || h < 2) return;
  V.renderer.setSize(w, h, false); V.cam.aspect = w / h;
  /* cadrage : sur un écran étroit, reculer pour que tout reste visible */
  var fit = 1; if(V.cam.aspect < 1) fit = 1 / V.cam.aspect * .92; V.fit = Math.max(1, fit);
  V.cam.updateProjectionMatrix();
}
function loop(V){
  if(V.dead) return;
  V.raf = requestAnimationFrame(function(){ loop(V); });
  if(document.hidden) return;
  if(!V.drag){ if(Math.abs(V.vel) > .0004){ V.rot += V.vel; V.vel *= .94; } else if(V.auto) V.rot += .006; }
  V.pivot.rotation.y = V.rot;
  var dist = V.dist * (V.fit || 1) * V.zoom;
  V.cam.position.set(0, V.r * .22, dist); V.cam.lookAt(0, 0, 0);
  V.renderer.render(V.scene, V.cam);
}
function disposeScene(sc){
  sc.traverse(function(o){
    if(o.geometry) o.geometry.dispose();
    if(o.material){ (Array.isArray(o.material) ? o.material : [o.material]).forEach(function(m){ for(var k in m){ var v = m[k]; if(v && v.isTexture) v.dispose(); } m.dispose(); }); }
  });
}
function stop3d(){
  var V = st.view; st.view = null; if(!V || !V.renderer) return;
  V.dead = true; cancelAnimationFrame(V.raf); if(V.ro) V.ro.disconnect();
  try{ disposeScene(V.scene); V.renderer.dispose(); V.renderer.forceContextLoss(); }catch(e){}
  if(V.cv && V.cv.parentNode) V.cv.parentNode.removeChild(V.cv);
}

function open(id){
  build(); st.opener = document.activeElement;
  root.hidden = false; document.documentElement.style.overflow = 'hidden';
  var i = -1; if(id){ DATA.forEach(function(d, k){ if(d.id === id) i = k; }); }
  if(i >= 0){ st.filter = 'all'; showOne(i); } else showList('noFocus');
  setTimeout(function(){ var b = root.querySelector('button'); if(b && !root.contains(document.activeElement)) b.focus({ preventScroll:true }); }, 0);
}
function close(){
  if(!root) return; stop3d(); st.cur = -1; root.hidden = true; document.documentElement.style.overflow = '';
  try{ if(st.opener && st.opener.focus) st.opener.focus(); }catch(e){}
}
window.ZBest = { open:open, close:close, data:DATA };
})();
