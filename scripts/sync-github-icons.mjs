import fs from 'node:fs/promises';
import path from 'node:path';

const getEnvBool = (name, fallback = false) => {
  const value = process.env[name];
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

const describeError = (error) => {
  if (error instanceof Error) {
    if (error.cause) {
      return `${error.message} | cause: ${String(error.cause).slice(0, 220)}`;
    }

    return error.message;
  }

  return String(error);
};

const manifestPath = process.env.ICON_SYNC_MANIFEST_PATH ?? path.resolve(process.cwd(), 'scripts/icon-sync.manifest.json');
const isEnabled = getEnvBool('ICON_SYNC_ENABLED', false) || getEnvBool('SYNC_GITHUB_ICONS', false);
if (!isEnabled) {
  console.log('ICON_SYNC_ENABLED is not true. Skipping icon sync.');
  process.exit(0);
}

const readManifest = async (filePath) => {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

const fetchRawContent = async ({ owner, name, ref, filePath, token }) => {
  const encoded = filePath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  const endpoint = `https://api.github.com/repos/${owner}/${name}/contents/${encoded}${ref ? `?ref=${encodeURIComponent(ref)}` : ''}`;
  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/vnd.github+json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'User-Agent': 'osan-site-icon-sync',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    const statusError = new Error(`GitHub API ${response.status} for ${owner}/${name}/${filePath}`);
    statusError.cause = detail;
    throw statusError;
  }

  const payload = await response.json();
  if (!payload?.content) {
    throw new Error(`No content found in API response for ${owner}/${name}/${filePath}`);
  }

  const content = Buffer.from(payload.content.replace(/\s+/g, ''), 'base64');
  return content;
};

const safeDirname = (target) => path.dirname(path.resolve(process.cwd(), target));

const main = async () => {
  const manifest = await readManifest(manifestPath);
  const repo = manifest.repo;
  const token = process.env.GITHUB_TOKEN;
  if (!repo?.owner || !repo?.name) {
    throw new Error('Manifest must define repo.owner and repo.name');
  }

  const files = Array.isArray(manifest.files) ? manifest.files : [];
  if (!files.length) {
    console.log('No files configured in icon sync manifest.');
    return;
  }

  let synced = 0;
  for (const file of files) {
    const sourcePath = file.sourcePath;
    const destPath = file.destPath;
    const required = getEnvBool('ICON_SYNC_REQUIRED_FAIL', false) || file.required === true;

    if (!sourcePath || !destPath) {
      if (required) {
        throw new Error(`Missing sourcePath/destPath in manifest entry: ${JSON.stringify(file)}`);
      }
      console.warn(`Skipping malformed icon entry: ${JSON.stringify(file)}`);
      continue;
    }

    try {
      const content = await fetchRawContent({
        owner: repo.owner,
        name: repo.name,
        ref: repo.ref,
        filePath: sourcePath,
        token,
      });
      const outPath = path.resolve(process.cwd(), destPath);
      await fs.mkdir(safeDirname(destPath), { recursive: true });
      await fs.writeFile(outPath, content);
      synced += 1;
      console.log(`Synced ${sourcePath} -> ${destPath}`);
    } catch (err) {
      if (required) {
        throw err;
      }
      console.warn(`Optional icon sync failed for ${sourcePath}: ${describeError(err)}`);
    }
  }

  console.log(`Sync complete. Synced ${synced}/${files.length} optional files.`);
};

main().catch((error) => {
  console.error(error?.message ?? error);
  process.exit(1);
});
