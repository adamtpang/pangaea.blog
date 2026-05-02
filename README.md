# pangaea.blog

A weekly catalog of one app, one essay, one song — by [Adam Pang](https://adamtpang.substack.com).

Pangaea is a personal site in the lineage of [sive.rs](https://sive.rs), [tim.blog](https://tim.blog), and [waitbutwhy.com](https://waitbutwhy.com): owned URL, plain text, durable. Each weekly issue is called a **rift**.

## Stack

- [Astro](https://astro.build) — static site generator, ships zero JS by default.
- Markdown-based content collections (`src/content/rifts/`, `src/content/essays/`).
- Deployed as static HTML to Vercel / Cloudflare Pages.

## Writing a new rift

Drop a markdown file in `src/content/rifts/` named like `002-the-rift-title.md`:

```markdown
---
number: 2
title: The title of this rift
date: 2026-05-09
blurb: One line that shows up in the index.
draft: false
app:
  name: Some App
  url: https://example.com
  note: Why it matters.
essay:
  title: The essay title
  author: Some Writer
  url: https://example.com/essay
  note: Why you should read it.
song:
  title: Track name
  artist: Artist name
  url: https://open.spotify.com/track/...
  note: Why this song this week.
extra:           # optional: quote, image, video, link
  kind: quote
  caption: "Some line worth keeping."
---

Body text here, in markdown. Keep it short.
```

Set `draft: true` to keep a rift hidden from the index and RSS feed until ready.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview  # serve the built site
```

## Deployment

The `main` branch deploys automatically to Vercel. The custom domain `pangaea.blog` is mapped at the host level.

## Content rights

All writing © Adam Pang. Linked content belongs to its respective authors.
