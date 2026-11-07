/* L'Oracle de Circé : fonctionnement hors ligne */
const CACHE = 'mv-132610af';
const FONTS = 'mv-fonts';
const FILES = ["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon-64.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "cards/c01.webp", "cards/c02.webp", "cards/c03.webp", "cards/c04.webp", "cards/c05.webp", "cards/c06.webp", "cards/c07.webp", "cards/c08.webp", "cards/c09.webp", "cards/c10.webp", "cards/c11.webp", "cards/c12.webp", "cards/c13.webp", "cards/c14.webp", "cards/m00.webp", "cards/m01.webp", "cards/m02.webp", "cards/m03.webp", "cards/m04.webp", "cards/m05.webp", "cards/m06.webp", "cards/m07.webp", "cards/m08.webp", "cards/m09.webp", "cards/m10.webp", "cards/m11.webp", "cards/m12.webp", "cards/m13.webp", "cards/m14.webp", "cards/m15.webp", "cards/m16.webp", "cards/m17.webp", "cards/m18.webp", "cards/m19.webp", "cards/m20.webp", "cards/m21.webp", "cards/p01.webp", "cards/p02.webp", "cards/p03.webp", "cards/p04.webp", "cards/p05.webp", "cards/p06.webp", "cards/p07.webp", "cards/p08.webp", "cards/p09.webp", "cards/p10.webp", "cards/p11.webp", "cards/p12.webp", "cards/p13.webp", "cards/p14.webp", "cards/s01.webp", "cards/s02.webp", "cards/s03.webp", "cards/s04.webp", "cards/s05.webp", "cards/s06.webp", "cards/s07.webp", "cards/s08.webp", "cards/s09.webp", "cards/s10.webp", "cards/s11.webp", "cards/s12.webp", "cards/s13.webp", "cards/s14.webp", "cards/w01.webp", "cards/w02.webp", "cards/w03.webp", "cards/w04.webp", "cards/w05.webp", "cards/w06.webp", "cards/w07.webp", "cards/w08.webp", "cards/w09.webp", "cards/w10.webp", "cards/w11.webp", "cards/w12.webp", "cards/w13.webp", "cards/w14.webp", "totems/abeille.png", "totems/aigle.png", "totems/baleine.png", "totems/blaireau.png", "totems/bouquetin.png", "totems/castor.png", "totems/cerf.png", "totems/chat.png", "totems/chauvesouris.png", "totems/cheval.png", "totems/colibri.png", "totems/colombe.png", "totems/coq.png", "totems/corbeau.png", "totems/cygne.png", "totems/dauphin.png", "totems/ecureuil.png", "totems/elephant.png", "totems/faucon.png", "totems/grenouille.png", "totems/herisson.png", "totems/heron.png", "totems/hibou.png", "totems/libellule.png", "totems/lion.png", "totems/loup.png", "totems/loutre.png", "totems/lynx.png", "totems/ours.png", "totems/panthere.png", "totems/papillon.png", "totems/phoque.png", "totems/pieuvre.png", "totems/renard.png", "totems/salamandre.png", "totems/sanglier.png", "totems/saumon.png", "totems/serpent.png", "totems/tigre.png", "totems/tortue.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONTS).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com'){
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      const net = fetch(req).then(r => { c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate'){
    e.respondWith(fetch(req).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req).then(r => {
    if (r.ok){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return r;
  })));
});
