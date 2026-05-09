import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // Date is optional so legacy imports (no front-matter date) still validate.
    // Undated posts sort to the bottom and stay off the homepage.
    date: z.coerce.date().default(new Date('1970-01-01')),
    // Optional issue number. Speedrunning to 1,000; every post that has one
    // gets a "№ 042" badge. Leave it off and the post just renders without one.
    number: z.number().int().nonnegative().optional(),
    blurb: z.string().optional(),
    cover: z.string().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(true),
  }),
});

// Inbox: legacy/imported essays that haven't been promoted to /posts yet.
// Lives in src/content/inbox/. Loose schema: title-only is fine. These never
// render publicly; promote one by moving the file into src/content/posts/
// (with date and draft: false) once it's polished.
const inbox = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  posts,
  inbox,
};
