# Working on pangaea.blog

This repo is Adam's personal blog at https://pangaea.blog. Astro hybrid site (mostly static, with SSR for the backstage editor), deployed to Vercel. **Private repo.**

## The mission

1,000 high-quality essays. Weekly cadence (Fridays) at minimum, daily ideal. Each post is multi-modal worldbuilding: a written spine plus song, image, video, quote, or tool embeds when they belong. Pangaea is a hub for the spoken AND the written word: `/posts` is the writing, `/podcast` is the spoken side (YouTube-hosted episodes).

## Adding a post

A post is a markdown or MDX file at `src/content/posts/YYYY-MM-DD-slug.{md,mdx}`. The schema lives in `src/content/config.ts`. Required: `title`. Optional: `date`, `number`, `blurb`, `cover`, `tags`, `draft`.

Default new posts to `draft: true`. The build excludes drafts from the homepage, the posts index, RSS, and the graph.

## Promoting from /inbox

Adam's legacy essays live in `src/content/inbox/` (their own collection, never rendered publicly). To promote one to a public post:
1. Move the file from `src/content/inbox/foo.md` to `src/content/posts/YYYY-MM-DD-foo.md`.
2. Add `date:` and `draft: false` to the frontmatter.
3. Optionally add `number:`, `blurb:`, `tags:`.

## The /write editor (the main authoring path)

`/write` is a password-gated backstage editor. Adam types a topic, Claude scaffolds a multi-modal MDX draft (`POST /api/write/scaffold`), Adam polishes in the textarea, then "Publish" commits a new MDX file to `src/content/posts/` via the GitHub Contents API (`POST /api/write/publish`). Vercel auto-rebuilds.

Required env vars on Vercel: `WRITE_PASSWORD`, `ANTHROPIC_API_KEY`, `GITHUB_TOKEN` (fine-grained PAT, scoped to `adamtpang/pangaea.blog` with **Contents: Read & write**). Optional: `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`.

## MDX embeds (the worldbuilding kit)

Posts can be `.mdx` and use embed components. Pattern at the top of the body:

```mdx
import { Quote, YouTube, Spotify, SoundCloud, Figure } from '../../components/embeds';
```

Then inline:
- `<Quote attribution="Author">Pull quote.</Quote>`
- `<YouTube id="VIDEO_ID" />`
- `<Spotify uri="track/SPOTIFY_ID" />`
- `<SoundCloud url="https://soundcloud.com/..." />`
- `<Figure src="/images/foo.jpg" alt="..." caption="..." />`

A typical Pangaea post bundles 1 to 3 of these alongside the prose. Not every type every post; only when the artifact genuinely belongs. New embed components go in `src/components/embeds/` and re-export from `index.ts`.

## Wiki-links

Posts can reference each other with `[[Some Post Title]]` syntax. Powered by `remark-wiki-link`. The link resolves to `/posts/some-post-title/` based on title slugify. Use `[[Other Post|custom anchor text]]` for alt label. The `/graph` page renders all posts + wiki-links as a force-directed network.

## Searchable posts index

The `/posts` page has client-side search + sort + tag filtering, all in vanilla JS (no framework). Scales to 1,000 posts. Press `/` from any non-input element to focus the search box.

## Cadence widget

`/posts` shows a live cadence header: total posts, this-year count, this-week count, days since last, next-Friday ship deadline, and remaining-to-1,000 countdown. Weekly cadence is the floor.

## The Pilot publication (`/` and `/pilot`)

Pangaea's homepage and Season 1 are an **audio-first, monastic publication**: pure white background, pure black text, ONE accent (terracotta `#9e3c1b`), serif throughout (Times New Roman), single column max 640px, no nav, no animation, no shadows. Uses `PilotLayout.astro` (not `Base.astro`) and its own stylesheet at `src/styles/pilot.css` (single file, fully commented).

Collection at `src/content/pilot/` with episode frontmatter: `title`, `track`, `guest_name`, `signature_quote`, `quote_attribution`, `duration` (optional), `audio_url` (optional, omit if not yet hosted), `chapters` (array), `draft`.

Pages:
- `/` — wordmark + about paragraph + project list (Pangaea Pilot + forthcoming Almanack / Notes / Field Notes)
- `/pilot/` — album page: wordmark, cover (placeholder at `public/pilot/cover.svg`), tracklist, liner notes, big pull quote
- `/pilot/{track}/` — episode page: title + number, `<audio controls>`, huge pull quote, markdown body (liner + show notes), chapter list from frontmatter, prev/next links

**Empty-frontmatter rule applies here too:** omit `audio_url` entirely if not set (do not leave blank). The schema accepts `.optional()` only when the field is absent.

The hub-style (Base.astro, verb nav, blue/green Earth palette) is now used **only by the older lanes** at `/posts`, `/podcast`, `/vlog`, `/graph`, `/about`. Those URLs still resolve but are not linked from the new homepage.

## The three lanes (the media hub, legacy)

Pangaea is a media leverage hub with three content lanes, each with its own collection, list page, and detail page. The nav uses verbs (Tetragrammaton-style): **Read** (`/posts`) · **Listen** (`/podcast`) · **Watch** (`/vlog`) · **Graph** (`/graph`). All three lanes use the same MDX + embed kit; URLs and templates differ.

| Lane | Collection | List | Detail | Frontmatter |
|---|---|---|---|---|
| Read | `posts` | `/posts/` | `/posts/{slug}/` | title, date, number, blurb, cover, tags, draft |
| Listen | `episodes` | `/podcast/` | `/podcast/{slug}/` | title, date, episode, youtube, blurb, guest, tags, draft |
| Watch | `vlogs` | `/vlog/` | `/vlog/{slug}/` | title, date, vlog, youtube, blurb, tags, draft |

For Listen + Watch: the `youtube` field is a video ID like `dQw4w9WgXcQ`. The list pages render YouTube thumbnail cards (lighter than full embeds); the detail page embeds the full player and renders the body as show notes. The homepage shows a 3-lane "Latest read / Latest listen / Latest watch" hub above the post list.

## Podcast (`/podcast`)

Episodes are markdown/MDX files in `src/content/episodes/`. Empty frontmatter fields must be **omitted entirely**, not left blank (Astro/Zod parses blank values as null and rejects them). `/podcast` shows a "coming soon" empty state until at least one episode has `draft: false`.

## Vlogs (`/vlog`)

Mirrors `/podcast` exactly, with `vlog: N` instead of `episode: N`. Same empty-frontmatter rule. Same YouTube-thumbnail card list, full-embed detail page.

## Screenshot essays for social (`/share/[slug]`)

Every published post auto-generates a screenshot-optimized view at `/share/{slug}/`. The frame is fixed **1080 × 2160** (canonical 1:2 for X / IG / threads): supercontinent stripe at the top, Pangaea masthead + № + date, big serif headline, italic blurb with ocean-accent rule, full body (including all MDX embeds), optional 3-column takeaway grid (Codia-template style; opt-in via a `bullets:` array in post frontmatter), colophon with `pangaea.blog/posts/{slug}` URL.

To post on X / IG: visit the share URL, screenshot the frame (Cmd+Shift+4 on Mac · Win+Shift+S on Windows), upload. Append `?guide=1` to the URL to see exactly where the 1080×2160 cut lands so a square-ish screenshot captures a complete frame.

No image-generation deps, no Figma required. A "Screenshot for X / IG →" link is wired into every post detail page. The share view inherits a self-contained stylesheet (not Base.astro) so it can be designed for the screenshot context independently.

## Figma path (stub, waiting on file URL)

The /write editor can be extended to ALSO generate a Figma frame in Adam's `screenshotessays` Figma file in parallel with the MDX commit. Requirements before wiring this up:
1. The Figma file URL (or fileKey) for the screenshotessays project.
2. An Editor seat on the Figma team (current seat shows as "View" tier on `team::1495631974460049950`, which blocks Plugin API writes).
3. A template frame in that file with named children (title, body, footer) so the integration can fill them in.

When those exist, add a `FIGMA_FILE_KEY` env var, a `FIGMA_TEMPLATE_NODE_ID` env var, and a `/api/write/figma` endpoint that calls `use_figma` to clone the template and fill text layers from the scaffolded MDX.

## Voice & punctuation

- Terse, considered, eclectic. Whole Earth Catalog energy. Sive.rs brevity. 150 to 400 words is the target for a typical post.
- **No em dashes (—) or en dashes (–).** Use commas, semicolons, colons, periods, or parentheses. Hyphens inside compound words ("first-person") are fine.

## Design system: "the blue marble"

Palette is Earth seen from space. Tokens in `src/styles/global.css` `:root` (the `/share` page and `/graph` script keep their own synced copies):

- `--bg #f3f7f6` sea-mist white, `--surface #ffffff` for inset surfaces (sky / space / clouds)
- `--ink #14201f` abyssal near-black, `--muted #4d635f` slate-teal, `--rule #cad9d3` hairline
- `--accent #176079` OCEAN blue, `--accent-soft #6a9bad` shallow water
- `--land #2f6b4f` PANGAEA green, `--land-soft #8fb6a1` lichen

**Usage discipline (do not blur this):**
- BLUE `--accent` = the ocean: links, focus rings, reading-flow accent bars (hero, pullquote, cadence border).
- GREEN `--land` = the supercontinent: brand-mark dot, № issue badges, the /share masthead stripe, progress numbers. Identity, never interaction.
- WHITE = sky/space: backgrounds and breathing room.
- Headings stay `--ink`. Never color a heading. Color is never the only affordance (links stay underlined). All text tokens clear WCAG AA (~5.6:1+) on `--bg`.

`Dino.astro` is a Pangaea-era sauropodomorph silhouette (fossil-plate, not mascot), used small and low-opacity in the footer. Keep it a watermark; do not make it loud or childish.

- Type: serif body (Iowan / Charter / Georgia stack), sans for meta, mono for issue numbers/code.
- Don't add JavaScript to public pages unless there's a real reason. `/posts` (search), `/graph` (canvas), and `/write` have JS by necessity.
- Don't render the `episodes` collection anywhere except `/podcast` and `/podcast/[slug]`.

## Don't do

- Don't add a tracking pixel, ad network, or analytics that requires consent banners.
- Don't change the `--measure` past ~38rem on public pages; line length is intentional.
- Don't introduce a CMS. The git repo IS the CMS, and `/write` just makes commits to it.
- Don't bring back the "rift" name or the forced 1-app/1-essay/1-song schema.
- Don't reintroduce em dashes anywhere in public-facing copy.
- Don't render the `inbox` collection on the public site.
