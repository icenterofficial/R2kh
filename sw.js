const CACHE_NAME = 'tv-slideshow-v14';

// Media List: Add the static images here so they load instantly even if offline
const MEDIA_TO_CACHE = [
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgcKgLDhK0Sdm-q7MxZSTzisBxP9fp61fzpGABZm94ilVYIfVv9Qs6Dynem2b3us6VKOZY3q3Qlf9QkVMYt-K60mtmcmEGVTCBsakksNJb5O6d2HScBXHOs0LrfTmVmUuhpAcOJwqbfcmJB_HzbaqnIEbffeVNUcJzErSZIMyBFM0seRSsb_ayAewmoUF0/s1600/man.jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhLXakOnv_Sj0fsN7fFHwdLgEiEsWSlIX2RBwmEfD7AES954UqbYX0hr10mgdfiiYP12CMsPa5rtbLGwyp0Xb7N8yYTQilWMmhhmb_hkIaS7N7JL1VwrCQ4SHnx1zh3ouCs-628xYPoiaeTgS76cv-Ixsp7trfaNbjQCpdmnyr2Tck6__e9SQA8XyTTIvU/s1600/women.jpg"
];

// Core assets
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('Opened cache v14');
      await Promise.allSettled(ASSETS_TO_CACHE.map(url => cache.add(url)));
      
      // Cache the specific images
      if (MEDIA_TO_CACHE.length > 0) {
        const mediaPromises = MEDIA_TO_CACHE.map(url => {
          const request = new Request(url, { mode: 'no-cors' });
          return fetch(request)
            .then(response => cache.put(request, response))
            .catch(err => console.warn(`Could not cache media ${url}`, err));
        });
        await Promise.all(mediaPromises);
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  // Bypass cache for Range requests (videos)
  if (event.request.headers.has('range')) {
      return; 
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((networkResponse) => {
        // Only cache basic successful responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        return networkResponse;
      });
    })
  );
});