# Working on pangaea.blog

This repo is Adam's personal blog at https://pangaea.blog. Astro hybrid site (mostly static, with SSR for the backstage editor), deployed to Vercel. **Private repo.**

## The mission

1,000 high-quality essays. Weekly cadence (Fridays) at minimum, daily ideal. Each post is multi-modal worldbuilding: a written spine plus song, image, video, quote, or tool embeds when they belong.

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

## Voice & punctuation

- Terse, considered, eclectic. Whole Earth Catalog energy. Sive.rs brevity. 150 to 400 words is the target for a typical post.
- **No em dashes (—) or en dashes (–).** Use commas, semicolons, colons, periods, or parentheses. Hyphens inside compound words ("first-person") are fine.

## Conventions

- Brand color: iron-oxide red `#8a3b1f` (var `--accent` in `src/styles/global.css`).
- Type: serif body (Iowan / Charter / Georgia stack), sans for meta, mono for issue numbers/code.
- Don't add JavaScript to public pages unless there's a real reason. `/posts` (search), `/graph` (canvas), and `/write` have JS by necessity.

## Don't do

- Don't add a tracking pixel, ad network, or analytics that requires consent banners.
- Don't change the `--measure` past ~38rem on public pages; line length is intentional.
- Don't introduce a CMS. The git repo IS the CMS, and `/write` just makes commits to it.
- Don't bring back the "rift" name or the forced 1-app/1-essay/1-song schema.
- Don't reintroduce em dashes anywhere in public-facing copy.
- Don't render the `inbox` collection on the public site.
