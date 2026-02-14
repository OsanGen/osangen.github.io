import fs from 'node:fs/promises';
import path from 'node:path';

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

const toAbsolute = (route) => `${BASE_URL}${route}`;

const readJson = async (filename) => {
  try {
    const raw = await fs.readFile(path.join(CONTENT_ROOT, filename), 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const unique = (items) => {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item)) {
      return false;
    }

    seen.add(item);
    return true;
  });
};

const escapeXml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const generateSitemap = async () => {
  const [gpts, games, workshops] = await Promise.all([
    readJson('gpts.json'),
    readJson('games.json'),
    readJson('workshops.json'),
  ]);

  const dynamicGpts = gpts
    .map((gpt) => gpt?.id)
    .filter((id) => typeof id === 'string' && id.trim().length > 0)
    .map((id) => `/gpts/${encodeURIComponent(id)}`);

  const dynamicGames = games
    .map((game) => game?.id)
    .filter((id) => typeof id === 'string' && id.trim().length > 0)
    .map((id) => `/labs/${encodeURIComponent(id)}`);

  const dynamicWorkshops = workshops
    .map((workshop) => workshop?.id)
    .filter((id) => typeof id === 'string' && id.trim().length > 0)
    .map((id) => `/workshops/${encodeURIComponent(id)}`);

  const paths = unique([
    ...STATIC_ROUTES,
    ...dynamicGpts,
    ...dynamicGames,
    ...dynamicWorkshops,
  ]).sort((a, b) =>
    a.localeCompare(b),
  );

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const route of paths) {
    lines.push(`  <url><loc>${escapeXml(toAbsolute(route))}</loc></url>`);
  }

  lines.push('</urlset>');

  await fs.writeFile(PUBLIC_SITEMAP_PATH, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Generated sitemap with ${paths.length} routes.`);
};

generateSitemap().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
