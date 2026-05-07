import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Date is optional so legacy imports (no front-matter date) still validate.
    // Undated posts sort to the bottom and stay off the homepage.
    date: z.coerce.date().default(new Date('1970-01-01')),
    blurb: z.string().optional(),
    cover: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(true),
  }),
});

export const collections = {
  posts,
};
