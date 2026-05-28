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
    // Optional 3-9 key-takeaway bullets that render as a boxed grid at the
    // bottom of /share/{slug}/ (the screenshot-essay view). Auto-arranged
    // into 3 columns. Skipped when absent.
    bullets: z.array(z.string()).optional(),
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

// Episodes: the spoken-word side of Pangaea. Each episode is a markdown/MDX
// file in src/content/episodes/. The `youtube` field (a video ID) drives the
// auto-embed on the /podcast list and the episode page; the body is show notes
// (topics, links, timestamps), and can use <YouTube> for clips referenced.
const episodes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    episode: z.number().int().nonnegative().optional(),
    youtube: z.string().optional(), // YouTube video ID, e.g. "dQw4w9WgXcQ"
    blurb: z.string().optional(),
    guest: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(true),
  }),
});

// Vlogs: the watched side of Pangaea. Visual essays + YouTube-hosted videos.
// Same shape as episodes but a distinct lane in the hub (/vlog).
const vlogs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    vlog: z.number().int().nonnegative().optional(),
    youtube: z.string().optional(),
    blurb: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(true),
  }),
});

// Pilot: Pangaea's audio publication, Season 1. Different lane from /podcast
// (which is the YouTube-embed long-form). Pilot is monastic: serif-only
// pages at /pilot/{track}, self-hosted MP3 via <audio>, big pull quote per
// episode, chapter timestamps in frontmatter.
const pilot = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    track: z.number().int().positive(),
    guest_name: z.string(),
    signature_quote: z.string(),
    quote_attribution: z.string(),
    duration: z.string().optional(),
    audio_url: z.string().optional(),
    chapters: z
      .array(z.object({ timestamp: z.string(), title: z.string() }))
      .optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  posts,
  inbox,
  episodes,
  vlogs,
  pilot,
};
