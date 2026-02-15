import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST_ROOT = path.join(ROOT, 'dist');
const PUBLIC_ROOT = path.join(ROOT, 'public');
const CONTENT_ROOT = path.join(ROOT, 'src', 'content', 'data');

const CORE_WORKSHOP_IDS = new Set([
  'leanagents-workshop-chatgpt-apps',
  'manus-workshop',
]);

const normalizePathname = (pathname) => {
  if (!pathname) {
    return '/';
  }

  const trimmed = pathname.trim();
  if (!trimmed) {
    return '/';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
};

const uniqueSorted = (items) => [...new Set(items)].sort((left, right) => left.localeCompare(right));

const fileExists = async (filepath) => {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
};

const routeToDistCandidates = (pathname) => {
  const normalized = normalizePathname(pathname);
  if (normalized === '/') {
    return [path.join(DIST_ROOT, 'index.html')];
  }

  const clean = normalized.replace(/^\/+/, '');
  return [
    path.join(DIST_ROOT, clean),
    path.join(DIST_ROOT, clean, 'index.html'),
  ];
};

const publicCandidates = (pathname) => {
  const normalized = normalizePathname(pathname).replace(/^\/+/, '');
  return [path.join(PUBLIC_ROOT, normalized)];
};

const pathExistsInOutput = async (pathname) => {
  const candidates = [...routeToDistCandidates(pathname), ...publicCandidates(pathname)];
  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return true;
    }
  }
  return false;
};

const readJsonArray = async (filename) => {
  const raw = await fs.readFile(path.join(CONTENT_ROOT, filename), 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

const collectHtmlFiles = async (directory) => {
  const results = [];
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const filepath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectHtmlFiles(filepath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(filepath);
    }
  }
  return results;
};

const parseSitemapPaths = async () => {
  const xml = await fs.readFile(path.join(PUBLIC_ROOT, 'sitemap.xml'), 'utf8');
  return uniqueSorted(
    [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => {
      const value = match[1]?.trim() || '';
      return normalizePathname(new URL(value).pathname);
    }),
  );
};

const parseInternalHrefs = (html) =>
  uniqueSorted(
    [...html.matchAll(/href="([^"]+)"/g)]
      .map((match) => match[1] || '')
      .map((href) => href.split('#')[0]?.split('?')[0] || '')
      .map((href) => href.trim())
      .filter((href) => href.startsWith('/') && !href.startsWith('//'))
      .map((href) => normalizePathname(href)),
  );

const checkSitemapRoutes = async () => {
  const issues = [];
  const sitemapPaths = await parseSitemapPaths();

  for (const pathname of sitemapPaths) {
    if (!(await pathExistsInOutput(pathname))) {
      issues.push(`sitemap route missing in output: ${pathname}`);
    }
  }

  return issues;
};

const checkInternalLinks = async () => {
  const issues = [];
  const htmlFiles = await collectHtmlFiles(DIST_ROOT);

  for (const htmlFile of htmlFiles) {
    const html = await fs.readFile(htmlFile, 'utf8');
    const hrefs = parseInternalHrefs(html);
    const source = `/${path.relative(DIST_ROOT, htmlFile).replace(/index\.html$/, '').replace(/\\/g, '/')}`;

    for (const href of hrefs) {
      if (!(await pathExistsInOutput(href))) {
        issues.push(`broken internal href from ${source || '/'} -> ${href}`);
      }
    }
  }

  return issues;
};

const checkDynamicRoutes = async () => {
  const issues = [];
  const [gpts, games, workshops] = await Promise.all([
    readJsonArray('gpts.json'),
    readJsonArray('games.json'),
    readJsonArray('workshops.json'),
  ]);

  const expectedRoutes = [
    ...gpts.map((item) => `/gpts/${item?.id || ''}`),
    ...games.map((item) => `/labs/${item?.id || ''}`),
    ...workshops
      .filter((item) => CORE_WORKSHOP_IDS.has((item?.id || '').trim().toLowerCase()))
      .map((item) => `/workshops/${item?.id || ''}`),
  ]
    .map((pathname) => normalizePathname(pathname))
    .filter((pathname) => pathname.split('/').every((part, index) => index === 0 || part.length > 0));

  for (const pathname of uniqueSorted(expectedRoutes)) {
    if (!(await pathExistsInOutput(pathname))) {
      issues.push(`expected dynamic route missing: ${pathname}`);
    }
  }

  return issues;
};

const main = async () => {
  const checks = await Promise.all([
    checkSitemapRoutes(),
    checkInternalLinks(),
    checkDynamicRoutes(),
  ]);

  const issues = checks.flat();

  if (issues.length > 0) {
    console.error('Dist integrity check failed:');
    issues.forEach((issue) => console.error(` - ${issue}`));
    process.exit(1);
  }

  console.log('Dist integrity check passed.');
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
