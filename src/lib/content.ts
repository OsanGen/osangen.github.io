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
} from './schemas';
import { z } from 'zod';

const contentRoot = path.join(process.cwd(), 'src', 'content', 'data');

async function loadJson<T>(filename: string, schema: z.ZodSchema<T>): Promise<T> {
  const file = await fs.readFile(path.join(contentRoot, filename), 'utf8');
  const raw = JSON.parse(file);
  return schema.parse(raw);
}

export const loadProfile = () => loadJson('profile.json', ProfileSchema);
export const loadGames = () => loadJson('games.json', z.array(GameSchema));
export const loadModules = () => loadJson('modules.json', z.array(ModuleSchema));
export const loadCommunities = () => loadJson('communities.json', z.array(CommunitySchema));
export const loadBooking = () => loadJson('booking.json', BookingSchema);
export const loadWorkshops = () => loadJson('workshops.json', z.array(WorkshopSchema));
export const loadPosts = () => loadJson('posts.json', z.array(PostSchema));
export const loadGPTs = () => loadJson('gpts.json', z.array(GPTSchema));

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
