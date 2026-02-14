import fs from 'node:fs/promises';
import path from 'node:path';

type RawPost = {
  id?: string;
  date?: string;
  title?: string;
  summary?: string;
  url?: string;
  tags?: string | string[];
  proofLinks?: string | string[];
};

const projectRoot = process.cwd();
const inputJson = path.join(projectRoot, 'private', 'linkedin', 'posts.json');
const inputCsv = path.join(projectRoot, 'private', 'linkedin', 'posts.csv');
const out = path.join(projectRoot, 'src', 'content', 'data', 'posts.json');

const normalizeHeader = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

const normalizeLine = (line: string) => line.trim();

const splitCsvLine = (line: string): string[] => {
  const out: string[] = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      out.push(value);
      value = '';
    } else {
      value += ch;
    }
  }

  out.push(value);
  return out.map(normalizeLine);
};

const coalesceShort = (value: string | undefined, fallback = '') => {
  if (!value) {
    return fallback;
  }

  return value.length > 240 ? `${value.slice(0, 237)}...` : value;
};

function stableHash(value: string): string {
  let hash = 2166136261;
  const text = value.trim().toLowerCase();

  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const normalized = (hash >>> 0).toString(16);
  return `post-${normalized}`;
}

const normalizeList = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);

  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const parseRows = async (file: string): Promise<RawPost[]> => {
  try {
    const raw = await fs.readFile(file, 'utf8');
    const lines = raw
      .split(/\r?\n/)
      .map((line) => normalizeLine(line))
      .filter(Boolean);

    if (!lines.length) {
      return [];
    }

    const headers = splitCsvLine(lines[0]).map(normalizeHeader);
    return lines
      .slice(1)
      .filter((line) => line.length > 0)
      .map((line) => {
        const values = splitCsvLine(line);
        const row: Record<string, string> = {};

        headers.forEach((header, index) => {
          row[header] = values[index] ?? '';
        });

        return {
          id: row.id,
          date: row.date,
          title: row.title,
          summary: row.summary,
          url: row.url || row.link,
          tags: row.tags,
          proofLinks: row.prooflinks || row.proofofwork || row.prooflinksurl || row.proof,
        } as RawPost;
      });
  } catch {
    return [];
  }
};

async function loadExisting(): Promise<RawPost[]> {
  try {
    const current = await fs.readFile(out, 'utf8');
    return JSON.parse(current) as RawPost[];
  } catch {
    return [];
  }
}

const loadInput = async (): Promise<RawPost[]> => {
  const fromCsv = await parseRows(inputCsv);
  if (fromCsv.length) {
    return fromCsv;
  }

  try {
    const raw = await fs.readFile(inputJson, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RawPost[]) : parsed.posts || [];
  } catch {
    return [];
  }
};

const existingIndex = async () => {
  const existing = await loadExisting();
  return {
    posts: existing,
    keys: new Set(existing.map((row: RawPost) => (row.url || '').trim().toLowerCase())),
  };
};

const makeId = (id: string | undefined, row: RawPost): string => {
  const trimmed = (id || '').trim();
  if (trimmed) {
    return trimmed;
  }

  const fallbackSeed = `${row.title || ''}|${row.url || ''}|${row.date || ''}`;
  const generated = stableHash(fallbackSeed);
  return generated || `post-${Date.now()}`;
};

const incoming = await loadInput();
const { posts: existing, keys } = await existingIndex();
const merged = [...existing];

for (const row of incoming) {
  const url = normalizeLine(row.url || '');
  const key = url.toLowerCase();
  if (!url || keys.has(key)) {
    continue;
  }

  const normalized: RawPost = {
    id: makeId(row.id, row),
    date: row.date?.trim() || new Date().toISOString().slice(0, 10),
    title: row.title?.trim() || 'Untitled post',
    summary: coalesceShort(row.summary?.trim()),
    url,
    tags: normalizeList(row.tags),
    proofLinks: normalizeList(row.proofLinks),
  };

  merged.push(normalized);
  keys.add(key);
}

await fs.mkdir(path.dirname(out), { recursive: true });
await fs.writeFile(out, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Imported ${merged.length - existing.length} post records. Total: ${merged.length}`);
