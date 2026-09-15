/* ════════════════════════════════════════════════════════════════
   ZETWAL — Service worker
   Li kenbe paj yo nan telefòn nan pou sit la louvri menm ak yon
   move koneksyon. Li PA JANM kenbe done : pri, kòmand, pwen ak
   machin yo toujou soti dirèk nan sèvè a.
   ════════════════════════════════════════════════════════════════ */
const VERSION = 'zetwal-v1';

/* Paj ak fichye ki chaje depi telefòn nan */
const SHELL = [
  '/',
  '/index.html',
  '/lavri.html',
  '/taxi.html',
  '/shop.html',
  '/games.html',
  '/mall.html',
  '/manifest.json',
  '/logo.png',
  '/logo-192.png',
  '/logo-512.png'
];

/* Jwèt yo : yo antre nan kach la sèlman lè jwè a louvri yo yon fwa */
const GAMES = [
  'snakezetwal.html','whackzetwal.html','flappyzetwal.html','memoryzetwal.html',
  'mazezetwal.html','tetriszetwal.html','runnerzetwal.html','gomokuzetwal.html',
  'candyzetwal.html'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(VERSION).then(function(c){
      /* addAll echwe nèt si yon sèl fichye manke : nou ajoute yonn pa yonn */
      return Promise.all(SHELL.map(function(u){
        return c.add(u).catch(function(){ /* fichye sa pa la, se pa grav */ });
      }));
    }).then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k !== VERSION) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});

/* Sa nou pa janm kenbe : tout sa ki soti nan Supabase, Firebase oswa
   yon lòt sèvè. Done yo dwe toujou fre. */
function isData(url){
  return url.hostname.indexOf('supabase.co') >= 0
      || url.hostname.indexOf('firebase') >= 0
      || url.hostname.indexOf('googleapis.com') >= 0
      || url.hostname.indexOf('gstatic.com') >= 0
      || url.hostname.indexOf('qrserver.com') >= 0
      || url.pathname.indexOf('/rest/v1/') >= 0;
}

self.addEventListener('fetch', function(e){
  const req = e.request;
  if(req.method !== 'GET') return;

  const url = new URL(req.url);
  if(isData(url)) return;                    /* rezo sèlman */

  /* Paj HTML : nou eseye rezo a anvan, konsa yon mizajou parèt tousuit.
     Si rezo a tonbe, nou bay vèsyon ki nan telefòn nan. */
  const isPage = req.mode === 'navigate'
              || (req.headers.get('accept') || '').indexOf('text/html') >= 0;

  if(isPage){
    e.respondWith(
      fetch(req).then(function(res){
        const copy = res.clone();
        caches.open(VERSION).then(function(c){ c.put(req, copy); });
        return res;
      }).catch(function(){
        return caches.match(req).then(function(hit){
          return hit || caches.match('/index.html');
        });
      })
    );
    return;
  }

  /* Rès la — imaj, polis, fichye : kach anvan, rezo apre */
  e.respondWith(
    caches.match(req).then(function(hit){
      if(hit) return hit;
      return fetch(req).then(function(res){
        if(res && res.status === 200 && res.type === 'basic'){
          const copy = res.clone();
          caches.open(VERSION).then(function(c){ c.put(req, copy); });
        }
        return res;
      });
    })
  );
});

/* Lè ou mete yon nouvo vèsyon sou sèvè a, chanje VERSION anwo a :
   ansyen kach la efase pou kont li nan pwochen vizit la. */
