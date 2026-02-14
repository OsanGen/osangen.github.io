const VERSION = 'v1-2026-02-14';
const CORE_CACHE = `osan-core-${VERSION}`;
const ASSET_CACHE = `osan-assets-${VERSION}`;
const DOC_CACHE = `osan-documents-${VERSION}`;

const CORE_ROUTES = [
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

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CORE_CACHE);
      await Promise.all(
        CORE_ROUTES.map((route) =>
          cache.add(new Request(route, { cache: 'reload' })).catch(() => {
            // Ignore 404s or transient fetch failures for pre-cache steps.
          }),
        ),
      );
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => [CORE_CACHE, ASSET_CACHE, DOC_CACHE].indexOf(key) === -1)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

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

    return cache.match('/') || new Response('Offline', { status: 503, statusText: 'Offline' });
  }
};

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
    event.respondWith(networkFirst(request, DOC_CACHE));
    return;
  }

  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }
});
