const CACHE_NAME = 'kidquest-v1';

// Install event - just activate immediately
self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - MINIMAL INTERVENTION
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // ONLY handle same-origin requests
  if (!url.startsWith(self.location.origin)) {
    return;
  }

  // Skip ALL Next.js internal requests
  if (url.includes('/_next/') || 
      url.includes('/__nextjs') || 
      url.includes('/webpack') ||
      url.includes('hot-update') ||
      url.includes('lasy-bridge') ||
      url.includes('.js') ||
      url.includes('.json') ||
      url.includes('/api/')) {
    return;
  }

  // For navigation requests, just pass through to network
  // NO caching, NO timeout, NO intervention
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // If network fails, return a basic offline page
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});
