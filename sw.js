const CACHE_NAME = "andini-birthday-v14";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/style.css?v=14",
  "./css/animations.css?v=14",
  "./css/responsive.css?v=14",
  "./js/data.js?v=14",
  "./js/storage.js?v=14",
  "./js/animations.js?v=14",
  "./js/rose.js?v=14",
  "./js/app.js?v=14",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/images/memory-01.jpeg",
  "./assets/images/memory-02.jpeg",
  "./assets/images/memory-03.jpeg",
  "./assets/images/memory-04.jpeg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== location.origin) return;

  const rangeHeader = event.request.headers.get("range");
  if (rangeHeader) return;

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./index.html")));
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    }))
  );
});
