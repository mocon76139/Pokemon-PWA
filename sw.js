const CACHE_DATA = "offline-data";
const STATIC_RESOURCES = ["index.html", "app.js", "logo.png"];

// Install the Service Wworker
self.addEventListener("install", async (e) => {
  console.log("SW Installed");

  e.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_DATA);
      return await cache.addAll(STATIC_RESOURCES);
    })()
  );

  self.skipWaiting();
});

//  Listen for fetching request
self.addEventListener("fetch", async (e) => {
  console.log(`SW fetch: ${e.request.url}`);

  e.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_DATA);

      try {
        const networkReponse = await fetch(e.request);
        await cache.put(e.request, networkReponse.clone());
        return networkReponse;
      } catch (error) {
        const cachedResponse = await cache.match(e.request);
        return cachedResponse;
      }
    })()
  );
});
// Activate the SW event
self.addEventListener("activate", async (e) => {
  console.log("SW activate");
});
