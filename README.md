# pangaea.blog

A hub for the spoken & the written word, by [Adam Pang](https://adampang.com). Music, philosophy, business — all of it on one map.

In the lineage of [sive.rs](https://sive.rs), [paulgraham.com](https://paulgraham.com), and Tim Ferriss's *5 Bullet Friday*: owned URL, plain text, durable.

## Stack

- [Astro](https://astro.build) hybrid (mostly static, SSR for `/write` and `/api/write/*`)
- Markdown + MDX content collections (`src/content/posts/`)
- Custom embed components (Spotify, YouTube, SoundCloud, Figure, Quote)
- Deployed to Vercel; domain on Vercel DNS

## The /write editor

Pangaea has its own backstage at **`pangaea.blog/write`** — password-protected. The flow:

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
