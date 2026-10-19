/* ctmTIME : fonctionnement hors ligne.
   La page est d'abord demandée au réseau (pour recevoir les mises à jour),
   puis à la copie gardée sur l'appareil si Internet ne répond pas.
   Changer VERSION à chaque mise en ligne. */
const VERSION = 'gdt-1';
const FICHIERS = ['./', './index.html', './manifest.webmanifest',
  './icones/icon-192.png', './icones/icon-512.png', './icones/apple-touch-icon.png', './icones/favicon-32.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(cles => Promise.all(cles.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req)
      .then(rep => {
        const copie = rep.clone();
        caches.open(VERSION).then(c => c.put(req, copie));
        return rep;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
