#!/usr/bin/env python3
"""Assemble Madame Voyance : index.html (aperçu artifact) et docs/ (site publié par GitHub Pages)."""
import os, json, shutil, zipfile, hashlib
ROOT = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(ROOT, *a)
read = lambda f: open(P(f), encoding='utf-8').read()

BODY = """<div class="nebula" aria-hidden="true"></div>
<canvas id="sky" aria-hidden="true"></canvas>
<main class="wrap" id="app" hidden></main>
<nav class="nav" id="nav" aria-label="Navigation" hidden></nav>
<div class="overlay onboard" id="onboard" hidden><div class="wrap" id="onboard-in"></div></div>
<div id="sheet-root"></div>
<div id="toast-root" aria-live="polite"></div>
<canvas id="fx" aria-hidden="true"></canvas>
<script>
""" + read('src/data.js') + read('src/app.js') + "</script>\n"
head = read('src/head.html')

# 1. Version artifact (le squelette est ajouté à la publication)
open(P('index.html'), 'w', encoding='utf-8').write(head + BODY)

# 2. Version site installable
dist = P('docs'); shutil.rmtree(dist, ignore_errors=True)
shutil.copytree(P('cards'), os.path.join(dist, 'cards'))
shutil.copytree(P('icons'), os.path.join(dist, 'icons'))
open(os.path.join(dist, '.nojekyll'), 'w').close()  # GitHub Pages : servir les fichiers tels quels
page = ('<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        '<meta name="description" content="Votre voyance du jour : tarot, horoscope, lune, runes et numérologie.">\n'
        '<link rel="manifest" href="manifest.webmanifest">\n'
        '<style>html{padding-top:env(safe-area-inset-top,0px)}</style>\n'
        + head + '</head>\n<body>\n' + BODY + '</body>\n</html>\n')
page = page.replace("  link('manifest', 'manifest.webmanifest');\n", "")
open(os.path.join(dist, 'index.html'), 'w', encoding='utf-8').write(page)

manifest = {
  "name": "Madame Voyance", "short_name": "Mme Voyance",
  "description": "Votre voyance du jour : tarot, horoscope, lune, runes et numérologie.",
  "lang": "fr", "start_url": "./index.html#accueil", "scope": "./", "id": "./",
  "display": "standalone", "orientation": "portrait",
  "background_color": "#0a0616", "theme_color": "#0a0616",
  "categories": ["lifestyle", "entertainment"],
  "icons": [
    {"src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
    {"src": "icons/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable"}
  ]
}
open(os.path.join(dist, 'manifest.webmanifest'), 'w', encoding='utf-8').write(json.dumps(manifest, ensure_ascii=False, indent=2))

files = ['./', 'index.html', 'manifest.webmanifest'] + ['icons/' + f for f in sorted(os.listdir(P('icons')))] + ['cards/' + f for f in sorted(os.listdir(P('cards')))]
version = hashlib.sha1(page.encode()).hexdigest()[:8]
sw = """/* Madame Voyance : fonctionnement hors ligne */
const CACHE = 'mv-%s';
const FONTS = 'mv-fonts';
const FILES = %s;
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
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => hit || fetch(req)));
});
""" % (version, json.dumps(files))
open(os.path.join(dist, 'sw.js'), 'w', encoding='utf-8').write(sw)

open(os.path.join(dist, 'LISEZMOI.txt'), 'w', encoding='utf-8').write("""MADAME VOYANCE : site installable

Mise en ligne
  Déposez tout le contenu de ce dossier sur n'importe quel hébergement statique en HTTPS
  (Netlify Drop, GitHub Pages, Vercel, Cloudflare Pages, OVH...). Aucun serveur n'est nécessaire.
  Netlify Drop est le plus rapide : app.netlify.com/drop, puis glissez le dossier.

Installation sur téléphone
  iPhone : ouvrir le site dans Safari > Partager > « Sur l'écran d'accueil ».
  Android : Chrome propose « Installer l'application » (ou menu ⋮ > Installer).
  L'app s'ouvre ensuite en plein écran et fonctionne hors ligne.

Personnalisation
  cards/  : illustrations des cartes (gardez les noms : m00 à m21, puis w/c/s/p 01 à 14).
  icons/  : icône de l'app (192, 512, version « maskable » pour Android, 180 pour iPhone).
  Après une modification, les téléphones reçoivent la nouvelle version à la visite suivante.
""")

zpath = P('madame-voyance-site.zip')
with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED) as z:
    for base, _, fs in os.walk(dist):
        for f in fs:
            full = os.path.join(base, f)
            z.write(full, os.path.join('madame-voyance', os.path.relpath(full, dist)))
print('ok', version, os.path.getsize(zpath)//1024, 'KB')
