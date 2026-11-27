// SFM web app service worker. Build 7e2f2327d194.
const CACHE = "sfm-7e2f2327d194";
const BASE = "/s-drl06m8dsr8buk/";
const FILES = ["/s-drl06m8dsr8buk/","/s-drl06m8dsr8buk/app.js","/s-drl06m8dsr8buk/icon-180.png","/s-drl06m8dsr8buk/icon-192.png","/s-drl06m8dsr8buk/icon-512.png","/s-drl06m8dsr8buk/manifest.webmanifest","/s-drl06m8dsr8buk/sqlite.wasm","/s-drl06m8dsr8buk/worker.js"];
const isolate = (response) => {
  if (!response || response.status === 0 || response.type === "opaque") return response;
  const headers = new Headers(response.headers);
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES.map((u) => new Request(u, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith("sfm-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const key = request.mode === "navigate" ? BASE : url.pathname;
    const hit = await cache.match(key);
    if (hit) return isolate(hit);
    try { return isolate(await fetch(request)); }
    catch (error) { const shell = await cache.match(BASE); if (shell && request.mode === "navigate") return isolate(shell); throw error; }
  })());
});
