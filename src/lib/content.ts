import fs from 'node:fs/promises';
import path from 'node:path';
import {
  isCanonicalLink,
  isUnavailableLink,
} from './link-utils';
import {
  CommunitySchema,
  GameSchema,
  GPTSchema,
  ModuleSchema,
  type Workshop,
  PostSchema,
  ProfileSchema,
  BookingSchema,
  WorkshopSchema,
  type GPT,
} from './schemas';
import { z } from 'zod';

const contentRoot = path.join(process.cwd(), 'src', 'content', 'data');
const cache = new Map<string, Promise<unknown>>();

function loadJsonCached<T>(filename: string, schema: z.ZodSchema<T>): Promise<T> {
  const existing = cache.get(filename);
  if (existing) {
    return existing as Promise<T>;
  }

  const loaded = loadJson<T>(filename, schema);
  cache.set(filename, loaded);
  loaded.catch(() => {
    cache.delete(filename);
  });

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
  const invalidListingLinks = gpts.filter((gpt: GPT) => !isCanonicalLink(gpt.link));

  if (invalidListingLinks.length > 0) {
    const ids = invalidListingLinks.map((gpt: GPT) => gpt.id).join(', ');
    throw new Error(`Invalid GPT listing link for: ${ids}. Use /internal-path or https:// URL.`);
  }

  const hasPlaceholderLink = gpts.some((gpt: GPT) => {
    const allLinks = [gpt.links.use, gpt.links.promptPack, gpt.links.demo];
    return allLinks.some((value) => isUnavailableLink(value));
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

export const getWorkshopById = async (id: string): Promise<Workshop | null> => {
  const workshops = await loadWorkshops();
  return workshops.find((workshop) => workshop.id === id) ?? null;
};
