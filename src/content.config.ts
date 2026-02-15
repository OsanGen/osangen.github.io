import { defineCollection, z } from 'astro:content';

const data = defineCollection({
  type: 'data',
  schema: z.any(),
});

export const collections = {
  data,
};
