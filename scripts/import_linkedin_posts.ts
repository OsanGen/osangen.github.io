import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const inputJson = path.join(projectRoot, 'private', 'linkedin', 'posts.json');
const inputCsv = path.join(projectRoot, 'private', 'linkedin', 'posts.csv');
const out = path.join(projectRoot, 'src', 'content', 'data', 'posts.json');

type RawPost = {
  id?: string;
  date?: string;
  title?: string;
  summary?: string;
  url?: string;
  tags?: string | string[];
  proofLinks?: string | string[];
};

function splitCsv(line: string): string[] {
  const out: string[] = [];
  let value = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i++;
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
  return out.map((item) => item.trim());
}

const coalesceShort = (value: string | undefined, fallback = '') => {
  if (!value) return fallback;
  return value.length > 240 ? value.slice(0, 237) + '...' : value;
};

async function loadExisting(): Promise<RawPost[]> {
  try {
    const current = await fs.readFile(out, 'utf8');
    return JSON.parse(current) as RawPost[];
  } catch {
    return [];
  }
}

function normalizeList(value: string | string[] | undefined): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

async function readInput(): Promise<RawPost[]> {
  try {
    const csv = await fs.readFile(inputCsv, 'utf8');
    const lines = csv.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return [];
    const headers = splitCsv(lines[0]).map((h) => h.toLowerCase());
    return lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line) => {
        const values = splitCsv(line);
        const row: Record<string, string> = {};
        headers.forEach((header, i) => {
          row[header] = values[i] ?? '';
        });
        return {
          id: row.id || row['id'] || row['link'] || '',
          date: row.date || '',
          title: row.title || '',
          summary: row.summary || row.description || '',
          url: row.url || row.link || '',
          tags: row.tags || '',
          proofLinks: row.prooflinks || row.proof_links || '',
        };
      });
  } catch {
    // continue to JSON input
  }

  try {
    const raw = await fs.readFile(inputJson, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RawPost[]) : parsed.posts || [];
  } catch {
    return [];
  }
}

function hash(s: string) {
  return s.trim().toLowerCase();
}

const entries = await readInput();
const existing = await loadExisting();
const existingUrlIndex = new Set(existing.map((row) => hash(row.url || '')));
const merged = [...existing];

for (const row of entries) {
  const url = row.url?.trim() || '';
  if (!url || existingUrlIndex.has(hash(url))) continue;
  const id = row.id?.trim() || `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const normalized = {
    id,
    date: row.date?.trim() || new Date().toISOString().slice(0, 10),
    title: row.title?.trim() || 'Untitled post',
    summary: coalesceShort(row.summary?.trim()),
    url,
    tags: normalizeList(row.tags),
    proofLinks: normalizeList(row.proofLinks),
  } as RawPost;
  merged.push(normalized);
  existingUrlIndex.add(hash(url));
}

await fs.mkdir(path.dirname(out), { recursive: true });
await fs.writeFile(out, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Imported ${merged.length - existing.length} post records. Total: ${merged.length}`);
