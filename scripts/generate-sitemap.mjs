import fs from 'node:fs/promises';
import path from 'node:path';
import { isCoreWorkshopId } from '../src/lib/workshop-catalog.ts';

const BASE_URL = 'https://osangen.github.io';

const PUBLIC_SITEMAP_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');
const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content', 'data');

const STATIC_ROUTES = [
  '/',
  '/labs',
  '/gpts',
  '/resume',
  '/more',
  '/workshops',
  '/posts',
  '/join',
  '/book',
  '/about',
  '/docs',
  '/code-of-conduct',
];

const normalizeRoute = (prefix, id) => {
  if (typeof id !== 'string') {
    return null;
  }

  const raw = id.trim();
  if (!raw) {
    return null;
  }

  const encoded = encodeURIComponent(raw);
  return `${prefix}${encoded}`;
};

const readJson = async (filename) => {
  try {
    const raw = await fs.readFile(path.join(CONTENT_ROOT, filename), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const toAbsolute = (route) => `${BASE_URL}${route}`;

const dedupeSorted = (items) => {
  const sorted = [...items].sort((a, b) => a.localeCompare(b));
  return Array.from(new Set(sorted));
};

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');

const generateSitemap = async () => {
  const [gpts, games, workshops] = await Promise.all([
    readJson('gpts.json'),
    readJson('games.json'),
    readJson('workshops.json'),
  ]);

  const dynamic = [
    ...gpts.flatMap((item) => {
      const route = normalizeRoute('/gpts/', item?.id);
      return route ? [route] : [];
    }),
    ...games.flatMap((item) => {
      const route = normalizeRoute('/labs/', item?.id);
      return route ? [route] : [];
    }),
    ...workshops.flatMap((item) => {
      if (!isCoreWorkshopId(item?.id)) {
        return [];
      }

      const route = normalizeRoute('/workshops/', item?.id);
      return route ? [route] : [];
    }),
  ];

  const validRoutes = dedupeSorted([...STATIC_ROUTES, ...dynamic]);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  validRoutes.forEach((route) => {
    lines.push(`  <url><loc>${escapeXml(toAbsolute(route))}</loc></url>`);
  });

  lines.push('</urlset>');

  await fs.writeFile(PUBLIC_SITEMAP_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Generated sitemap with ${validRoutes.length} routes.`);
};

generateSitemap().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
