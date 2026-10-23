// Retired service worker.
// The old Flutter web build registered a service worker that cached the site's
// pages (including index.html). This replacement clears those caches and
// unregisters itself so visitors always get the current site from the network.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: "window" });
    clients.forEach((client) => {
      // Reload open pages so they pick up fresh content (skip the Flutter app
      // page, which would just register this worker again).
      if (!client.url.includes("flutter_app.html")) client.navigate(client.url);
    });
  })());
});
