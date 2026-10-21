/* ctmTIME : fonctionnement hors ligne.
   La page est d'abord demandée au réseau (pour recevoir les mises à jour),
   puis à la copie gardée sur l'appareil si Internet ne répond pas.
   Changer VERSION à chaque mise en ligne. */
const VERSION = 'ctmtime-12';
const FICHIERS = ['./', './index.html', './manifest.webmanifest', './joliette/', './mv/',
  './icones/icon-192.png', './icones/icon-512.png', './icones/icon-maskable-512.png', './icones/apple-touch-icon.png', './icones/favicon-32.png'];

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
  // La page elle-même : toujours revérifiée auprès du serveur (pas de vieille copie du navigateur)
  const reseau = req.mode === 'navigate' ? fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(req);
  e.respondWith(
    reseau
      .then(rep => {
        const copie = rep.clone();
        caches.open(VERSION).then(c => c.put(req, copie));
        return rep;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
