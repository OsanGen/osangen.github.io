import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const inputJson = path.join(projectRoot, 'private', 'linkedin', 'workshops.json');
const inputCsv = path.join(projectRoot, 'private', 'linkedin', 'workshops.csv');
const out = path.join(projectRoot, 'src', 'content', 'data', 'workshops.json');

type RawWorkshop = {
  id?: string;
  date?: string;
  title?: string;
  description?: string;
  replayUrl?: string;
  slidesUrl?: string;
  tags?: string | string[];
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

const normalizeList = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

function truncate(value: string | undefined) {
  if (!value) return '';
  return value.length > 240 ? value.slice(0, 237) + '...' : value;
}

function short(s: string | undefined) {
  return (s || '').trim().slice(0, 80) || `workshop-${Date.now()}`;
}

async function readExisting(): Promise<RawWorkshop[]> {
  try {
    const raw = await fs.readFile(out, 'utf8');
    return JSON.parse(raw) as RawWorkshop[];
  } catch {
    return [];
  }
}

function hash(s: string) {
  return s.trim().toLowerCase();
}

async function readInput(): Promise<RawWorkshop[]> {
  try {
    const csv = await fs.readFile(inputCsv, 'utf8');
    const lines = csv.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return [];
    const headers = splitCsv(lines[0]).map((h) => h.toLowerCase());
    return lines.slice(1).map((line) => {
      const values = splitCsv(line);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? '';
      });
      return {
        id: row.id || row['title'] || '',
        date: row.date || '',
        title: row.title || '',
        description: row.description || row.summary || '',
        replayUrl: row.replayurl || row.replay || '',
        slidesUrl: row.slidesurl || row.slides || '',
        tags: row.tags || '',
      };
    });
  } catch {
    // continue
  }

  try {
    const raw = await fs.readFile(inputJson, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : parsed.workshops || [];
  } catch {
    return [];
  }
}

const incoming = await readInput();
const existing = await readExisting();
const seen = new Set(existing.map((item) => hash(item.replayUrl || item.slidesUrl || '')));
const merged = [...existing];

for (const row of incoming) {
  const replay = (row.replayUrl || '').trim();
  const slides = (row.slidesUrl || '').trim();
  const key = hash(replay || slides);
  if (!key || seen.has(key)) continue;
  const normalized = {
    id: short(row.id),
    date: row.date || new Date().toISOString().slice(0, 10),
    title: row.title || 'Untitled workshop',
    description: truncate(row.description),
    replayUrl: replay,
    slidesUrl: slides,
    tags: normalizeList(row.tags),
  } as RawWorkshop;
  merged.push(normalized);
  seen.add(key);
}

await fs.mkdir(path.dirname(out), { recursive: true });
await fs.writeFile(out, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Imported ${merged.length - existing.length} workshop records. Total: ${merged.length}`);
