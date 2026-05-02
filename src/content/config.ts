import { defineCollection, z } from 'astro:content';

const rifts = defineCollection({
  type: 'content',
  schema: z.object({
    number: z.number(),
    title: z.string(),
    date: z.coerce.date(),
    blurb: z.string().optional(),
    app: z.object({
      name: z.string(),
      url: z.string().url(),
      note: z.string(),
    }),
    essay: z.object({
      title: z.string(),
      author: z.string(),
      url: z.string().url(),
      note: z.string(),
    }),
    song: z.object({
      title: z.string(),
      artist: z.string(),
      url: z.string().url(),
      note: z.string(),
    }),
    extra: z
      .object({
        kind: z.enum(['image', 'video', 'quote', 'link']),
        url: z.string().url().optional(),
        caption: z.string().optional(),
      })
      .optional(),
    draft: z.boolean().default(false),
  }),
});

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    blurb: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  rifts,
  essays,
};
