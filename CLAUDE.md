# Working on pangaea.blog

This repo is Adam's personal blog at https://pangaea.blog. Astro hybrid site (mostly static, with SSR for the backstage editor), deployed to Vercel.

## Adding a post

A post is a markdown or MDX file at `src/content/posts/YYYY-MM-DD-slug.{md,mdx}`. The schema lives in `src/content/config.ts`. Required: `title`. Optional: `date`, `number`, `blurb`, `cover`, `tags`, `draft`.

Default new posts to `draft: true`. The build excludes drafts from the homepage, the posts index, and the RSS feed.

## The /write editor (the main authoring path)

`/write` is a password-gated backstage editor at pangaea.blog/write. Adam types a topic, Claude scaffolds a draft (`POST /api/write/scaffold`), Adam polishes in the textarea, then "Publish" commits a new MDX file to `src/content/posts/` via the GitHub Contents API (`POST /api/write/publish`). Vercel auto-rebuilds.

Required env vars on Vercel: `WRITE_PASSWORD`, `ANTHROPIC_API_KEY`, `GITHUB_TOKEN` (fine-grained PAT, scoped to adamtpang/pangaea.blog with Contents: Read & write). Optional: `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH` (defaults match this repo).

## MDX embeds

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

The AI scaffolder is taught these. New components go in `src/components/embeds/` and re-export from `index.ts`.

## Voice & punctuation

- Terse, considered, eclectic. Whole Earth Catalog energy. Sive.rs brevity. 150 to 400 words is the target for a typical post.
- **No em dashes (—) or en dashes (–).** Use commas, semicolons, colons, periods, or parentheses. This applies to all public-facing copy and to AI-scaffolded drafts. Hyphens inside compound words ("first-person") are fine.

## Conventions

- Brand color: iron-oxide red `#8a3b1f` (var `--accent` in `src/styles/global.css`).
- Type: serif body (Iowan / Charter / Georgia stack), sans for meta, mono for issue numbers/code.
- Don't add JavaScript to public pages unless there's a real reason. The /write editor has client JS by necessity; everything else stays static HTML.

## Don't do

- Don't add a tracking pixel, ad network, or analytics that requires consent banners.
- Don't change the `--measure` past ~38rem on public pages; line length is intentional.
- Don't introduce a CMS. The git repo IS the CMS, and /write just makes commits to it.
- Don't bring back the "rift" name or the forced 1-app/1-essay/1-song schema. Posts are loose by design.
- Don't reintroduce em dashes anywhere in public-facing copy.
