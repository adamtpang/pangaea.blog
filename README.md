# pangaea.blog

A hub for the spoken & the written word, by [Adam Pang](https://adampang.com). Music, philosophy, business: all of it on one map.

In the lineage of [sive.rs](https://sive.rs), [paulgraham.com](https://paulgraham.com), and Tim Ferriss's *5 Bullet Friday*: owned URL, plain text, durable.

## Stack

- [Astro](https://astro.build) hybrid (mostly static, SSR for `/write` and `/api/write/*`)
- Markdown + MDX content collections (`src/content/posts/`)
- Custom embed components (Spotify, YouTube, SoundCloud, Figure, Quote)
- Deployed to Vercel; domain on Vercel DNS

## The /write editor

Pangaea has its own backstage at **`pangaea.blog/write`** (password-protected). The flow:

1. Drop a topic / note.
2. Claude scaffolds a draft (frontmatter + body + suggested embeds with bracketed placeholders).
3. Polish in the textarea.
4. Click **Publish** → API commits a new MDX file to this repo → Vercel rebuilds → live in ~30 seconds.

Posts default to `draft: true`. Flip in the file (or via another commit) when you're ready.

### Required env vars (Vercel project)

| Name | Purpose |
|---|---|
| `WRITE_PASSWORD` | Gates `/write` and `/api/write/*` via HTTP basic auth |
| `ANTHROPIC_API_KEY` | Claude API key for the scaffolder |
| `GITHUB_TOKEN` | Personal access token with `contents: write` on this repo |
| `GITHUB_OWNER` (optional) | Defaults to `adamtpang` |
| `GITHUB_REPO` (optional) | Defaults to `pangaea.blog` |
| `GITHUB_BRANCH` (optional) | Defaults to `main` |

## Writing a post by hand

Drop a file in `src/content/posts/2026-05-09-the-title.mdx`:

```mdx
---
title: The title
date: 2026-05-09
blurb: One line for the index.
tags: [philosophy, music]
draft: false
---

import { Quote, YouTube, Spotify, SoundCloud, Figure } from '../../components/embeds';

Body text in markdown.

<Spotify uri="track/0NeJjNlprGfZpeX2LQuN6c" />

<Quote attribution="Stewart Brand, 1968">
We are as gods and might as well get good at it.
</Quote>
```

## The Pilot publication (`/pilot`)

`/` and `/pilot` are the monastic, audio-first publication: serif-only,
white on black, single 640px column, no nav, one accent (terracotta `#9e3c1b`).
Stylesheet at `src/styles/pilot.css` (single file, fully commented).
Layout at `src/layouts/PilotLayout.astro`.

### Add a new episode to an existing season

1. Drop a file in `src/content/pilot/0N-slug.md`:

   ```markdown
   ---
   title: Guest first name (or topic)
   track: 6
   guest_name: Full Name
   signature_quote: The single line you want set huge on the page.
   quote_attribution: Speaker name or "the guest"
   duration: "57:23"
   audio_url: https://your-cdn/path-to.mp3
   chapters:
     - timestamp: "00:00"
       title: cold open
     - timestamp: "12:15"
       title: the turn
   ---

   ## Liner notes

   Two or three short paragraphs.

   ## Show notes

   - Book mentioned, linked
   - Idea mentioned, linked
   ```

2. Push. Page lives at `/pilot/0N-slug/`. The album page (`/pilot/`) auto-updates.

### Add a new season

1. Create a new content collection in `src/content/config.ts` (mirror `pilot`),
   e.g. `season2`. Files go in `src/content/season2/`.
2. Add a new page set under `src/pages/season2/` (mirror `pilot/index.astro` and
   `pilot/[...track].astro`, swap the `getCollection` call).
3. Add a new row to the project list on `src/pages/index.astro`.
4. Drop the album cover at `public/season2/cover.svg` (or `.jpg`).

### Add a non-podcast project (Almanack, Notes, Field Notes)

1. Move the "forthcoming" label off the project list row in `src/pages/index.astro`.
2. Build the project's index page under `src/pages/{slug}/index.astro` using
   `PilotLayout.astro` (or its own monastic layout).

## Audio hosting

The `audio_url` on each Pilot episode points at the raw MP3. Cheap options for
self-hosting: any static CDN (Vercel `public/`, S3, R2, Cloudflare, Bunny).
Pop the file in `public/pilot/audio/0N-slug.mp3` and reference it as
`/pilot/audio/0N-slug.mp3` if you want it in-repo. Heavier files belong on a CDN.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to .vercel/output/
npm run preview  # serve the built site
```

To use `/write` locally, create a `.env` with `WRITE_PASSWORD`, `ANTHROPIC_API_KEY`, and `GITHUB_TOKEN`.

## Content rights

All writing © Adam Pang. Linked content belongs to its respective authors.
