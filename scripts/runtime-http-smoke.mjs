import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'src', 'content', 'data');
const HOST = process.env.SMOKE_HOST || '127.0.0.1';
const PORT = Number(process.env.SMOKE_PORT || '4322');
const BASE = `http://${HOST}:${PORT}`;
const START_TIMEOUT_MS = Number(process.env.SMOKE_START_TIMEOUT_MS || '20000');
const REQUEST_TIMEOUT_MS = Number(process.env.SMOKE_REQUEST_TIMEOUT_MS || '12000');
const CORE_WORKSHOP_IDS = new Set([
  'leanagents-workshop-chatgpt-apps',
  'manus-workshop',
]);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const readJsonArray = async (filename) => {
  const raw = await fs.readFile(path.join(CONTENT_ROOT, filename), 'utf8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

const withTimeout = async (promise, timeoutMs, label) => {
  let timerId = null;
  const timeout = new Promise((_, reject) => {
    timerId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
  }
};

const normalizeId = (value) => (typeof value === 'string' ? value.trim() : '');

const buildExpectedRoutes = async () => {
  const [gpts, games, workshops] = await Promise.all([
    readJsonArray('gpts.json'),
    readJsonArray('games.json'),
    readJsonArray('workshops.json'),
  ]);

  const firstGptId = normalizeId(gpts[0]?.id);
  const firstGameId = normalizeId(games[0]?.id);
  const workshopIds = workshops
    .map((item) => normalizeId(item?.id).toLowerCase())
    .filter((id) => CORE_WORKSHOP_IDS.has(id));

  const routes = [
    '/',
    '/join',
    '/workshops',
    '/labs',
    '/gpts',
    ...workshopIds.map((id) => `/workshops/${id}`),
    ...(firstGameId ? [`/labs/${firstGameId}`] : []),
    ...(firstGptId ? [`/gpts/${firstGptId}`] : []),
  ];

  return [...new Set(routes)];
};

const waitForServer = async () => {
  const deadline = Date.now() + START_TIMEOUT_MS;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE}/`, { redirect: 'follow' });
      if (response.ok) {
        return;
      }
    } catch {
      // Server not ready yet.
    }

    await sleep(250);
  }

  throw new Error(`Preview server did not become ready at ${BASE} within ${START_TIMEOUT_MS}ms`);
};

const runHttpSmoke = async (routes) => {
  const issues = [];

  for (const route of routes) {
    const url = `${BASE}${route}`;
    try {
      const response = await withTimeout(fetch(url, { redirect: 'follow' }), REQUEST_TIMEOUT_MS, `Request to ${route}`);
      if (response.status !== 200) {
        issues.push(`Expected 200 for ${route}, received ${response.status}`);
      }
    } catch (error) {
      issues.push(error instanceof Error ? error.message : String(error));
    }
  }

  return issues;
};

const stopChild = async (child) => {
  if (!child || child.exitCode !== null) {
    return;
  }

  child.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => child.once('close', resolve)),
    sleep(3000).then(() => {
      if (child.exitCode === null) {
        child.kill('SIGKILL');
      }
    }),
  ]);
};

const main = async () => {
  const routes = await buildExpectedRoutes();
  const preview = spawn('npm', ['run', 'preview', '--', '--host', HOST, '--port', String(PORT)], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stderr = '';
  preview.stderr.on('data', (chunk) => {
    stderr += String(chunk);
  });

  try {
    await waitForServer();
    const issues = await runHttpSmoke(routes);

    if (issues.length > 0) {
      console.error('Runtime HTTP smoke failed:');
      issues.forEach((issue) => console.error(` - ${issue}`));
      process.exit(1);
    }

    console.log(`Runtime HTTP smoke passed for ${routes.length} routes.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Runtime HTTP smoke failed: ${message}`);
    if (stderr.trim()) {
      console.error(stderr.trim());
    }
    process.exit(1);
  } finally {
    await stopChild(preview);
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
