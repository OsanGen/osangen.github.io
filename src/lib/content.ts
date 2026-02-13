import fs from 'node:fs/promises';
import path from 'node:path';
import {
  CommunitySchema,
  GameSchema,
  GPTSchema,
  ModuleSchema,
  PostSchema,
  ProfileSchema,
  BookingSchema,
  WorkshopSchema,
  type GPT,
} from './schemas';
import { z } from 'zod';

const contentRoot = path.join(process.cwd(), 'src', 'content', 'data');
const cache = new Map<string, Promise<unknown>>();
const LINK_PLACEHOLDER_PATTERN = /\b(?:placeholder|todo|xxxxx|temp)\b/i;

export const isUnavailableLink = (value = '') => {
  const normalized = value.trim().toLowerCase();
  return !normalized || LINK_PLACEHOLDER_PATTERN.test(normalized);
};

function loadJsonCached<T>(filename: string, schema: z.ZodSchema<T>): Promise<T> {
  const existing = cache.get(filename);
  if (existing) {
    return existing as Promise<T>;
  }

  const loaded = loadJson<T>(filename, schema);
  cache.set(filename, loaded);
  return loaded;
}

async function loadJson<T>(filename: string, schema: z.ZodSchema<T>): Promise<T> {
  const file = await fs.readFile(path.join(contentRoot, filename), 'utf8');
  const raw = JSON.parse(file);
  return schema.parse(raw);
}

export const loadProfile = () => loadJsonCached('profile.json', ProfileSchema);
export const loadGames = () => loadJsonCached('games.json', z.array(GameSchema));
export const loadModules = () => loadJsonCached('modules.json', z.array(ModuleSchema));
export const loadCommunities = () => loadJsonCached('communities.json', z.array(CommunitySchema));
export const loadBooking = () => loadJsonCached('booking.json', BookingSchema);
export const loadWorkshops = () => loadJsonCached('workshops.json', z.array(WorkshopSchema));
export const loadPosts = () => loadJsonCached('posts.json', z.array(PostSchema));
export const loadGPTs = async () => {
  const gpts = await loadJsonCached('gpts.json', z.array(GPTSchema));
  const hasPlaceholderLink = gpts.some((gpt: GPT) => {
    const allLinks = [gpt.links.use, gpt.links.promptPack, gpt.links.demo];
    return allLinks.some(isUnavailableLink);
  });

  if (hasPlaceholderLink) {
    console.warn('GPT links contain placeholders; unavailable CTAs will be shown.');
  }

  return gpts;
};

export async function loadSiteContent() {
  const [profile, games, modules, communities, booking, workshops, posts, gpts] = await Promise.all([
    loadProfile(),
    loadGames(),
    loadModules(),
    loadCommunities(),
    loadBooking(),
    loadWorkshops(),
    loadPosts(),
    loadGPTs(),
  ]);

  return {
    profile,
    games,
    modules,
    communities,
    booking,
    workshops,
    posts,
    gpts,
  };
}

export const loadLastModifiedISO = async (filename: string): Promise<string | null> => {
  try {
    const file = await fs.stat(path.join(contentRoot, filename));
    return file.mtime.toISOString();
  } catch {
    return null;
  }
};
