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
    // The song attached to this essay: a Spotify URI, e.g. "track/0NeJj..."
    // (same format Spotify.astro already takes). Every post is meant to
    // eventually carry one picture (cover) and one song (song), the way a
    // post on tynan.com carries a photo, three artifacts folded into one.
    song: z.string().optional(),
    tags: z.array(z.string()).optional(),
    // Optional 3-9 key-takeaway bullets that render as a boxed grid at the
    // bottom of /share/{slug}/ (the screenshot-essay view). Auto-arranged
    // into 3 columns. Skipped when absent.
    bullets: z.array(z.string()).optional(),
    // Anchor essays are the hubs everything wiki-links into (the ~12-20 spine
    // posts). They are the only nodes allowed to grow large in /graph. See
    // STRUCTURE.md.
    anchor: z.boolean().default(false),
    // Maturity (Maggie Appleton's digital-garden move). seedling = thinking out
    // loud, allowed to be unfinished; this is the license to publish early that
    // defuses the posting aversion. evergreen is the rare, finished state.
    status: z.enum(['seedling', 'growing', 'evergreen']).default('evergreen'),
    // Perpetual-draft date (Gwern). Render "Posted X · Updated Y" so a stream of
    // small edits compounds and the work reads as alive.
    updated: z.coerce.date().optional(),
    draft: z.boolean().default(true),
    // Video-ready pipeline (Voice Studio → publish → summon.guide script mode).
    // When true, the post is a spoken script handable to summon.guide: body is
    // the spoken spine, beats is the 3-act outline, spoken_seconds is estimated
    // read-aloud length (~150 wpm), pull_quote is the IG/share line.
    video_ready: z.boolean().default(false),
    spoken_seconds: z.number().int().positive().optional(),
    beats: z.array(z.string()).max(5).optional(),
    pull_quote: z.string().optional(),
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
    date: z.coerce.date().default(new Date('1970-01-01')),
    vlog: z.number().int().nonnegative().optional(),
    youtube: z.string().optional(),
    blurb: z.string().optional(),
    tags: z.array(z.string()).optional(),

    // --- The Van Neistat model (see VIDEOS-1000.md) ---------------------
    // A recurring segment name, so the channel has a shape instead of being a
    // stream of one-offs: build, take, study, ranked, thing, field.
    format: z
      .enum(['build', 'take', 'study', 'ranked', 'thing', 'field', 'flagship'])
      .optional(),
    // Flagship monthly episodes get cut into standalone segments. `parent`
    // points a segment back at the flagship it came from.
    parent: z.string().optional(),
    duration: z.string().optional(),
    // What this video is ABOUT, when it documents another pillar. Lets a video
    // point at the song or app it covers, so the pillars feed each other.
    covers: z.string().optional(),
    // Where it sits: filmed but not cut, cut but not posted, live.
    stage: z.enum(['idea', 'filmed', 'cut', 'published']).default('idea'),
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
    // The "time capsule" hook: recorded long ago, released now. The album page
    // can show "Recorded {recorded_date} · Released {released_date}".
    recorded_date: z.coerce.date().optional(),
    released_date: z.coerce.date().optional(),
    audio_url: z.string().optional(),
    video_url: z.string().optional(),
    references: z
      .array(z.object({ label: z.string(), url: z.string() }))
      .optional(),
    chapters: z
      .array(z.object({ timestamp: z.string(), title: z.string() }))
      .optional(),
    // Held episodes (recorded but set aside for a later season) stay draft:true.
    draft: z.boolean().default(true),
  }),
});

// Songs moved out to strummer.fun-songs (its own Astro site). See
// SONGS-1000.md there for the model. Nothing songs-related lives here anymore.

// Reels: short-form essay/book video, the spoken pillar's shortest unit (see
// reels/README.md — "essays and books to video," vertical, ~30-90s). Each
// reel is authored as a script at reels/{slug}.md (hook/beats/CTA, not
// synced here); this collection is the PUBLISHED metadata once a script is
// rendered (or queued): where the video lives, its poster, and its source
// essay. `rendered: false` reels show as "in production" — a real, honest
// state, not a placeholder pretending to be ready.
const reels = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().default(new Date('1970-01-01')),
    number: z.number().int().nonnegative().optional(),
    // The essay/post this reel adapts, e.g. "/posts/agency-is-the-only-skill" or an external URL.
    source: z.string().optional(),
    length: z.string().optional(), // e.g. "35s", author's own estimate from the script
    blurb: z.string().optional(),
    rendered: z.boolean().default(false),
    video: z.string().optional(), // public/ path to the mp4, only when rendered
    poster: z.string().optional(), // public/ path to a poster frame
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(true),
  }),
});

// Apps: the third artistry pillar. Each app is an entry in src/content/apps/
// with a live url, a screenshot (cover), and a one-line thesis. The body is
// optional build-log notes. `number` is the odometer toward 1,000.
const apps = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().default(new Date('1970-01-01')),
    number: z.number().int().nonnegative().optional(),
    url: z.string().optional(), // live link
    blurb: z.string().optional(), // one-line thesis
    cover: z.string().optional(), // screenshot
    tags: z.array(z.string()).optional(),
    status: z.enum(['live', 'wip', 'archived']).default('live'),
    draft: z.boolean().default(true),
  }),
});

// Cities: the fifth pillar. Network-state and city-state experiments, the
// interneta.world lane. A "city" is a proposed or forming society: a thesis
// about how a group of people should live and govern together. `number` is the
// odometer toward 1,000.
const cities = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().default(new Date('1970-01-01')),
    number: z.number().int().nonnegative().optional(),
    url: z.string().optional(),
    blurb: z.string().optional(),
    cover: z.string().optional(),
    location: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(['proposed', 'forming', 'live', 'archived']).default('proposed'),
    draft: z.boolean().default(true),
  }),
});

// Favorites: a public running record of the people, art, and creators that
// have actually taken root in Adam's mind, right now, not a ranked "best of"
// list. Each entry gets built from a real interview (Claude asks, Adam
// answers) plus whatever's already sitting in his Obsidian vault about it,
// never written cold from Claude's own opinion of the thing. `category`
// groups the list page; the body can use the same MDX embed kit as posts
// (YouTube for a channel, Spotify for an artist) when there's something to
// embed, or just be Adam's own writeup when there isn't.
const favorites = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(), // the thing or person's name, e.g. "Aphex Twin"
    date: z.coerce.date().default(new Date('1970-01-01')), // when added
    category: z.enum(['music', 'video', 'person', 'tool', 'book', 'other']),
    blurb: z.string().optional(), // one line, in Adam's own words, why this
    url: z.string().optional(), // the thing's own site/channel/profile
    cover: z.string().optional(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(true),
  }),
});

export const collections = {
  posts,
  inbox,
  episodes,
  vlogs,
  reels,
  pilot,
  apps,
  cities,
  favorites,
};
