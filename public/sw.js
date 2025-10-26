const CACHE_NAME = 'sua-balanca-no-azul-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

const STATIC_ASSETS = ['/', '/offline', '/favicon.ico']

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.error('[Service Worker] Failed to cache assets:', err)
      })
    }),
  )

  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE)
          .map(cacheName => caches.delete(cacheName)),
      )
    }),
  )

  return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other protocols
  if (!request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request)
        .then(response => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          const responseToCache = response.clone()

          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline')
          }
        })
    }),
  )
})
