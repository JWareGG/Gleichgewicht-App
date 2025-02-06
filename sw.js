const CACHE_NAME = "erinnerungs-app-v1";
const CACHE_FILES = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/manifest.json",
    "/icon-192x192.png",
    "/icon-512x512.png",
    "/notification-sound.mp3"
];

// Installations-Event → Dateien in Cache speichern
self.addEventListener("install", (event) => {
    console.log("✅ Service Worker installiert.");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("📦 Dateien werden gecacht");
            return cache.addAll(CACHE_FILES);
        })
    );
    self.skipWaiting();
});

// Aktivierungs-Event → Alte Caches löschen
self.addEventListener("activate", (event) => {
    console.log("✅ Service Worker aktiviert.");
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch-Event → Daten aus dem Cache holen (Offline-Unterstützung)
self.addEventListener("fetch", (event) => {
    console.log("🔄 Service Worker fängt Anfrage ab:", event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});