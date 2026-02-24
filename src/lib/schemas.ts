import { z } from 'zod';

const trimOptionalString = z
  .string()
  .optional()
  .transform((value) => {
    if (value == null) {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  });

const normalizeProofLinks = (value: unknown): string[] | undefined => {
  if (value == null) {
    return undefined;
  }

  const splitIntoParts = (text: string) =>
    text
      .split(/[;,]/g)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

  if (Array.isArray(value)) {
    return value
      .flatMap((entry) => (typeof entry === 'string' ? [entry] : []))
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  }

  if (typeof value === 'string') {
    return splitIntoParts(value);
  }

  return undefined;
};

const proofLinksSchema = z.preprocess(
  (value: unknown): string[] | undefined => normalizeProofLinks(value),
  z.array(z.string()).optional(),
) as z.ZodType<string[] | undefined>;

export const ProofPackSchema = z.object({
  label: z.string(),
  proof: z.array(z.string()),
});

export const ExperienceEntrySchema = z.object({
  org: z.string(),
  role: z.string(),
  start: z.string(),
  end: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  highlights: z.array(z.string()),
});

export const EducationEntrySchema = z.object({
  org: z.string(),
  program: z.string(),
  start: z.string().nullable(),
  end: z.string().nullable(),
});

export const ProfileSchema = z.object({
  name: z.string(),
  location: z.string(),
  headline: z.string(),
  summary: z.array(z.string()),
  what_i_do: z.array(z.string()),
  how_i_work: z.array(z.string()),
  proof_selected: z.array(ProofPackSchema),
  experience: z.array(ExperienceEntrySchema),
  education: z.array(EducationEntrySchema),
  links: z.object({
    linkedin: z.string(),
    portfolio: z.string(),
    youtube: z.string(),
  }),
  skills: z.array(z.string()),
});

export const GameEmbedSchema = z.object({
  preferred: z.enum(['iframe', 'link']),
  aspectRatio: z.string(),
  fallback: z.string(),
});

export const GameSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  concepts: z.array(z.string()),
  learn: z.array(z.string()),
  deployUrl: z.string(),
  repoUrl: trimOptionalString,
  embed: GameEmbedSchema,
});
export type Game = z.infer<typeof GameSchema>;

export const VisualClassStepSchema = z.object({
  title: z.string(),
  body: z.string(),
  proofLink: z.string().optional(),
  nextAction: z.string(),
});

export const VisualClassSchema = z.object({
  title: z.string(),
  steps: z.array(VisualClassStepSchema).min(5).max(7),
});

export const ModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  lessonTitle: z.string().optional(),
  lessonDescription: z.string().optional(),
  format: z.string(),
  time: z.string(),
  level: z.string(),
  topics: z.array(z.string()),
  proof: z.array(z.string()),
  links: z.object({
    repo: z.string().optional(),
    slides: z.string().optional(),
    notebook: z.string().optional(),
    checklist: z.string().optional(),
    docs: z.string().optional(),
    cases: z.string().optional(),
    templates: z.string().optional(),
  }),
  cta: z.object({
    label: z.string(),
    href: z.string(),
  }),
  status: z.string(),
  visualClass: VisualClassSchema.optional(),
});
export type Module = z.infer<typeof ModuleSchema>;

export const CommunityJoinSchema = z.object({
  mode: z.string(),
  url: z.string(),
  label: z.string(),
});

export const CommunitySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  fit: z.array(z.string()),
  why: z.array(z.string()),
  join: CommunityJoinSchema,
});

export const BookingEntrySchema = z.object({
  label: z.string(),
  url: z.string(),
});

export const BookingSchema = z.object({
  calendly: z.object({
    one_on_one: BookingEntrySchema,
    teach_private: BookingEntrySchema,
    teach_class: BookingEntrySchema,
  }),
  note: z.string(),
});

export const WorkshopSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  description: z.string().max(240),
  replayUrl: z.string(),
  slidesUrl: z.string(),
  tags: z.array(z.string()),
  proofLine: z.string().optional(),
  teachingBullets: z.array(z.string()).optional(),
  audienceLine: z.string().optional(),
});

export type Workshop = z.infer<typeof WorkshopSchema>;

export const PostSchema = z.object({
  id: z.string(),
  date: z.string(),
  title: z.string(),
  summary: z.string().max(240),
  url: z.string(),
  tags: z.array(z.string()),
  proofLinks: proofLinksSchema,
});

export const GPTProofImageSchema = z
  .object({
    type: z.literal('image'),
    label: z.string(),
    imageUrl: z.string(),
    imageAlt: z.string(),
  });

export const GPTProofSampleIOSchema = z
  .object({
    type: z.literal('sample_io'),
    label: z.string(),
    input: z.string(),
    output: z.string(),
  });

export const GPTProofSchema = z.discriminatedUnion('type', [
  GPTProofImageSchema,
  GPTProofSampleIOSchema,
]);

export const GPTIconSchema = z.object({
  src: z.string(),
  alt: z.string(),
});

export type GPTProofImage = z.infer<typeof GPTProofImageSchema>;
export type GPTProofSampleIO = z.infer<typeof GPTProofSampleIOSchema>;
export type GPTProof = z.infer<typeof GPTProofSchema>;
export type GPTIcon = z.infer<typeof GPTIconSchema>;

export const GPTLinksSchema = z.object({
  use: z.string(),
  promptPack: z.string(),
  demo: z.string(),
});

export const GPTSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'prototype', 'archived']),
  tags: z.array(z.string()),
  audience: z.array(z.string()),
  short_desc: z.string().max(160),
  link: z.string().min(1),
  promise: z.string(),
  ships: z.string(),
  how_to_use: z.array(z.string()).length(3),
  limits: z.array(z.string()).length(2),
  links: GPTLinksSchema,
  proof: GPTProofSchema,
  icon: GPTIconSchema.optional(),
});

export type GPT = z.infer<typeof GPTSchema>;
