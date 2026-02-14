const VERSION = 'v1-2026-02-14';
const CORE_CACHE = `osan-core-${VERSION}`;
const ASSET_CACHE = `osan-assets-${VERSION}`;
const DOC_CACHE = `osan-documents-${VERSION}`;

const STATIC_APP_ROUTES = [
  '/',
  '/index.html',
  '/about',
  '/labs',
  '/gpts',
  '/workshops',
  '/join',
  '/resume',
  '/more',
  '/posts',
  '/docs',
  '/code-of-conduct',
  '/book',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest',
];

const NAV_FALLBACKS = ['/', '/index.html'];

const sortRoutes = (routes) => [...new Set(routes)].sort((left, right) => left.localeCompare(right));
const CORE_ROUTES = sortRoutes(STATIC_APP_ROUTES);

const isStaticAsset = (request) => {
  const destination = request.destination;
  const path = new URL(request.url).pathname;

  return (
    destination === 'script' ||
    destination === 'style' ||
    destination === 'image' ||
    destination === 'font' ||
    destination === 'manifest' ||
    /\.(css|js|svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|ttf|otf|json|xml|txt)$/.test(path) ||
    path.startsWith('/_astro/') ||
    path.startsWith('/icons/')
  );
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response && response.ok) {
    await cache.put(request, response.clone());
  }

  return response;
};

const networkFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }

    throw error;
  }
};

const buildFallbackDocument = async (cacheName) => {
  const cache = await caches.open(cacheName);

  for (const fallback of NAV_FALLBACKS) {
    const response = await cache.match(fallback);
    if (response) {
      return response;
    }
  }

  return null;
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CORE_CACHE);
      await Promise.all(
        CORE_ROUTES.map((route) =>
          cache.add(new Request(route, { cache: 'reload' })).catch((error) => {
            console.warn('Service worker pre-cache failed for route', route, error);
          })
        )
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => [CORE_CACHE, ASSET_CACHE, DOC_CACHE].indexOf(key) === -1)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return await networkFirst(request, DOC_CACHE);
        } catch (error) {
          const fallback = await buildFallbackDocument(DOC_CACHE);
          if (fallback) {
            return fallback;
          }

          return new Response('Offline', {
            status: 503,
            statusText: 'Offline',
          });
        }
      })()
    );
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }
});
