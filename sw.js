self.addEventListener("install", (event) => {
    console.log("✅ Service Worker installiert.");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("✅ Service Worker aktiviert.");
});

self.addEventListener("fetch", (event) => {
    console.log("Service Worker fängt Anfrage ab:", event.request.url);
});
