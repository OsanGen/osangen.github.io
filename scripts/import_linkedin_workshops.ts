import fs from 'node:fs/promises';
import path from 'node:path';

type RawWorkshop = {
  id?: string;
  date?: string;
  title?: string;
  description?: string;
  replayUrl?: string;
  slidesUrl?: string;
  tags?: string | string[];
};

const projectRoot = process.cwd();
const inputJson = path.join(projectRoot, 'private', 'linkedin', 'workshops.json');
const inputCsv = path.join(projectRoot, 'private', 'linkedin', 'workshops.csv');
const out = path.join(projectRoot, 'src', 'content', 'data', 'workshops.json');

const normalizeHeader = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

const normalizeLine = (value: string) => value.trim();

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

const normalizeList = (value: string | string[] | undefined): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => item.trim()).filter(Boolean);

  return value
    .split(/[;,]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const truncate = (value: string | undefined) => {
  if (!value) {
    return '';
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

  return `workshop-${(hash >>> 0).toString(16)}`;
}

const parseRows = async (file: string): Promise<RawWorkshop[]> => {
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
          description: row.description,
          replayUrl: row.replayurl || row.replay || row.url,
          slidesUrl: row.slidesurl || row.slides,
          tags: row.tags,
        } as RawWorkshop;
      });
  } catch {
    return [];
  }
};

async function readExisting(): Promise<RawWorkshop[]> {
  try {
    const raw = await fs.readFile(out, 'utf8');
    return JSON.parse(raw) as RawWorkshop[];
  } catch {
    return [];
  }
}

const readInput = async (): Promise<RawWorkshop[]> => {
  const fromCsv = await parseRows(inputCsv);
  if (fromCsv.length) {
    return fromCsv;
  }

  try {
    const raw = await fs.readFile(inputJson, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RawWorkshop[]) : parsed.workshops || [];
  } catch {
    return [];
  }
};

const makeId = (id: string | undefined, row: RawWorkshop) => {
  if ((id || '').trim()) {
    return id!.trim();
  }

  const fallbackSeed = `${row.title || ''}|${row.replayUrl || ''}|${row.slidesUrl || ''}`;
  return stableHash(fallbackSeed);
};

const incoming = await readInput();
const existing = await readExisting();
const seen = new Set(existing.map((item: RawWorkshop) => (item.replayUrl || item.slidesUrl || item.id || '').trim().toLowerCase()));
const merged = [...existing];

for (const row of incoming) {
  const replay = normalizeLine(row.replayUrl || '');
  const slides = normalizeLine(row.slidesUrl || '');
  const key = (replay || slides || '').toLowerCase();
  if (!key || seen.has(key)) {
    continue;
  }

  const title = normalizeLine(row.title || '').trim();
  const normalized: RawWorkshop = {
    id: makeId(row.id, row),
    date: row.date?.trim() || new Date().toISOString().slice(0, 10),
    title: title || 'Untitled workshop',
    description: truncate(normalizeLine(row.description || '')),
    replayUrl: replay,
    slidesUrl: slides,
    tags: normalizeList(row.tags),
  };

  merged.push(normalized);
  seen.add(key);
}

await fs.mkdir(path.dirname(out), { recursive: true });
await fs.writeFile(out, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Imported ${merged.length - existing.length} workshop records. Total: ${merged.length}`);
