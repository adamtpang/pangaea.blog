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

## The /daily page (the capture surface)

`/daily` is where the writing starts: 300 words a day, spoken or typed. It was
its own product at 300words.app and now lives here, so capture and publish share
one codebase and one design system.

- **Local-first.** Everything (today's page, streaks, 30-day history) lives in
  `localStorage` under `w300.entries.v1`, shaped `{ "YYYY-MM-DD": {text, words, updatedAt, doneAt?} }`.
  Nothing leaves the device until Adam presses Send. `persist()` merges onto the
  freshest stored state and only overlays today, so a stale tab cannot clobber
  other days. Past days open read-only; only today is editable.
- **Voice.** Pairs with [Handy](https://handy.computer) with zero integration
  (system-wide dictation just types into the focused textarea). The mic button is
  the in-browser fallback via the Web Speech API (Chrome / Edge), with a capped
  auto-restart so a network or mic failure cannot loop forever.
- **Send to /write** navigates same-origin to `/write?from=daily&title=…&seed=…`,
  which assembles it into a seedling draft. That is the front of capture ->
  scaffold -> ship.
- **Migration.** The standalone app was another origin, so its `localStorage` does
  not follow. `/daily` has "Back up everything (.json)" and "Restore from backup",
  which merges and keeps whichever version of a day has more writing.
- **Sync (optional, off until configured).** `POST /api/daily/sync` merges the
  browser's entries with the server's and returns the union, so one request is
  both push and pull. Storage is a single JSON blob at `daily/entries.json` on a
  dedicated **`daily` branch** of this repo, so main's history stays clean, and
  every commit is tagged `[skip ci]` so writing never triggers a Vercel rebuild.
  It reuses `GITHUB_TOKEN`; no new service.
  - **Auth: sign in with GitHub.** `/api/auth/github` starts it, `/api/auth/callback`
    finishes it, `/api/auth/me` reports who you are, `/api/auth/logout` ends it.
    There is no user table: the session IS an HMAC-signed cookie (`src/lib/session.ts`),
    and "logged in" means GitHub confirmed a login on the allowlist. Env vars:
    `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `SESSION_SECRET`
    (falls back to `WRITE_PASSWORD`), and `ALLOWED_GITHUB_LOGINS` (comma separated,
    defaults to `GITHUB_OWNER` then `adamtpang`). The OAuth callback URL must be
    `https://pangaea.blog/api/auth/callback`.
  - **Legacy fallback: `DAILY_PASSWORD`** (falls back to `WRITE_PASSWORD`), sent as
    the `x-daily-key` header, kept so existing devices and scripts keep working.
    The endpoint **fails closed**: with neither OAuth nor a password configured it
    returns 503 and does nothing, so a public URL cannot expose the journal by
    default. `/daily` only offers the passphrase UI when the server says it exists.
  - **Merge rule, both sides:** a day never shrinks. More words wins, `updatedAt`
    breaks ties. That makes sync order-independent, so a stale tab or a second
    device can never delete work. The client additionally refuses to overwrite
    today's page while the textarea has focus.
  - Local-first is still the contract: the server is a backup and a cross-device
    merge, never the source of truth. Sync off, or offline, means the page saves
    to the device exactly as before.
- **Seed prompts (`/api/daily/seeds`).** A rotating pick of 3 prompts from
  `src/data/dailySeeds.ts`, sourced from `SEEDS-FARCASTER.md` / `SEEDS-OBSIDIAN.md`
  / `src/content/inbox/`. Deterministic by `(date, round)`; "shuffle" just bumps
  `round`. **Gated behind the same auth as sync, on purpose**: some seeds come
  from private Obsidian notes, not just public Farcaster casts, so an
  unauthenticated visitor gets no seed bar at all rather than a redacted one.
  Never import `dailySeeds.ts` into client-shipped code.
- **AI polish (`/api/daily/polish`).** Turns the day's rough spoken/typed page
  into a claim-titled, 150-400 word draft via a single forced-tool-call request
  to the Anthropic Messages API (raw `fetch`, model `claude-opus-5`, no SDK).
  Adaptive thinking is left ON (not `disabled`) even though it is a quick task,
  because disabling thinking on a forced `tool_choice` call risks the model
  writing the tool call as plain text instead of a real `tool_use` block. Never
  runs automatically; only on the "Polish into an essay" tap, which appears
  once the page reaches 300 words and sync is authorized (same gate as seeds).
  The result is local-only (`w300.polish.v1` in `localStorage`), never synced;
  "Send to /write" prefers a polish for the viewed day when one exists, with a
  "send raw instead" escape hatch.

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

Pangaea's homepage and Season 1 are an **audio-first, monastic publication**: single column max 640px, no nav, no animation, no shadows, serif throughout. Uses `PilotLayout.astro` (not `Base.astro`) and its own stylesheet at `src/styles/pilot.css` (single file, fully commented). `pilot.css` now `@import`s `tokens.css`, so it shares the site-wide palette and type; what stays monastic is the LAYOUT discipline, not a separate color scheme. Do not reintroduce a local `:root` there.

Collection at `src/content/pilot/` with episode frontmatter: `title`, `track`, `guest_name`, `signature_quote`, `quote_attribution`, `duration` (optional), `audio_url` (optional, omit if not yet hosted), `chapters` (array), `draft`.

Pages:
- `/` — wordmark + about paragraph + project list (Pangaea Pilot + forthcoming Almanack / Notes / Field Notes)
- `/pilot/` — album page: wordmark, cover (placeholder at `public/pilot/cover.svg`), tracklist, liner notes, big pull quote
- `/pilot/{track}/` — episode page: title + number, `<audio controls>`, huge pull quote, markdown body (liner + show notes), chapter list from frontmatter, prev/next links

**Empty-frontmatter rule applies here too:** omit `audio_url` entirely if not set (do not leave blank). The schema accepts `.optional()` only when the field is absent.

The hub-style (Base.astro, verb nav, blue/green Earth palette) is now used **only by the older lanes** at `/posts`, `/podcast`, `/vlog`, `/graph`, `/about`. Those URLs still resolve but are not linked from the new homepage.

## The Almanack (`adamanack/`)

*Poor Adam's Almanack* — the aphorism book the homepage lists as forthcoming. Its whole codebase lives in `adamanack/` (self-contained: Typst manuscript, corpus, scripts, its own Astro site). Shipped v1.0 at **https://adamanack.com**; 117 aphorisms across 8 themes, ~5 min read.

**Read `ADAMANACK.md` at the repo root before touching it.** That file is the full handoff: current state, the edit→deploy loop, locked decisions, and the one open decision (expand from 117 to ~393 aphorisms, the Pareto 20% of the source corpus).

It deploys independently to its own Vercel project and GitHub repo — it is not built by pangaea's Astro build. Integrating it as a native `/almanack` route is a listed next step, not done.

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

Pangaea owns the approved public episode pages and show notes. Time Capsule raw
media, cuts, transcripts, consent gates, final QA, and delivery packages are owned
by `footage.center`; its canonical private record is
`productions/time-capsule/README.md` in that repository. Route production work
through the verified repos.chat relationship instead of rebuilding it here.

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

## Design system: "the daily page"

ONE system for the whole site: music, philosophy, tech and business, all in one voice. It is the writing surface made into a website (it came from the daily page at `/daily`): paper you want to write on, ink you can read for an hour, one warm accent that means "link", and a gold that means "ours".

**Single source of truth: `src/styles/tokens.css`.** Both stylesheets `@import` it, so the monastic pages and the hub pages move together:
- `global.css` (Base.astro): `/posts`, `/songs`, `/apps`, `/daily`, `/graph`, `/write`, ...
- `pilot.css` (PilotLayout.astro): `/`, `/pilot`, `/pilot/[track]`

Do not redeclare colors or fonts in either stylesheet. Edit `tokens.css`. The `/share` page keeps its own synced copy on purpose (it must be self-contained for screenshots), so update it in step.

- `--paper #fbf7f0` warm sheet, `--paper-2 #f5efe4`, `--paper-3 #efe7d8`, `--surface #ffffff` for inputs
- `--ink #1c1917`, `--ink-soft #403a34`, `--ink-mute #6b625a` (the old `--muted`)
- `--accent #b34a2f` TERRACOTTA, `--accent-deep #8f3721`, `--accent-tint #e8cfc3`
- `--gold #8a6d34` (the old `--land`), `--gold-soft #c9b183`
- `--rule #d9cfbe`, `--rule-soft #e7decf`
- Legacy aliases `--bg`, `--muted`, `--land`, `--accent-soft` still resolve, so old rules keep working. New code should use the names above.

**Usage discipline (do not blur this):**
- TERRACOTTA `--accent` = interaction ONLY: links, focus rings, reading-flow accent bars (hero, pullquote, cadence border), active state.
- GOLD `--gold` = identity ONLY, never interaction: brand-mark dot, № issue badges, the /share masthead stripe, graph nodes, progress numbers.
- PAPER = the page: backgrounds and breathing room. The body carries a faint two-wash + fractal-noise grain; keep it subtle enough to read as texture, not pattern.
- Headings stay `--ink`. Never color a heading. Color is never the only affordance (links stay underlined). All text tokens clear WCAG AA on `--paper`.
- The three threads (`--music` plum, `--philosophy` moss, `--tech` slate) are for topic markers ONLY: tag chips and thread labels. Never body text, never a heading, never a link. The system is one voice; these are just the room it is spoken in.

`Dino.astro` is a Pangaea-era sauropodomorph silhouette (fossil-plate, not mascot), used small and low-opacity in the footer. Keep it a watermark; do not make it loud or childish. `Globe.astro` is an antique plate: dark sepia sphere, fired-clay supercontinent, not a photograph.

- Type: **Fraunces** display (`--display`, headings and wordmarks) over **Newsreader** body (`--serif`), both from Google Fonts, loaded in `Base.astro`, `PilotLayout.astro`, and `/share`. Serif throughout: `--sans` deliberately resolves to the body serif, so there is no sans anywhere. Mono only for issue numbers and code.
- Don't add JavaScript to public pages unless there's a real reason. `/posts` (search), `/graph` (canvas), and `/write` have JS by necessity.
- Don't render the `episodes` collection anywhere except `/podcast` and `/podcast/[slug]`.

## Making music with Claude (Ableton MCP)

`scripts/README-ableton-mcp.md` has the setup. Once Live is open with the
AbletonMCP control surface selected, this session's `.mcp.json` gives Claude
tools to create tracks, write MIDI, load instruments, and fire clips directly.

**While driving it, narrate progress in game terms, out loud, as it happens.**
That live narration — not the after-the-fact scoreboard — is what makes
creating more fun than scrolling Spotify. After each meaningful step (a chord
progression goes in, a melody gets recorded, a track moves to `produced`),
say what just happened and roughly what it's worth per `MUSIC-GAME.md`'s XP
table, the same way `tools/music-session.ps1` does when it's watching files
directly. Don't wait for a session recap at the end — the reward has to land
in the moment, mid-session, or it doesn't do its job.

Run `tools/music-session.ps1` alongside a session (in a second terminal, or
ask Adam to) for the live watch-and-beep version of the same idea when he's
working by hand rather than through Claude.

## Pulling from Spotify (Spotify MCP)

`scripts/README-spotify-mcp.md` has the setup. The credential + login steps
are Adam's alone (a Developer Dashboard secret and a one-time OAuth browser
login) — Claude preps everything else (the `.mcp.json` entry, dependency
verification) but cannot complete those two. Once authenticated, `spotify_*`
tools give real liked-songs, recently-played, search, and playlist access —
use this instead of the one-off Neon pulls from `users.top_tracks` when it's
available; the Neon data is a cached snapshot from vibecheck.style, this is
live.

## Don't do

- Don't add a tracking pixel, ad network, or analytics that requires consent banners.
- Don't change the `--measure` past ~38rem on public pages; line length is intentional.
- Don't introduce a CMS. The git repo IS the CMS, and `/write` just makes commits to it.
- Don't bring back the "rift" name or the forced 1-app/1-essay/1-song schema.
- Don't reintroduce em dashes anywhere in public-facing copy.
- Don't render the `inbox` collection on the public site.
- Don't revert the AbletonMCP remote-script security fixes (loopback-only
  bind, telemetry disabled) if reinstalling or upgrading — see
  `scripts/README-ableton-mcp.md`.
